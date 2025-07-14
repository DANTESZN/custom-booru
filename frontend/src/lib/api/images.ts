import { apiClient } from './client';
import type { Image, CreateImageRequest, JsonApiResource, ApiResponse } from '$lib/types';

export const imageApi = {
  async getByAlias(aliasId: string, page = 1, perPage = 20): Promise<ApiResponse<JsonApiResource<Image>[]>> {
    return apiClient.get<ApiResponse<JsonApiResource<Image>[]>>(
      `/api/v1/aliases/${aliasId}/images?page=${page}&per_page=${perPage}`
    );
  },

  async getById(aliasId: string, imageId: string): Promise<JsonApiResource<Image>> {
    const response = await apiClient.get<{ data: JsonApiResource<Image> }>(`/api/v1/aliases/${aliasId}/images/${imageId}`);
    return response.data;
  },

  async upload(aliasId: string, imageData: CreateImageRequest): Promise<JsonApiResource<Image>> {
    const formData = new FormData();
    formData.append('image[title]', imageData.image.title);
    formData.append('image[description]', imageData.image.description);
    formData.append('image[file]', imageData.image.file);
    
    if (imageData.image.metadata) {
      Object.entries(imageData.image.metadata).forEach(([key, value]) => {
        formData.append(`image[metadata][${key}]`, String(value));
      });
    }

    // Add tags if provided
    if (imageData.tags && imageData.tags.length > 0) {
      imageData.tags.forEach(tag => {
        formData.append('tags[]', tag);
      });
    }

    const response = await apiClient.post<{ data: JsonApiResource<Image> }>(`/api/v1/aliases/${aliasId}/images`, formData);
    return response.data;
  },

  async update(aliasId: string, imageId: string, imageData: Partial<CreateImageRequest>): Promise<JsonApiResource<Image>> {
    const response = await apiClient.patch<{ data: JsonApiResource<Image> }>(`/api/v1/aliases/${aliasId}/images/${imageId}`, imageData);
    return response.data;
  },

  async delete(aliasId: string, imageId: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/api/v1/aliases/${aliasId}/images/${imageId}`);
  },

  async addTags(aliasId: string, imageId: string, tags: string[]): Promise<JsonApiResource<Image>> {
    const response = await apiClient.post<{ data: JsonApiResource<Image> }>(`/api/v1/aliases/${aliasId}/images/${imageId}/add_tags`, { tags });
    return response.data;
  },

  async removeTags(aliasId: string, imageId: string, tags: string[]): Promise<JsonApiResource<Image>> {
    const response = await apiClient.delete<{ data: JsonApiResource<Image> }>(`/api/v1/aliases/${aliasId}/images/${imageId}/remove_tags`, { tags });
    return response.data;
  }
};