import { writable } from 'svelte/store';
import type { Image, JsonApiResource } from '$lib/types';
import { imageApi } from '$lib/api/images';

function createImageStore() {
  const { subscribe, set, update } = writable<JsonApiResource<Image>[]>([]);

  return {
    subscribe,
    
    async loadImagesByAlias(aliasId: string, page = 1, perPage = 20) {
      try {
        const response = await imageApi.getByAlias(aliasId, page, perPage);
        set(response.data);
        return { success: true, data: response };
      } catch (error: any) {
        console.error('Failed to load images:', error);
        return { success: false, error: error.message };
      }
    },

    async uploadImage(aliasId: string, imageData: any) {
      try {
        const newImage = await imageApi.upload(aliasId, imageData);
        update(images => [newImage, ...images]);
        return { success: true, data: newImage };
      } catch (error: any) {
        console.error('Failed to upload image:', error);
        return { success: false, error: error.message };
      }
    },

    async updateImage(aliasId: string, imageId: string, imageData: any) {
      try {
        const updatedImage = await imageApi.update(aliasId, imageId, imageData);
        update(images => 
          images.map(image => 
            image.id === imageId ? updatedImage : image
          )
        );
        return { success: true, data: updatedImage };
      } catch (error: any) {
        console.error('Failed to update image:', error);
        return { success: false, error: error.message };
      }
    },

    async deleteImage(aliasId: string, imageId: string) {
      try {
        await imageApi.delete(aliasId, imageId);
        update(images => images.filter(image => image.id !== imageId));
        return { success: true };
      } catch (error: any) {
        console.error('Failed to delete image:', error);
        return { success: false, error: error.message };
      }
    },

    async addTags(aliasId: string, imageId: string, tags: string[]) {
      try {
        const updatedImage = await imageApi.addTags(aliasId, imageId, tags);
        update(images => 
          images.map(image => 
            image.id === imageId ? updatedImage : image
          )
        );
        return { success: true, data: updatedImage };
      } catch (error: any) {
        console.error('Failed to add tags:', error);
        return { success: false, error: error.message };
      }
    },

    async removeTags(aliasId: string, imageId: string, tags: string[]) {
      try {
        const updatedImage = await imageApi.removeTags(aliasId, imageId, tags);
        update(images => 
          images.map(image => 
            image.id === imageId ? updatedImage : image
          )
        );
        return { success: true, data: updatedImage };
      } catch (error: any) {
        console.error('Failed to remove tags:', error);
        return { success: false, error: error.message };
      }
    }
  };
}

export const imageStore = createImageStore();