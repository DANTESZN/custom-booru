// API Response Types
export interface ApiResponse<T> {
  data: T;
  meta?: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
}

// Domain Models
export interface User {
  id: string;
  email: string;
  created_at?: string;
  aliases?: Array<{ id: string; name: string }>;
}

export interface Alias {
  id: string;
  name: string;
  bio?: string;
  description?: string;
  social_links: Record<string, string>;
  created_at: string;
  updated_at: string;
  avatar_url?: string;
  images_count: number;
}

export interface Image {
  id: string;
  title: string;
  description: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  file_url: string;
  file_filename: string;
  file_size: number;
  file_content_type: string;
  tags_list: string[];
  tags?: Array<{ name: string }>;
}

export interface Tag {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  usage_count: number;
  images_count?: number;
}

// Search Types
export interface SearchParams {
  tags?: string[];
  alias?: string;
  title?: string;
  description?: string;
  sort?: 'created_at' | 'updated_at' | 'title';
  order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface SearchResponse {
  data: JsonApiResource<Image>[];
  meta: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
}

// JSON API Resource Format
export interface JsonApiResource<T> {
  id: string;
  type: string;
  attributes: T;
  relationships?: Record<string, {
    data: JsonApiResource<any>[] | JsonApiResource<any>;
  }>;
}

// API Request Types
export interface LoginRequest {
  user: {
    email: string;
    password: string;
  };
}

export interface RegisterRequest {
  user: {
    email: string;
    password: string;
    password_confirmation: string;
  };
}

export interface CreateAliasRequest {
  alias: {
    name: string;
    bio: string;
    social_links?: Record<string, string>;
  };
}

export interface CreateImageRequest {
  image: {
    title: string;
    description: string;
    file: File;
    metadata?: Record<string, any>;
  };
  tags?: string[];
}

export interface SearchImageParams {
  tags?: string;
  query?: string;
  alias_id?: string;
  sort?: 'newest' | 'oldest' | 'title';
  page?: number;
  per_page?: number;
}

// Auth State
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}