// ========== 数据实体类型 ==========

export interface User {
  id: number;
  username: string;
  nickname: string;
  avatar: string | null;
  email: string | null;
  role: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  post_count: number;
  created_at: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  summary: string;
  cover_image: string | null;
  category_id: number | null;
  status: 'draft' | 'published';
  view_count: number;
  author_name?: string;
  category_name?: string;
  category_slug?: string;
  comment_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  post_id: number;
  author_name: string;
  author_email: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  post_title?: string;
  created_at: string;
}

export interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalComments: number;
  pendingComments: number;
  totalCategories: number;
}

// ========== API 响应类型 ==========

export interface ApiResponse<T> {
  code: number;
  message?: string;
  data: T;
}

export interface PaginatedData<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface LoginResponse {
  token: string;
  user: User;
}
