<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { writable } from 'svelte/store';
  import { aliasApi } from '$lib/api/aliases';
  import { apiClient } from '$lib/api/client';
  import type { JsonApiResource, Image, Alias } from '$lib/types';
  
  let aliasId = '';
  let imageId = '';
  let alias = null;
  let image = null;
  const loadingStore = writable(true);
  const errorStore = writable('');

  onMount(async () => {
    aliasId = $page.params.id;
    imageId = $page.params.image_id;
    
    try {
      // Load alias info
      alias = await aliasApi.getById(aliasId);
      
      // Load specific image
      const imageResponse = await apiClient.get(`/api/v1/aliases/${aliasId}/images/${imageId}`);
      image = imageResponse.data;
      
      loadingStore.set(false);
    } catch (err) {
      console.error('Error loading image:', err);
      if (err.status === 404) {
        errorStore.set('Image not found');
      } else {
        errorStore.set(err.message || 'Failed to load image');
      }
      loadingStore.set(false);
    }
  });
</script>

<svelte:head>
  <title>{image?.attributes.title || 'Image'} - CustomBooru</title>
</svelte:head>

<div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
  <div class="px-4 py-6 sm:px-0">
    {#if $loadingStore}
      <div class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    {:else if $errorStore}
      <div class="rounded-md bg-red-50 p-4">
        <div class="text-sm text-red-700">
          {$errorStore}
        </div>
      </div>
    {:else if image}
      <!-- Breadcrumb -->
      <nav class="flex mb-8" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-3">
          <li class="inline-flex items-center">
            <a href="/aliases" class="text-gray-500 hover:text-gray-700">
              Artists
            </a>
          </li>
          <li>
            <div class="flex items-center">
              <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
              <a href="/aliases/{aliasId}" class="text-gray-500 hover:text-gray-700 ml-1 md:ml-2">
                {alias?.attributes.name}
              </a>
            </div>
          </li>
          <li>
            <div class="flex items-center">
              <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
              <a href="/aliases/{aliasId}/images" class="text-gray-500 hover:text-gray-700 ml-1 md:ml-2">
                Images
              </a>
            </div>
          </li>
          <li>
            <div class="flex items-center">
              <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-900 ml-1 md:ml-2 font-medium">
                {image.attributes.title || 'Untitled'}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      <!-- Image View -->
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="lg:flex">
          <!-- Image Display -->
          <div class="lg:flex-1 bg-gray-50 flex items-center justify-center p-8">
            {#if image.attributes.file_url}
              <img
                src={image.attributes.file_url}
                alt={image.attributes.title}
                class="max-w-full max-h-96 lg:max-h-screen object-contain rounded-lg shadow-md"
              />
            {:else}
              <div class="text-center py-16">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="mt-2 text-sm text-gray-500">Image not available</p>
              </div>
            {/if}
          </div>

          <!-- Image Details -->
          <div class="lg:w-96 p-8">
            <div class="space-y-6">
              <!-- Title -->
              <div>
                <h1 class="text-2xl font-bold text-gray-900">
                  {image.attributes.title || 'Untitled'}
                </h1>
                <p class="text-sm text-gray-500 mt-1">
                  by {alias?.attributes.name}
                </p>
              </div>

              <!-- Description -->
              {#if image.attributes.description}
                <div>
                  <h3 class="text-sm font-medium text-gray-900 mb-2">Description</h3>
                  <p class="text-sm text-gray-700 whitespace-pre-wrap">{image.attributes.description}</p>
                </div>
              {/if}

              <!-- Tags -->
              {#if image.attributes.tags_list && image.attributes.tags_list.length > 0}
                <div>
                  <h3 class="text-sm font-medium text-gray-900 mb-2">Tags</h3>
                  <div class="flex flex-wrap gap-2">
                    {#each image.attributes.tags_list as tag}
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {tag}
                      </span>
                    {/each}
                  </div>
                </div>
              {/if}

              <!-- File Info -->
              <div>
                <h3 class="text-sm font-medium text-gray-900 mb-2">File Information</h3>
                <dl class="text-sm text-gray-700">
                  {#if image.attributes.file_filename}
                    <div class="flex justify-between py-1">
                      <dt class="text-gray-500">Filename:</dt>
                      <dd class="font-medium">{image.attributes.file_filename}</dd>
                    </div>
                  {/if}
                  {#if image.attributes.file_size}
                    <div class="flex justify-between py-1">
                      <dt class="text-gray-500">Size:</dt>
                      <dd class="font-medium">{Math.round(image.attributes.file_size / 1024)} KB</dd>
                    </div>
                  {/if}
                  {#if image.attributes.file_content_type}
                    <div class="flex justify-between py-1">
                      <dt class="text-gray-500">Type:</dt>
                      <dd class="font-medium">{image.attributes.file_content_type}</dd>
                    </div>
                  {/if}
                  <div class="flex justify-between py-1">
                    <dt class="text-gray-500">Uploaded:</dt>
                    <dd class="font-medium">{new Date(image.attributes.created_at).toLocaleDateString()}</dd>
                  </div>
                </dl>
              </div>

              <!-- Actions -->
              <div class="flex space-x-3">
                <a
                  href="/aliases/{aliasId}/images"
                  class="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg text-center transition-colors"
                >
                  Back to Gallery
                </a>
                {#if image.attributes.file_url}
                  <a
                    href={image.attributes.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg text-center transition-colors"
                  >
                    Open Full Size
                  </a>
                {/if}
              </div>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>