import { apiClient } from './client';
import type { Alias, CreateAliasRequest, JsonApiResource, ApiResponse } from '$lib/types';

export const aliasApi = {
  async getAll(): Promise<JsonApiResource<Alias>[]> {
    const response = await apiClient.get<{ data: JsonApiResource<Alias>[] }>('/api/v1/aliases');
    return response.data;
  },

  async getById(id: string): Promise<JsonApiResource<Alias>> {
    const response = await apiClient.get<{ data: JsonApiResource<Alias> }>(`/api/v1/aliases/${id}`);
    return response.data;
  },

  async create(aliasData: CreateAliasRequest): Promise<JsonApiResource<Alias>> {
    const response = await apiClient.post<{ data: JsonApiResource<Alias> }>('/api/v1/aliases', aliasData);
    return response.data;
  },

  async update(id: string, aliasData: Partial<CreateAliasRequest>): Promise<JsonApiResource<Alias>> {
    const response = await apiClient.patch<{ data: JsonApiResource<Alias> }>(`/api/v1/aliases/${id}`, aliasData);
    return response.data;
  },

  async delete(id: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/api/v1/aliases/${id}`);
  }
};