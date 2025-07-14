import { writable } from 'svelte/store';
import type { Alias, JsonApiResource } from '$lib/types';
import { aliasApi } from '$lib/api/aliases';

function createAliasStore() {
  const { subscribe, set, update } = writable<JsonApiResource<Alias>[]>([]);

  return {
    subscribe,
    
    async loadAliases() {
      try {
        const aliases = await aliasApi.getAll();
        set(aliases);
        return { success: true };
      } catch (error: any) {
        console.error('Failed to load aliases:', error);
        return { success: false, error: error.message };
      }
    },

    async createAlias(aliasData: any) {
      try {
        const newAlias = await aliasApi.create(aliasData);
        update(aliases => [...aliases, newAlias]);
        return { success: true, data: newAlias };
      } catch (error: any) {
        console.error('Failed to create alias:', error);
        return { success: false, error: error.message };
      }
    },

    async updateAlias(id: string, aliasData: any) {
      try {
        const updatedAlias = await aliasApi.update(id, aliasData);
        update(aliases => 
          aliases.map(alias => 
            alias.id === id ? updatedAlias : alias
          )
        );
        return { success: true, data: updatedAlias };
      } catch (error: any) {
        console.error('Failed to update alias:', error);
        return { success: false, error: error.message };
      }
    },

    async deleteAlias(id: string) {
      try {
        await aliasApi.delete(id);
        update(aliases => aliases.filter(alias => alias.id !== id));
        return { success: true };
      } catch (error: any) {
        console.error('Failed to delete alias:', error);
        return { success: false, error: error.message };
      }
    }
  };
}

export const aliasStore = createAliasStore();