import { PUBLIC_VITE_API_BASE_URL } from '$env/static/public';
import type { AuthState } from '$lib/types';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = PUBLIC_VITE_API_BASE_URL || 'http://localhost:3000';
  }

  setToken(token: string | null) {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  private getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 401) {
        // Token expired or invalid - clear token but don't redirect
        this.token = null;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          // Dispatch a custom event to notify auth store of logout
          window.dispatchEvent(new CustomEvent('auth-logout'));
        }
      }

      throw new ApiError(
        errorData.error || `HTTP ${response.status}`,
        response.status,
        errorData.details
      );
    }

    // Check if response has Authorization header (for login)
    const authHeader = response.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const newToken = authHeader.substring(7);
      this.setToken(newToken);
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', newToken);
      }
    }

    return response.json();
  }

  async get<T>(endpoint: string, includeAuth = true): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(includeAuth),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: any, includeAuth = true): Promise<T> {
    const headers = this.getHeaders(includeAuth);
    
    const config: RequestInit = {
      method: 'POST',
      headers,
    };

    if (data instanceof FormData) {
      // For file uploads, don't set Content-Type, let browser set it
      delete (headers as any)['Content-Type'];
      config.body = data;
    } else if (data) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    return this.handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, data: any, includeAuth = true): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(includeAuth),
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string, data?: any, includeAuth = true): Promise<T> {
    const config: RequestInit = {
      method: 'DELETE',
      headers: this.getHeaders(includeAuth),
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    return this.handleResponse<T>(response);
  }
}

export const apiClient = new ApiClient();