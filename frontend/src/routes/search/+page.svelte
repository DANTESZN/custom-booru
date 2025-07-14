<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { searchApi } from '$lib/api/search';
  import { tagStore } from '$lib/stores/tags';
  import { aliasStore } from '$lib/stores/aliases';
  import type { JsonApiResource, Image, SearchParams, Tag, Alias } from '$lib/types';
  
  let images = [];
  let isLoading = false;
  let error = '';
  let searchPerformed = false;
  
  // Search form state
  let searchForm = {
    tags: [],
    alias: '',
    title: '',
    description: '',
    sort: 'created_at',
    order: 'desc',
    page: 1,
    per_page: 20
  };
  
  // Suggestions and data
  let availableTags = [];
  let availableAliases = [];
  let tagSuggestions = [];
  let showTagSuggestions = false;
  let currentTagInput = '';
  
  // Pagination
  let currentPage = 1;
  let totalPages = 1;
  let totalCount = 0;

  async function loadSuggestions() {
    // Load tags and aliases for suggestions
    const [tagResult, aliasResult] = await Promise.all([
      tagStore.loadTags(1, 100),
      aliasStore.loadAliases()
    ]);
    
    if (tagResult.success && tagResult.data) {
      availableTags = tagResult.data.data;
    }
    
    // Subscribe to alias store
    aliasStore.subscribe((aliases) => {
      availableAliases = aliases;
    });
  }

  async function performSearch(page = 1) {
    isLoading = true;
    error = '';
    
    const searchParams = {
      ...searchForm,
      page,
      tags: searchForm.tags?.length ? searchForm.tags : undefined,
      alias: searchForm.alias || undefined,
      title: searchForm.title || undefined,
      description: searchForm.description || undefined
    };

    try {
      const response = await searchApi.search(searchParams);
      images = response.data;
      currentPage = response.meta.current_page;
      totalPages = response.meta.total_pages;
      totalCount = response.meta.total_count;
      searchPerformed = true;
    } catch (err: any) {
      error = err.message || 'Search failed';
      images = [];
    }
    
    isLoading = false;
  }

  function addTag(tagName: string) {
    if (!searchForm.tags) searchForm.tags = [];
    if (!searchForm.tags.includes(tagName)) {
      searchForm.tags = [...searchForm.tags, tagName];
    }
    currentTagInput = '';
    showTagSuggestions = false;
  }

  function removeTag(tagName: string) {
    if (searchForm.tags) {
      searchForm.tags = searchForm.tags.filter(tag => tag !== tagName);
    }
  }

  function handleTagInput(event: Event) {
    const target = event.target as HTMLInputElement;
    currentTagInput = target.value;
    
    if (currentTagInput.length > 0) {
      tagSuggestions = availableTags.filter(tag => 
        tag.attributes.name.toLowerCase().includes(currentTagInput.toLowerCase()) &&
        !searchForm.tags?.includes(tag.attributes.name)
      );
      showTagSuggestions = tagSuggestions.length > 0;
    } else {
      showTagSuggestions = false;
    }
  }

  function handleTagKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && currentTagInput.trim()) {
      event.preventDefault();
      addTag(currentTagInput.trim());
    } else if (event.key === 'Escape') {
      showTagSuggestions = false;
    }
  }

  function clearSearch() {
    searchForm = {
      tags: [],
      alias: '',
      title: '',
      description: '',
      sort: 'created_at',
      order: 'desc',
      page: 1,
      per_page: 20
    };
    images = [];
    searchPerformed = false;
    currentPage = 1;
    totalPages = 1;
    totalCount = 0;
  }

  onMount(() => {
    loadSuggestions();
  });
</script>

<svelte:head>
  <title>Search - CustomBooru</title>
</svelte:head>

