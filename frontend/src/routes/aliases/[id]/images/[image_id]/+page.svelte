<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { writable } from 'svelte/store';
  import { aliasApi } from '$lib/api/aliases';
  import { apiClient } from '$lib/api/client';
  import { imageApi } from '$lib/api/images';
  import { authStore } from '$lib/stores/auth';
  import type { JsonApiResource, Image, Alias } from '$lib/types';
  
  let aliasId = $state('');
  let imageId = $state('');
  let alias = $state(null);
  let image = $state(null);
  let relationships = $state([]);
  let relationshipTypes = $state({});
  const loadingStore = writable(true);
  const errorStore = writable('');
  
  let authState = $derived($authStore);
  let canEdit = $derived(authState.isAuthenticated && authState.user && alias && 
              authState.user.aliases?.some(userAlias => userAlias.id.toString() === alias.id.toString()));

  async function loadImageData(currentAliasId, currentImageId) {
    loadingStore.set(true);
    errorStore.set('');
    try {
      aliasId = currentAliasId;
      imageId = currentImageId;

      // Reset data
      image = null;
      relationships = [];

      // Load alias info
      alias = await aliasApi.getById(aliasId);
      
      // Load specific image
      const imageResponse = await apiClient.get(`/api/v1/aliases/${aliasId}/images/${imageId}`);
      image = imageResponse.data;

      // Load relationships if image exists
      if (image) {
        try {
          relationships = await imageApi.getRelationships(aliasId, imageId);
          relationshipTypes = await imageApi.getRelationshipTypes();
        } catch (relError) {
          console.warn('Failed to load relationships:', relError);
        }
      }
    } catch (err) {
      console.error('Error loading image:', err);
      if (err.status === 404) {
        errorStore.set('Image not found');
      } else {
        errorStore.set(err.message || 'Failed to load image');
      }
    } finally {
      loadingStore.set(false);
    }
  }

  $effect(() => {
    if ($page.params.image_id && $page.params.id) {
      loadImageData($page.params.id, $page.params.image_id);
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
                      <a
                        href="/search?tags={encodeURIComponent(tag)}"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200 hover:text-indigo-900 transition-colors cursor-pointer"
                      >
                        {tag}
                      </a>
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
              <div class="space-y-3">
                {#if canEdit}
                  <div class="flex space-x-3">
                    <a
                      href="/aliases/{aliasId}/images/{imageId}/edit"
                      class="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-lg text-center transition-colors"
                    >
                      Edit Image
                    </a>
                  </div>
                {/if}
                
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
      </div>

      <!-- Related Images Section -->
      {#if relationships && relationships.length > 0}
        <div class="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">Related Images</h2>
          </div>
          
          <div class="p-6 space-y-8">
            {#each relationships as relationshipGroup}
              <div>
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-medium text-gray-900 capitalize">
                    {relationshipGroup.type}
                  </h3>
                  <span class="text-sm text-gray-500">
                    {relationshipTypes[relationshipGroup.type] || ''}
                  </span>
                </div>
                
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {#each relationshipGroup.relationships as relationship}
                    <div class="group relative">
                      <button 
                        on:click={() => goto(`/aliases/${relationship.related_image_alias_id}/images/${relationship.related_image_id}`)}
                        class="block aspect-square rounded-lg overflow-hidden bg-gray-100 hover:shadow-lg transition-shadow cursor-pointer w-full"
                      >
                        {#if relationship.related_image_file_url}
                          <img
                            src={relationship.related_image_file_url}
                            alt={relationship.related_image_title}
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        {:else}
                          <div class="w-full h-full flex items-center justify-center">
                            <svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                            </svg>
                          </div>
                        {/if}
                      </button>
                    </div>
                  {/each}
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Manage Relationships (for authorized users) -->
      {#if canEdit}
        <div class="mt-6 bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Manage Relationships</h2>
          </div>
          <div class="p-6">
            <a
              href="/aliases/{aliasId}/images/{imageId}/relationships"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Manage Relationships
            </a>
          </div>
        </div>
      {/if}
    {/if}
  </div>
</div>