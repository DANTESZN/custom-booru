import { writable } from 'svelte/store';
import type { Tag, JsonApiResource, ApiResponse } from '$lib/types';
import { tagApi } from '$lib/api/tags';

function createTagStore() {
  const { subscribe, set, update } = writable<JsonApiResource<Tag>[]>([]);

  return {
    subscribe,
    
    async loadTags(page = 1, perPage = 20, search?: string, popular?: boolean) {
      try {
        const response = await tagApi.getAll(page, perPage, search, popular);
        set(response.data);
        return { success: true, data: response };
      } catch (error: any) {
        console.error('Failed to load tags:', error);
        return { success: false, error: error.message };
      }
    },

    async createTag(name: string) {
      try {
        const newTag = await tagApi.create(name);
        update(tags => [newTag, ...tags]);
        return { success: true, data: newTag };
      } catch (error: any) {
        console.error('Failed to create tag:', error);
        return { success: false, error: error.message };
      }
    },

    async searchTags(query: string) {
      try {
        const response = await tagApi.getAll(1, 20, query);
        return { success: true, data: response.data };
      } catch (error: any) {
        console.error('Failed to search tags:', error);
        return { success: false, error: error.message };
      }
    }
  };
}

export const tagStore = createTagStore();