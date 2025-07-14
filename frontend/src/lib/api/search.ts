import { apiClient } from './client';
import type { SearchResponse, SearchParams } from '$lib/types';

export const searchApi = {
  async search(params: SearchParams): Promise<SearchResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.tags && params.tags.length > 0) {
      searchParams.append('tags', params.tags.join(','));
    }
    
    if (params.alias) {
      searchParams.append('alias_name', params.alias);
    }
    
    // Backend uses 'query' for title/description search
    if (params.title || params.description) {
      const query = [params.title, params.description].filter(Boolean).join(' ');
      searchParams.append('query', query);
    }
    
    if (params.sort) {
      searchParams.append('sort', params.sort);
    }
    
    if (params.page) {
      searchParams.append('page', params.page.toString());
    }
    
    if (params.per_page) {
      searchParams.append('per_page', params.per_page.toString());
    }

    return apiClient.get<SearchResponse>(`/api/v1/search/images?${searchParams.toString()}`);
  }
};