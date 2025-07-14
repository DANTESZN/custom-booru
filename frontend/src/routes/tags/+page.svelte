<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { tagStore } from '$lib/stores/tags';
  import type { JsonApiResource, Tag } from '$lib/types';
  
  let tags = [];
  let isLoading = true;
  let error = '';
  let searchQuery = '';
  let showPopular = false;
  let newTagName = '';
  let isCreating = false;
  let createError = '';
  
  // Use stores for reactivity
  const tagsStore = writable([]);
  const loadingStore = writable(true);
  const errorStore = writable('');
  const createErrorStore = writable('');

  async function loadTags() {
    isLoading = true;
    const result = await tagStore.loadTags(1, 50, searchQuery || undefined, showPopular);
    if (!result.success) {
      error = result.error || 'Failed to load tags';
    }
    isLoading = false;
  }

  async function handleSearch() {
    await loadTags();
  }

  async function createTag() {
    if (!newTagName.trim()) {
      createError = 'Tag name is required';
      return;
    }

    isCreating = true;
    createError = '';

    const result = await tagStore.createTag(newTagName.trim());
    
    if (result.success) {
      newTagName = '';
      await loadTags(); // Refresh the list
    } else {
      createError = result.error || 'Failed to create tag';
    }
    
    isCreating = false;
  }

  onMount(async () => {
    const unsubscribe = tagStore.subscribe((value) => {
      tags = value;
    });

    await loadTags();

    return unsubscribe;
  });

  $effect(() => {
    if (searchQuery !== undefined || showPopular !== undefined) {
      const timeoutId = setTimeout(() => {
        loadTags();
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  });
</script>

<svelte:head>
  <title>Tags - CustomBooru</title>
</svelte:head>

<div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
  <div class="px-4 py-6 sm:px-0">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Tags</h1>
      <p class="mt-2 text-sm text-gray-600">
        Manage and organize your content with tags.
      </p>
    </div>

    <!-- Search and Filters -->
    <div class="mb-6 bg-white shadow rounded-lg p-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <label for="search" class="sr-only">Search tags</label>
          <input
            type="text"
            id="search"
            bind:value={searchQuery}
            placeholder="Search tags..."
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div class="flex items-center">
          <input
            type="checkbox"
            id="popular"
            bind:checked={showPopular}
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label for="popular" class="ml-2 block text-sm text-gray-900">
            Popular only
          </label>
        </div>
      </div>
    </div>

    <!-- Create New Tag -->
    <div class="mb-6 bg-white shadow rounded-lg p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Create New Tag</h3>
      <div class="flex gap-3">
        <div class="flex-1">
          <input
            type="text"
            bind:value={newTagName}
            placeholder="Enter tag name..."
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            on:keydown={(e) => e.key === 'Enter' && createTag()}
          />
        </div>
        <button
          on:click={createTag}
          disabled={isCreating || !newTagName.trim()}
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {#if isCreating}
            Creating...
          {:else}
            Create
          {/if}
        </button>
      </div>
      {#if createError}
        <div class="mt-2 text-sm text-red-600">
          {createError}
        </div>
      {/if}
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
    {:else if tags.length === 0}
      <div class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">
          {searchQuery ? 'No tags found' : 'No tags'}
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          {searchQuery 
            ? `No tags match "${searchQuery}"`
            : 'Get started by creating your first tag or uploading images with tags.'
          }
        </p>
      </div>
    {:else}
      <!-- Tags Grid -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="mb-4 text-sm text-gray-600">
          {tags.length} tag{tags.length !== 1 ? 's' : ''} found
        </div>
        
        <div class="flex flex-wrap gap-2">
          {#each tags as tag (tag.id)}
            <div class="group relative">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors">
                {tag.attributes.name}
                {#if tag.attributes.images_count !== undefined}
                  <span class="ml-1 text-xs text-gray-600">
                    ({tag.attributes.images_count})
                  </span>
                {/if}
              </span>
              
              <!-- Tooltip on hover -->
              <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                {tag.attributes.images_count || 0} image{tag.attributes.images_count !== 1 ? 's' : ''}
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Usage Stats -->
      {#if tags.length > 0}
        <div class="mt-6 bg-gray-50 rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Tag Statistics</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-white rounded-lg p-4">
              <div class="text-2xl font-bold text-gray-900">
                {tags.length}
              </div>
              <div class="text-sm text-gray-600">Total Tags</div>
            </div>
            
            <div class="bg-white rounded-lg p-4">
              <div class="text-2xl font-bold text-gray-900">
                {Math.max(...tags.map(t => t.attributes.images_count || 0))}
              </div>
              <div class="text-sm text-gray-600">Most Used Tag</div>
            </div>
            
            <div class="bg-white rounded-lg p-4">
              <div class="text-2xl font-bold text-gray-900">
                {Math.round(tags.reduce((sum, t) => sum + (t.attributes.images_count || 0), 0) / tags.length)}
              </div>
              <div class="text-sm text-gray-600">Average Usage</div>
            </div>
          </div>
        </div>
      {/if}
    {/if}
  </div>
</div>