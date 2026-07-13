/* ========== 数据库实体类型 ========== */
export interface User {
  id: number;
  username: string;
  password: string;
  nickname: string;
  avatar: string | null;
  email: string | null;
  role: string;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  summary: string;
  cover_image: string | null;
  author_id: number;
  category_id: number | null;
  status: 'draft' | 'published';
  view_count: number;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface Comment {
  id: number;
  post_id: number;
  parent_id: number | null;
  author_name: string;
  author_email: string | null;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: Date | string;
}

/* ========== 请求类型 ========== */
export interface LoginRequest {
  username: string;
  password: string;
}

export interface CreatePostRequest {
  title: string;
  slug?: string;
  content: string;
  summary?: string;
  cover_image?: string;
  category_id?: number;
  status: 'draft' | 'published';
}

export interface UpdatePostRequest {
  title?: string;
  slug?: string;
  content?: string;
  summary?: string;
  cover_image?: string;
  category_id?: number;
  status?: 'draft' | 'published';
}

export interface JwtPayload {
  userId: number;
  username: string;
  role: string;
}

/* ========== 响应类型 ========== */
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

export interface PaginatedData<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
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
