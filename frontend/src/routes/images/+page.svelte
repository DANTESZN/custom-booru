<script lang="ts">
  import { onMount } from 'svelte';
  import { aliasStore } from '$lib/stores/aliases';
  import type { JsonApiResource, Alias } from '$lib/types';
  
  let aliases = $state<JsonApiResource<Alias>[]>([]);
  let isLoading = $state(true);
  let error = $state('');

  onMount(async () => {
    const unsubscribe = aliasStore.subscribe((value) => {
      aliases = value;
    });

    const result = await aliasStore.loadAliases();
    if (!result.success) {
      error = result.error || 'Failed to load artists';
    }
    isLoading = false;

    return unsubscribe;
  });
</script>

<svelte:head>
  <title>Gallery - CustomBooru</title>
</svelte:head>

<div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
  <div class="px-4 py-6 sm:px-0">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Gallery</h1>
      <p class="mt-2 text-sm text-gray-600">
        Browse images by artist or explore all artwork in your collection.
      </p>
    </div>

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
    {:else if aliases.length === 0}
      <div class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No artists found</h3>
        <p class="mt-1 text-sm text-gray-500">Create an artist profile first to start uploading images.</p>
        <div class="mt-6">
          <a
            href="/aliases/create"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Add Artist
          </a>
        </div>
      </div>
    {:else}
      <!-- Artists with Images -->
      <div class="space-y-8">
        {#each aliases as alias (alias.id)}
          <div class="bg-white shadow rounded-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <h2 class="text-xl font-semibold text-gray-900">
                  {alias.attributes.name}
                </h2>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {alias.attributes.images_count || 0} images
                </span>
              </div>
              <div class="flex space-x-2">
                <a
                  href="/aliases/{alias.id}/images"
                  class="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                >
                  View All
                </a>
                <a
                  href="/aliases/{alias.id}/images/upload"
                  class="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-1 px-3 rounded-md"
                >
                  Upload
                </a>
              </div>
            </div>

            {#if alias.attributes.description}
              <p class="text-sm text-gray-600 mb-4">
                {alias.attributes.description}
              </p>
            {/if}

            {#if alias.attributes.images_count && alias.attributes.images_count > 0}
              <div class="text-sm text-gray-500">
                This artist has {alias.attributes.images_count} image{alias.attributes.images_count !== 1 ? 's' : ''} in the gallery.
              </div>
            {:else}
              <div class="text-center py-8 bg-gray-50 rounded-lg">
                <svg class="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="mt-2 text-sm text-gray-500">No images uploaded yet</p>
                <a
                  href="/aliases/{alias.id}/images/upload"
                  class="mt-2 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Upload first image
                  <svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            {/if}
          </div>
        {/each}
      </div>

      <!-- Quick Actions -->
      <div class="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/aliases/create"
            class="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <svg class="h-6 w-6 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span class="text-sm font-medium text-gray-900">Add New Artist</span>
          </a>
          
          <a
            href="/search"
            class="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <svg class="h-6 w-6 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span class="text-sm font-medium text-gray-900">Search Images</span>
          </a>
          
          <a
            href="/tags"
            class="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <svg class="h-6 w-6 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span class="text-sm font-medium text-gray-900">Manage Tags</span>
          </a>
        </div>
      </div>
    {/if}
  </div>
</div>