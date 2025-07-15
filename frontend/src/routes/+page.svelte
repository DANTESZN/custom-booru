<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '$lib/stores/auth';
  import { searchApi } from '$lib/api/search';
  import type { JsonApiResource, Image, AuthState } from '$lib/types';
  import { tokens } from '$lib/design-system/tokens';
  
  let authState = $state<AuthState>({ user: null, isAuthenticated: false, isLoading: true });
  let recentImages = $state<JsonApiResource<Image>[]>([]);
  let isLoadingImages = $state(false);

  async function loadRecentImages() {
    if (!authState.isAuthenticated) return;
    
    isLoadingImages = true;
    try {
      const response = await searchApi.search({
        page: 1,
        per_page: 12,
        sort: 'created_at',
        order: 'desc'
      });
      recentImages = response.data;
    } catch (error) {
      console.error('Failed to load recent images:', error);
    }
    isLoadingImages = false;
  }

  onMount(() => {
    const unsubscribe = authStore.subscribe((state) => {
      authState = state;
      if (state.isAuthenticated && !state.isLoading) {
        loadRecentImages();
      }
    });

    authStore.init();

    return unsubscribe;
  });
</script>

<svelte:head>
  <title>CustomBooru - Beautiful Image Gallery</title>
</svelte:head>

