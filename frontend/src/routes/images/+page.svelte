<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { searchApi } from '$lib/api/search';
  import type { JsonApiResource, Image } from '$lib/types';
  
  let images = $state<JsonApiResource<Image>[]>([]);
  let isLoading = $state(true);
  let isLoadingMore = $state(false);
  let error = $state('');
  let currentPage = $state(1);
  let totalPages = $state(1);
  let totalCount = $state(0);
  let perPage = $state(15);
  let sortBy = $state('newest');
  let hasMore = $state(true);

  // Convert frontend sort values to backend format
  function getBackendSortValue(frontendSort: string): string {
    switch (frontendSort) {
      case 'newest':
        return 'created_at'; // Backend defaults to desc for anything other than 'title' or 'oldest'
      case 'oldest':
        return 'oldest'; // Backend has specific 'oldest' option
      case 'title':
        return 'title'; // Backend sorts title ascending
      default:
        return 'created_at'; // Default to newest (desc)
    }
  }

  async function loadImages(page = 1, append = false) {
    if (append) {
      isLoadingMore = true;
    } else {
      isLoading = true;
      images = [];
    }
    error = '';

    try {
      const response = await searchApi.search({
        page,
        per_page: perPage,
        sort: getBackendSortValue(sortBy)
      });
      
      if (append) {
        images = [...images, ...response.data];
      } else {
        images = response.data;
      }
      
      currentPage = response.meta.current_page;
      totalPages = response.meta.total_pages;
      totalCount = response.meta.total_count;
      hasMore = currentPage < totalPages;
    } catch (err: any) {
      error = err.message || 'Failed to load images';
      if (!append) {
        images = [];
      }
    }
    
    isLoading = false;
    isLoadingMore = false;
  }

  function handlePerPageChange() {
    currentPage = 1;
    hasMore = true;
    loadImages(1);
  }

  function handleSortChange() {
    currentPage = 1;
    hasMore = true;
    loadImages(1);
  }

  function loadMore() {
    if (hasMore && !isLoadingMore && !isLoading) {
      loadImages(currentPage + 1, true);
    }
  }

  // Infinite scroll handler
  function handleScroll() {
    if (isLoading || isLoadingMore || !hasMore) return;
    
    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Load more when user is within 1000px of bottom
    if (scrollPosition >= documentHeight - 1000) {
      loadMore();
    }
  }

  onMount(() => {
    loadImages(1);
    window.addEventListener('scroll', handleScroll);
  });

  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', handleScroll);
    }
  });
</script>

<svelte:head>
  <title>Gallery - CustomBooru</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Gallery</h1>
            <p class="mt-2 text-sm text-gray-600">
              {totalCount > 0 ? `Discover ${totalCount} beautiful artworks` : 'Explore your image collection'}
            </p>
          </div>
          
          <!-- Controls -->
          <div class="flex items-center gap-6">
            <!-- Items per page -->
            <div class="flex items-center gap-2">
              <label for="perPage" class="text-sm font-medium text-gray-700">Items per load:</label>
              <select
                id="perPage"
                bind:value={perPage}
                on:change={handlePerPageChange}
                class="block border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={25}>25</option>
              </select>
            </div>
            
            <!-- Sort Controls -->
            <div class="flex items-center gap-2">
              <label for="sort" class="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                id="sort"
                bind:value={sortBy}
                on:change={handleSortChange}
                class="block border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Stats Bar -->
        {#if totalCount > 0}
          <div class="bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200/50 px-4 py-2">
            <div class="flex items-center justify-between text-sm text-gray-600">
              <span>Showing {images.length} of {totalCount} images</span>
              {#if hasMore}
                <span class="text-purple-600">Scroll down to load more</span>
              {:else}
                <span class="text-gray-500">All images loaded</span>
              {/if}
            </div>
          </div>
        {/if}
      </div>

      {#if isLoading}
        <!-- Loading Skeleton -->
        <div class="columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-4 space-y-4">
          {#each Array(perPage) as _}
            <div class="break-inside-avoid bg-gray-200 rounded-lg animate-pulse">
              <div class="aspect-[3/4] w-full"></div>
            </div>
          {/each}
        </div>
      {:else if error}
        <div class="text-center py-12 bg-white/50 rounded-2xl border border-gray-200/50">
          <svg class="mx-auto h-16 w-16 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Error Loading Images</h3>
          <p class="text-gray-600 mb-6">{error}</p>
          <button
            on:click={() => loadImages(currentPage)}
            class="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      {:else if images.length === 0}
        <div class="text-center py-12 bg-white/50 rounded-2xl border border-gray-200/50">
          <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No Images Found</h3>
          <p class="text-gray-600 mb-6">Start building your gallery by creating an artist and uploading some artwork.</p>
          <div class="flex gap-3 justify-center">
            <a href="/aliases/create" class="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Create Artist
            </a>
            <a href="/search" class="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search Gallery
            </a>
          </div>
        </div>
      {:else}
        <!-- Images Masonry Grid -->
        <div class="columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-4 space-y-4">
          {#each images as image (image.id)}
            <div class="break-inside-avoid rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-200/50">
              <div class="relative overflow-hidden">
                {#if image.attributes.file_url}
                  <img
                    src={image.attributes.file_url}
                    alt={image.attributes.title}
                    class="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                {:else}
                  <div class="w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                {/if}
                
                <!-- Hover Overlay with All Info -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div class="absolute inset-0 p-4 flex flex-col justify-between">
                    <!-- Top Section - Tags -->
                    <div class="flex justify-start">
                      {#if image.attributes.tags_list && image.attributes.tags_list.length > 0}
                        <div class="flex flex-wrap gap-1">
                          {#each image.attributes.tags_list.slice(0, 4) as tag}
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30">
                              {tag}
                            </span>
                          {/each}
                          {#if image.attributes.tags_list.length > 4}
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30">
                              +{image.attributes.tags_list.length - 4}
                            </span>
                          {/if}
                        </div>
                      {/if}
                    </div>

                    <!-- Bottom Section - Title, Date, and Actions -->
                    <div class="space-y-3">
                      <div>
                        <h3 class="text-white font-medium text-sm leading-tight mb-1">
                          {image.attributes.title}
                        </h3>
                        <p class="text-white/80 text-xs">
                          {new Date(image.attributes.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-1 text-white/60">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                        
                        <a
                          href="/aliases/{image.relationships?.alias?.data?.id}/images/{image.id}"
                          class="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-medium hover:bg-white/30 transition-colors border border-white/30"
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>

        <!-- Loading More Indicator -->
        {#if isLoadingMore}
          <div class="mt-8 flex justify-center">
            <div class="bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200/50 px-6 py-4">
              <div class="flex items-center gap-3 text-gray-600">
                <svg class="animate-spin h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-sm font-medium">Loading more images...</span>
              </div>
            </div>
          </div>
        {/if}

        <!-- Load More Button (fallback for users who prefer clicking) -->
        {#if hasMore && !isLoadingMore && !isLoading && images.length > 0}
          <div class="mt-8 flex justify-center">
            <button
              on:click={loadMore}
              class="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              Load More Images
            </button>
          </div>
        {/if}
      {/if}
    </div>
  </div>
</div>