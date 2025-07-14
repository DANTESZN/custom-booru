<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { imageStore } from '$lib/stores/images';
  import { aliasApi } from '$lib/api/aliases';
  import type { JsonApiResource, Image, Alias } from '$lib/types';
  
  let aliasId = $derived($page.params.id);
  let alias = $state<JsonApiResource<Alias> | null>(null);
  let images = $state<JsonApiResource<Image>[]>([]);
  let isLoading = $state(true);
  let error = $state('');

  onMount(async () => {
    const unsubscribe = imageStore.subscribe((value) => {
      images = value;
    });

    try {
      // Load alias info
      alias = await aliasApi.getById(aliasId);
      
      // Load images
      const result = await imageStore.loadImagesByAlias(aliasId);
      if (!result.success) {
        error = result.error || 'Failed to load images';
      }
    } catch (err: any) {
      error = err.message || 'Failed to load alias';
    }
    
    isLoading = false;

    return unsubscribe;
  });
</script>

<svelte:head>
  <title>{alias?.attributes.name || 'Artist'} Images - CustomBooru</title>
</svelte:head>

<div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
  <div class="px-4 py-6 sm:px-0">
    {#if isLoading}
      <div class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    {:else if error}
      <div class="rounded-md bg-red-50 p-4">
        <div class="text-sm text-red-700">
          {error}
        </div>
      </div>
    {:else}
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">
            {alias?.attributes.name} Images
          </h1>
          <p class="mt-2 text-sm text-gray-600">
            {images.length} image{images.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div class="flex space-x-3">
          <a
            href="/aliases/{aliasId}"
            class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            View Artist
          </a>
          <a
            href="/aliases/{aliasId}/images/upload"
            class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Upload Image
          </a>
        </div>
      </div>

      {#if images.length === 0}
        <div class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No images</h3>
          <p class="mt-1 text-sm text-gray-500">Get started by uploading an image for this artist.</p>
          <div class="mt-6">
            <a
              href="/aliases/{aliasId}/images/upload"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              Upload Image
            </a>
          </div>
        </div>
      {:else}
        <!-- Images Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {#each images as image (image.id)}
            <div class="bg-white overflow-hidden shadow rounded-lg group">
              <div class="aspect-square bg-gray-200 overflow-hidden">
                {#if image.attributes.file_url}
                  <img
                    src={image.attributes.file_url}
                    alt={image.attributes.title}
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                {:else}
                  <div class="w-full h-full flex items-center justify-center">
                    <svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                {/if}
              </div>
              
              <div class="p-4">
                <h3 class="text-sm font-medium text-gray-900 truncate">
                  {image.attributes.title}
                </h3>
                
                {#if image.attributes.tags && image.attributes.tags.length > 0}
                  <div class="mt-2 flex flex-wrap gap-1">
                    {#each image.attributes.tags.slice(0, 3) as tag}
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {tag.name}
                      </span>
                    {/each}
                    {#if image.attributes.tags.length > 3}
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        +{image.attributes.tags.length - 3} more
                      </span>
                    {/if}
                  </div>
                {/if}

                <div class="mt-4 flex justify-between text-xs text-gray-500">
                  <span>
                    {new Date(image.attributes.created_at).toLocaleDateString()}
                  </span>
                  <a
                    href="/aliases/{aliasId}/images/{image.id}"
                    class="text-indigo-600 hover:text-indigo-500 font-medium"
                  >
                    View
                  </a>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    {/if}
  </div>
</div>