{#if authState.isLoading}
  <!-- Loading State -->
  <div class="min-h-screen flex items-center justify-center">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
  </div>
{:else if authState.isAuthenticated}
  <!-- Authenticated User Dashboard -->
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
    <!-- Welcome Header -->
    <section class="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 pt-20 pb-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              Welcome back, {authState.user?.email?.split('@')[0] || 'Artist'}! 
            </h1>
            <p class="text-gray-600 mt-2">Discover and manage your beautiful collection</p>
          </div>
          <div class="flex gap-3">
            <a href="/aliases/create" class="inline-flex items-center gap-2 px-4 py-2 {tokens.colors.brand.gradient.primary} {tokens.colors.brand.gradient.primaryHover} text-white rounded-lg shadow-md hover:shadow-lg {tokens.transitions.default} {tokens.animations.scaleOnHover}">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Artist
            </a>
            <a href="/search" class="inline-flex items-center gap-2 px-4 py-2 {tokens.colors.glass.white} text-gray-700 rounded-lg border {tokens.colors.glass.border} hover:bg-gray-50 {tokens.transitions.default} {tokens.animations.scaleOnHover} shadow-sm hover:shadow">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Images Gallery -->
    <section class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Recent Uploads</h2>
          <a href="/images" class="text-purple-600 hover:text-purple-700 font-medium">View All →</a>
        </div>

        {#if isLoadingImages}
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {#each Array(12) as _}
              <div class="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
            {/each}
          </div>
        {:else if recentImages.length === 0}
          <div class="text-center py-12 bg-white/50 rounded-2xl border border-gray-200/50">
            <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">No images yet</h3>
            <p class="text-gray-600 mb-6">Start building your collection by adding artists and uploading artwork</p>
            <div class="flex gap-3 justify-center">
              <a href="/aliases/create" class="inline-flex items-center gap-2 px-6 py-3 {tokens.colors.brand.gradient.primary} {tokens.colors.brand.gradient.primaryHover} text-white rounded-lg shadow-md hover:shadow-lg {tokens.transitions.default} {tokens.animations.scaleOnHover}">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Create Artist
              </a>
              <a href="/tags" class="inline-flex items-center gap-2 px-6 py-3 {tokens.colors.glass.white} text-gray-700 rounded-lg border {tokens.colors.glass.border} hover:bg-gray-50 {tokens.transitions.default} {tokens.animations.scaleOnHover} shadow-sm hover:shadow">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Manage Tags
              </a>
            </div>
          </div>
        {:else}
          <!-- Images Masonry Grid -->
          <div class="columns-2 md:columns-3 lg:columns-4 xl:columns-6 gap-4 space-y-4">
            {#each recentImages as image (image.id)}
              <div class="break-inside-avoid bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden border border-gray-200/50">
                <div class="relative overflow-hidden">
                  {#if image.attributes.file_url}
                    <img
                      src={image.attributes.file_url}
                      alt={image.attributes.title}
                      class="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  {:else}
                    <div class="w-full aspect-square bg-gray-200 flex items-center justify-center">
                      <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  {/if}
                  
                  <!-- Hover Overlay -->
                  <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <a
                      href="/aliases/{image.relationships?.alias?.data?.id}/images/{image.id}"
                      class="bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full font-medium hover:bg-white transition-colors"
                    >
                      View Details
                    </a>
                  </div>
                </div>
                
                <div class="p-3">
                  <h3 class="font-medium text-gray-900 text-sm truncate mb-1">
                    {image.attributes.title}
                  </h3>
                  
                  {#if image.attributes.tags_list && image.attributes.tags_list.length > 0}
                    <div class="flex flex-wrap gap-1 mb-2">
                      {#each image.attributes.tags_list.slice(0, 2) as tag}
                        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {tag}
                        </span>
                      {/each}
                      {#if image.attributes.tags_list.length > 2}
                        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          +{image.attributes.tags_list.length - 2}
                        </span>
                      {/if}
                    </div>
                  {/if}
                  
                  <div class="text-xs text-gray-500">
                    {new Date(image.attributes.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </section>

    <!-- Quick Actions -->
    <section class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <a href="/aliases" class="group bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 hover:border-purple-200 hover:bg-white/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Manage Artists</h3>
            <p class="text-gray-600 text-sm">View and organize artist profiles</p>
          </a>

          <a href="/tags" class="group bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 hover:border-purple-200 hover:bg-white/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Organize Tags</h3>
            <p class="text-gray-600 text-sm">Create and manage content tags</p>
          </a>

          <a href="/search" class="group bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 hover:border-purple-200 hover:bg-white/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Search Gallery</h3>
            <p class="text-gray-600 text-sm">Find artwork with powerful filters</p>
          </a>

          <a href="/images" class="group bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 hover:border-purple-200 hover:bg-white/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div class="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Browse Gallery</h3>
            <p class="text-gray-600 text-sm">Explore your complete collection</p>
          </a>
        </div>
      </div>
    </section>
  </div>
{:else}
  <!-- Non-authenticated Landing Page -->
  <div class="overflow-hidden">
    <!-- Hero Section -->
    <section class="relative pt-20 pb-32">
    <!-- Background Elements -->
    <div class="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50"></div>
    <div class="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
    <div class="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
    <div class="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
    
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <!-- Main Heading -->
        <h1 class="text-5xl md:text-7xl font-bold mb-8">
          <span class="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
            Beautiful
          </span>
          <br>
          <span class="text-gray-900">Image Gallery</span>
        </h1>
        
        <!-- Subtitle -->
        <p class="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          Discover, organize, and share stunning artwork with CustomBooru. 
          A modern platform built for artists and art enthusiasts.
        </p>
        
        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href="/register" class="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-semibold text-white {tokens.colors.brand.gradient.primary} {tokens.colors.brand.gradient.primaryHover} shadow-lg hover:shadow-xl {tokens.transitions.slow} {tokens.animations.scaleOnHover}">
            <span>Start Your Journey</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          <a href="/search" class="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-semibold text-gray-700 {tokens.colors.glass.white} {tokens.colors.glass.backdrop} border {tokens.colors.glass.border} hover:bg-white hover:shadow-lg {tokens.transitions.slow} {tokens.animations.scaleOnHover}">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Explore Gallery</span>
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section class="py-20 bg-white/50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Everything you need to manage art
        </h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Powerful features designed to make organizing and discovering artwork effortless and enjoyable.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Artists Feature -->
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 hover:border-purple-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
          <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Artist Profiles</h3>
          <p class="text-gray-600 text-sm leading-relaxed">
            Create detailed profiles for artists with social links, bios, and portfolios.
          </p>
          <a href="/aliases" class="inline-flex items-center gap-2 text-purple-600 font-medium text-sm mt-4 hover:text-purple-700 transition-colors">
            Manage Artists
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <!-- Gallery Feature -->
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 hover:border-purple-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
          <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Smart Gallery</h3>
          <p class="text-gray-600 text-sm leading-relaxed">
            Upload, organize, and browse artwork with an intuitive grid layout.
          </p>
          <a href="/images" class="inline-flex items-center gap-2 text-purple-600 font-medium text-sm mt-4 hover:text-purple-700 transition-colors">
            View Gallery
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <!-- Tags Feature -->
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 hover:border-purple-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
          <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Tag System</h3>
          <p class="text-gray-600 text-sm leading-relaxed">
            Organize content with powerful tagging for easy categorization and discovery.
          </p>
          <a href="/tags" class="inline-flex items-center gap-2 text-purple-600 font-medium text-sm mt-4 hover:text-purple-700 transition-colors">
            Manage Tags
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <!-- Search Feature -->
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 hover:border-purple-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
          <div class="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Advanced Search</h3>
          <p class="text-gray-600 text-sm leading-relaxed">
            Find artwork instantly with powerful filters, tags, and metadata search.
          </p>
          <a href="/search" class="inline-flex items-center gap-2 text-purple-600 font-medium text-sm mt-4 hover:text-purple-700 transition-colors">
            Start Searching
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- Stats Section -->
  <section class="py-16 bg-gradient-to-r from-purple-600 to-pink-600">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div class="text-white">
          <div class="text-3xl md:text-4xl font-bold mb-2">∞</div>
          <div class="text-purple-100 text-sm">Unlimited Storage</div>
        </div>
        <div class="text-white">
          <div class="text-3xl md:text-4xl font-bold mb-2">⚡</div>
          <div class="text-purple-100 text-sm">Lightning Fast</div>
        </div>
        <div class="text-white">
          <div class="text-3xl md:text-4xl font-bold mb-2">🎨</div>
          <div class="text-purple-100 text-sm">Artist Focused</div>
        </div>
        <div class="text-white">
          <div class="text-3xl md:text-4xl font-bold mb-2">🔍</div>
          <div class="text-purple-100 text-sm">Smart Search</div>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="py-20 bg-white/80">
    <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
        Ready to organize your art collection?
      </h2>
      <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
        Join CustomBooru today and experience the most beautiful way to manage and discover artwork.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="/register" class="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-semibold text-white {tokens.colors.brand.gradient.primary} {tokens.colors.brand.gradient.primaryHover} shadow-lg hover:shadow-xl {tokens.transitions.slow} {tokens.animations.scaleOnHover}">
          <span>Create Account</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </a>
        <a href="/login" class="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-semibold text-gray-700 {tokens.colors.glass.white} {tokens.colors.glass.backdrop} border {tokens.colors.glass.border} hover:bg-white hover:shadow-lg {tokens.transitions.slow} {tokens.animations.scaleOnHover}">
          <span>Sign In</span>
        </a>
      </div>
    </div>
  </section>
  </div>
{/if}