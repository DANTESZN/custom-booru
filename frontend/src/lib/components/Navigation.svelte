<script lang="ts">
  import { authStore } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  let { auth } = $props();

  async function handleLogout() {
    await authStore.logout();
    goto('/login');
  }
</script>

<nav class="bg-white shadow-sm border-b border-gray-200">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16">
      <!-- Logo/Brand -->
      <div class="flex items-center">
        <a href="/" class="text-xl font-bold text-gray-900">
          CustomBooru
        </a>
      </div>

      <!-- Navigation Links -->
      <div class="flex items-center space-x-4">
        {#if auth.isAuthenticated}
          <a 
            href="/aliases" 
            class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            Artists
          </a>
          <a 
            href="/images" 
            class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            Gallery
          </a>
          <a 
            href="/tags" 
            class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            Tags
          </a>
          <a 
            href="/search" 
            class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            Search
          </a>
          
          <!-- User Menu -->
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-700">
              {auth.user?.email}
            </span>
            <button
              on:click={handleLogout}
              class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        {:else}
          <a 
            href="/login" 
            class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            Login
          </a>
          <a 
            href="/register" 
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            Register
          </a>
        {/if}
      </div>
    </div>
  </div>
</nav>