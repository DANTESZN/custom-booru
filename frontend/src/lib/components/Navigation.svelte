<script lang="ts">
  import { authStore } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import { tokens } from '$lib/design-system/tokens';

  let { auth } = $props();

  async function handleLogout() {
    await authStore.logout();
    goto('/login');
  }
</script>

<nav class="{tokens.colors.glass.white} {tokens.colors.glass.backdrop} shadow-sm border-b {tokens.colors.glass.border}">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16">
      <!-- Logo/Brand -->
      <div class="flex items-center">
        <a href="/" class="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-pink-700 transition-all duration-200">
          CustomBooru
        </a>
      </div>

      <!-- Navigation Links -->
      <div class="flex items-center space-x-4">
        {#if auth.isAuthenticated}
          <a 
            href="/aliases" 
            class="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium backdrop-blur-sm hover:bg-purple-50/50 transition-all duration-200 transform hover:scale-105"
          >
            Artists
          </a>
          <a 
            href="/images" 
            class="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium backdrop-blur-sm hover:bg-purple-50/50 transition-all duration-200 transform hover:scale-105"
          >
            Gallery
          </a>
          <a 
            href="/tags" 
            class="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium backdrop-blur-sm hover:bg-purple-50/50 transition-all duration-200 transform hover:scale-105"
          >
            Tags
          </a>
          <a 
            href="/search" 
            class="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium backdrop-blur-sm hover:bg-purple-50/50 transition-all duration-200 transform hover:scale-105"
          >
            Search
          </a>
          
          <!-- User Menu -->
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-700 font-medium">
              {auth.user?.email}
            </span>
            <button
              on:click={handleLogout}
              class="{tokens.colors.glass.white} hover:bg-gray-100/80 text-gray-700 px-3 py-2 rounded-md text-sm font-medium backdrop-blur-sm border {tokens.colors.glass.border} shadow-sm hover:shadow transition-all duration-200 transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        {:else}
          <a 
            href="/login" 
            class="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium backdrop-blur-sm hover:bg-purple-50/50 transition-all duration-200 transform hover:scale-105"
          >
            Login
          </a>
          <a 
            href="/register" 
            class="{tokens.colors.brand.gradient.primary} {tokens.colors.brand.gradient.primaryHover} text-white px-3 py-2 rounded-md text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            Register
          </a>
        {/if}
      </div>
    </div>
  </div>
</nav>