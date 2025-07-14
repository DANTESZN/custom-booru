import { apiClient } from './client';
import type { User, LoginRequest, RegisterRequest, JsonApiResource } from '$lib/types';

export interface AuthResponse {
  message: string;
  user: User;
}

export const authApi = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/users/sign_in', credentials, false);
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/users', userData, false);
  },

  async logout(): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>('/users/sign_out');
  },

  async getCurrentUser(): Promise<User> {
    // This would require adding a current user endpoint to the Rails API
    // For now, we'll store user data in the token response
    throw new Error('Current user endpoint not implemented yet');
  }
};