<div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
  <div class="px-4 py-6 sm:px-0">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Search Images</h1>
      <p class="mt-2 text-sm text-gray-600">
        Find images using tags, artists, titles, and descriptions.
      </p>
    </div>

    <!-- Search Form -->
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <form on:submit|preventDefault={() => performSearch(1)} class="space-y-6">
        <!-- Tags -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div class="space-y-2">
            <!-- Selected Tags -->
            {#if searchForm.tags && searchForm.tags.length > 0}
              <div class="flex flex-wrap gap-2">
                {#each searchForm.tags as tag}
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {tag}
                    <button
                      type="button"
                      on:click={() => removeTag(tag)}
                      class="ml-1 text-indigo-600 hover:text-indigo-500"
                    >
                      ×
                    </button>
                  </span>
                {/each}
              </div>
            {/if}
            
            <!-- Tag Input -->
            <div class="relative">
              <input
                type="text"
                bind:value={currentTagInput}
                on:input={handleTagInput}
                on:keydown={handleTagKeydown}
                placeholder="Type to search tags..."
                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              
              <!-- Tag Suggestions -->
              {#if showTagSuggestions}
                <div class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                  {#each tagSuggestions as tag}
                    <button
                      type="button"
                      on:click={() => addTag(tag.attributes.name)}
                      class="w-full text-left px-4 py-2 hover:bg-gray-100 flex justify-between items-center"
                    >
                      <span>{tag.attributes.name}</span>
                      <span class="text-xs text-gray-500">({tag.attributes.images_count || 0})</span>
                    </button>
                  {/each}
                </div>
              {/if}
            </div>
          </div>
        </div>

        <!-- Other Search Fields -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="alias" class="block text-sm font-medium text-gray-700">
              Artist
            </label>
            <select
              id="alias"
              bind:value={searchForm.alias}
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">All artists</option>
              {#each availableAliases as alias}
                <option value={alias.attributes.name}>{alias.attributes.name}</option>
              {/each}
            </select>
          </div>

          <div>
            <label for="title" class="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              bind:value={searchForm.title}
              placeholder="Image title..."
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div class="md:col-span-2">
            <label for="description" class="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              id="description"
              bind:value={searchForm.description}
              placeholder="Image description..."
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <!-- Sort Options -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="sort" class="block text-sm font-medium text-gray-700">
              Sort by
            </label>
            <select
              id="sort"
              bind:value={searchForm.sort}
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="created_at">Date created</option>
              <option value="updated_at">Date updated</option>
              <option value="title">Title</option>
            </select>
          </div>

          <div>
            <label for="order" class="block text-sm font-medium text-gray-700">
              Order
            </label>
            <select
              id="order"
              bind:value={searchForm.order}
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-between">
          <button
            type="button"
            on:click={clearSearch}
            class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-md"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={isLoading}
            class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
          >
            {#if isLoading}
              Searching...
            {:else}
              Search
            {/if}
          </button>
        </div>
      </form>
    </div>

    <!-- Results -->
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
    {:else if searchPerformed}
      {#if images.length === 0}
        <div class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No results found</h3>
          <p class="mt-1 text-sm text-gray-500">
            Try adjusting your search criteria or browse all images.
          </p>
        </div>
      {:else}
        <!-- Results Header -->
        <div class="mb-6">
          <h2 class="text-lg font-medium text-gray-900">
            Search Results ({totalCount} image{totalCount !== 1 ? 's' : ''})
          </h2>
        </div>

        <!-- Images Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
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
                
                {#if image.attributes.tags_list && image.attributes.tags_list.length > 0}
                  <div class="mt-2 flex flex-wrap gap-1">
                    {#each image.attributes.tags_list.slice(0, 3) as tag}
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {tag}
                      </span>
                    {/each}
                    {#if image.attributes.tags_list.length > 3}
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        +{image.attributes.tags_list.length - 3} more
                      </span>
                    {/if}
                  </div>
                {/if}

                <div class="mt-4 flex justify-between items-center text-xs text-gray-500">
                  <span>
                    {new Date(image.attributes.created_at).toLocaleDateString()}
                  </span>
                  <a
                    href="/aliases/{image.relationships.alias.data.id}/images/{image.id}"
                    class="text-indigo-600 hover:text-indigo-500 font-medium"
                  >
                    View
                  </a>
                </div>
              </div>
            </div>
          {/each}
        </div>

        <!-- Pagination -->
        {#if totalPages > 1}
          <div class="flex justify-center">
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                on:click={() => performSearch(currentPage - 1)}
                disabled={currentPage <= 1}
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {#each Array.from({length: Math.min(5, totalPages)}, (_, i) => i + Math.max(1, currentPage - 2)) as page}
                {#if page <= totalPages}
                  <button
                    on:click={() => performSearch(page)}
                    class="relative inline-flex items-center px-4 py-2 border text-sm font-medium {page === currentPage 
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-600' 
                      : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'}"
                  >
                    {page}
                  </button>
                {/if}
              {/each}
              
              <button
                on:click={() => performSearch(currentPage + 1)}
                disabled={currentPage >= totalPages}
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        {/if}
      {/if}
    {:else}
      <div class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Start searching</h3>
        <p class="mt-1 text-sm text-gray-500">
          Use the form above to search for images by tags, artist, title, or description.
        </p>
      </div>
    {/if}
  </div>
</div>