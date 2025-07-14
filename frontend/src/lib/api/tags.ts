import { apiClient } from './client';
import type { Tag, JsonApiResource, ApiResponse } from '$lib/types';

export const tagApi = {
  async getAll(page = 1, perPage = 20, search?: string, popular?: boolean): Promise<ApiResponse<JsonApiResource<Tag>[]>> {
    let url = `/api/v1/tags?page=${page}&per_page=${perPage}`;
    
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    
    if (popular) {
      url += `&popular=true`;
    }

    return apiClient.get<ApiResponse<JsonApiResource<Tag>[]>>(url);
  },

  async getByName(name: string): Promise<JsonApiResource<Tag>> {
    const response = await apiClient.get<{ data: JsonApiResource<Tag> }>(`/api/v1/tags/${encodeURIComponent(name)}`);
    return response.data;
  },

  async create(name: string): Promise<JsonApiResource<Tag>> {
    const response = await apiClient.post<{ data: JsonApiResource<Tag> }>('/api/v1/tags', { tag: { name } });
    return response.data;
  }
};