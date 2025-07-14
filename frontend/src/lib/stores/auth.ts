import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { User, AuthState } from '$lib/types';
import { authApi } from '$lib/api/auth';
import { apiClient } from '$lib/api/client';

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  return {
    subscribe,
    
    async init() {
      if (!browser) return;
      
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');
      
      if (token && userData) {
        try {
          apiClient.setToken(token);
          const user = JSON.parse(userData);
          update(state => ({
            ...state,
            user,
            isAuthenticated: true,
            isLoading: false
          }));
        } catch (error) {
          // Clear invalid stored data
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          update(state => ({
            ...state,
            isLoading: false
          }));
        }
      } else {
        update(state => ({
          ...state,
          isLoading: false
        }));
      }
      
      // Listen for auth logout events from API client
      if (browser) {
        window.addEventListener('auth-logout', () => {
          update(state => ({
            ...state,
            user: null,
            isAuthenticated: false,
            isLoading: false
          }));
        });
      }
    },

    async checkToken() {
      if (!browser) return false;
      
      const token = localStorage.getItem('auth_token');
      if (!token) return false;
      
      try {
        // Make a lightweight API call to check if token is still valid
        await apiClient.get('/api/v1/aliases');
        return true;
      } catch (error) {
        // Token is invalid or expired
        return false;
      }
    },

    async login(email: string, password: string) {
      try {
        const response = await authApi.login({ user: { email, password } });
        
        // Store user data in localStorage
        if (browser) {
          localStorage.setItem('user_data', JSON.stringify(response.user));
        }
        
        update(state => ({
          ...state,
          user: response.user,
          isAuthenticated: true,
          isLoading: false
        }));
        
        return { success: true };
      } catch (error: any) {
        update(state => ({
          ...state,
          isLoading: false
        }));
        return { 
          success: false, 
          error: error.message || 'Login failed' 
        };
      }
    },

    async register(email: string, password: string, passwordConfirmation: string) {
      try {
        const response = await authApi.register({ 
          user: { 
            email, 
            password, 
            password_confirmation: passwordConfirmation 
          } 
        });
        
        // Store user data in localStorage
        if (browser) {
          localStorage.setItem('user_data', JSON.stringify(response.user));
        }
        
        update(state => ({
          ...state,
          user: response.user,
          isAuthenticated: true,
          isLoading: false
        }));
        
        return { success: true };
      } catch (error: any) {
        update(state => ({
          ...state,
          isLoading: false
        }));
        return { 
          success: false, 
          error: error.message || 'Registration failed' 
        };
      }
    },

    async logout() {
      try {
        await authApi.logout();
      } catch (error) {
        // Continue with logout even if API call fails
        console.error('Logout API call failed:', error);
      }
      
      if (browser) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
      apiClient.setToken(null);
      
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    },

    setUser(user: User) {
      update(state => ({
        ...state,
        user,
        isAuthenticated: true,
        isLoading: false
      }));
    }
  };
}

export const authStore = createAuthStore();