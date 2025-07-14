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
      error = result.error || 'Failed to load aliases';
    }
    isLoading = false;

    return unsubscribe;
  });
</script>

<svelte:head>
  <title>Artists - CustomBooru</title>
</svelte:head>

<div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
  <div class="px-4 py-6 sm:px-0">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Artists</h1>
      <a
        href="/aliases/create"
        class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"
      >
        Add Artist
      </a>
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
        <h3 class="mt-2 text-sm font-medium text-gray-900">No artists</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating your first artist profile.</p>
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
      <!-- Artists Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each aliases as alias (alias.id)}
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium text-gray-900 truncate">
                  {alias.attributes.name}
                </h3>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {alias.attributes.images_count || 0} images
                </span>
              </div>
              
              {#if alias.attributes.description}
                <p class="mt-2 text-sm text-gray-600 line-clamp-3">
                  {alias.attributes.description}
                </p>
              {/if}

              {#if alias.attributes.social_links && Object.keys(alias.attributes.social_links).length > 0}
                <div class="mt-4 flex space-x-2">
                  {#each Object.entries(alias.attributes.social_links) as [platform, url]}
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-indigo-600 hover:text-indigo-500 text-sm"
                    >
                      {platform}
                    </a>
                  {/each}
                </div>
              {/if}

              <div class="mt-6 flex justify-between">
                <a
                  href="/aliases/{alias.id}"
                  class="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                >
                  View Details
                </a>
                <a
                  href="/aliases/{alias.id}/images"
                  class="text-gray-600 hover:text-gray-500 text-sm font-medium"
                >
                  View Images
                </a>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>