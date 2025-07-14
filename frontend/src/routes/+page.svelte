<svelte:head>
  <title>CustomBooru - Beautiful Image Gallery</title>
</svelte:head>

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
          <a href="/register" class="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            <span>Start Your Journey</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          <a href="/search" class="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-semibold text-gray-700 bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-300 transform hover:scale-105">
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
        <a href="/register" class="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
          <span>Create Account</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </a>
        <a href="/login" class="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-semibold text-gray-700 bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-300 transform hover:scale-105">
          <span>Sign In</span>
        </a>
      </div>
    </div>
  </section>
</div>