import axios from 'axios';
import type { ApiResponse, PaginatedData, LoginResponse, Post, Category, Comment, DashboardStats } from '../types';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
});

// 请求拦截器
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

// Auth API
export const loginApi = {
  login: (username: string, password: string) =>
    api.post<unknown, ApiResponse<LoginResponse>>('/auth/login', { username, password }),
  getMe: () => api.get<unknown, ApiResponse<null>>('/auth/me')
};

// Posts API
export const postsApi = {
  getList: (params: { page?: number; pageSize?: number; category_id?: number; status?: string; keyword?: string }) =>
    api.get<unknown, ApiResponse<PaginatedData<Post>>>('/posts', { params }),
  getById: (id: number) => api.get<unknown, ApiResponse<Post>>(`/posts/${id}`),
  create: (data: Partial<Post>) => api.post<unknown, ApiResponse<{ id: number; slug: string }>>('/admin/posts', data),
  update: (id: number, data: Partial<Post>) => api.put<unknown, ApiResponse<null>>(`/admin/posts/${id}`, data),
  delete: (id: number) => api.delete<unknown, ApiResponse<null>>(`/admin/posts/${id}`)
};

// Categories API
export const categoriesApi = {
  getList: () => api.get<unknown, ApiResponse<Category[]>>('/categories'),
  create: (data: Partial<Category>) => api.post<unknown, ApiResponse<{ id: number }>>('/admin/categories', data),
  update: (id: number, data: Partial<Category>) => api.put<unknown, ApiResponse<null>>(`/admin/categories/${id}`, data),
  delete: (id: number) => api.delete<unknown, ApiResponse<null>>(`/admin/categories/${id}`)
};

// Comments API
export const commentsApi = {
  getByPost: (postId: number) => api.get<unknown, ApiResponse<Comment[]>>(`/comments/post/${postId}`),
  add: (data: { post_id: number; author_name: string; author_email?: string; content: string }) =>
    api.post<unknown, ApiResponse<{ id: number }>>('/comments', data),
  getList: (params: { page?: number; pageSize?: number; status?: string }) =>
    api.get<unknown, ApiResponse<PaginatedData<Comment>>>('/admin/comments', { params }),
  updateStatus: (id: number, status: Comment['status']) =>
    api.put<unknown, ApiResponse<null>>(`/admin/comments/${id}/status`, { status }),
  delete: (id: number) => api.delete<unknown, ApiResponse<null>>(`/admin/comments/${id}`)
};

// Dashboard API
export const dashboardApi = {
  getStats: () => api.get<unknown, ApiResponse<DashboardStats>>('/admin/dashboard/stats')
};

export default api;
