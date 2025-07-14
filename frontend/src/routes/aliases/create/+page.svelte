<script lang="ts">
  import { goto } from '$app/navigation';
  import { aliasStore } from '$lib/stores/aliases';
  
  let name = '';
  let description = '';
  let socialLinks = $state({
    twitter: '',
    instagram: '',
    website: '',
    pixiv: '',
    deviantart: ''
  });
  let isLoading = false;
  let error = '';

  async function handleSubmit() {
    if (!name.trim()) {
      error = 'Artist name is required';
      return;
    }

    isLoading = true;
    error = '';

    // Filter out empty social links
    const filteredSocialLinks = Object.entries(socialLinks)
      .filter(([_, url]) => url.trim())
      .reduce((acc, [platform, url]) => ({ ...acc, [platform]: url }), {});

    const aliasData = {
      alias: {
        name: name.trim(),
        description: description.trim() || undefined,
        social_links: Object.keys(filteredSocialLinks).length > 0 ? filteredSocialLinks : undefined
      }
    };

    const result = await aliasStore.createAlias(aliasData);
    
    if (result.success) {
      goto('/aliases');
    } else {
      error = result.error || 'Failed to create artist';
    }
    
    isLoading = false;
  }
</script>

<svelte:head>
  <title>Add Artist - CustomBooru</title>
</svelte:head>

<div class="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
  <div class="px-4 py-6 sm:px-0">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Add New Artist</h1>
      <p class="mt-2 text-sm text-gray-600">
        Create a new artist profile to organize their artwork.
      </p>
    </div>

    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
      <!-- Artist Name -->
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">
          Artist Name *
        </label>
        <input
          type="text"
          id="name"
          bind:value={name}
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Enter artist name"
        />
      </div>

      <!-- Description -->
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          bind:value={description}
          rows="4"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Brief description about the artist..."
        ></textarea>
      </div>

      <!-- Social Links -->
      <div>
        <h3 class="text-lg font-medium text-gray-900 mb-4">Social Links</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="twitter" class="block text-sm font-medium text-gray-700">
              Twitter
            </label>
            <input
              type="url"
              id="twitter"
              bind:value={socialLinks.twitter}
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="https://twitter.com/username"
            />
          </div>

          <div>
            <label for="instagram" class="block text-sm font-medium text-gray-700">
              Instagram
            </label>
            <input
              type="url"
              id="instagram"
              bind:value={socialLinks.instagram}
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="https://instagram.com/username"
            />
          </div>

          <div>
            <label for="website" class="block text-sm font-medium text-gray-700">
              Website
            </label>
            <input
              type="url"
              id="website"
              bind:value={socialLinks.website}
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label for="pixiv" class="block text-sm font-medium text-gray-700">
              Pixiv
            </label>
            <input
              type="url"
              id="pixiv"
              bind:value={socialLinks.pixiv}
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="https://pixiv.net/users/123456"
            />
          </div>

          <div class="md:col-span-2">
            <label for="deviantart" class="block text-sm font-medium text-gray-700">
              DeviantArt
            </label>
            <input
              type="url"
              id="deviantart"
              bind:value={socialLinks.deviantart}
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="https://username.deviantart.com"
            />
          </div>
        </div>
      </div>

      {#if error}
        <div class="rounded-md bg-red-50 p-4">
          <div class="text-sm text-red-700">
            {error}
          </div>
        </div>
      {/if}

      <!-- Actions -->
      <div class="flex justify-end space-x-3">
        <a
          href="/aliases"
          class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </a>
        <button
          type="submit"
          disabled={isLoading}
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {#if isLoading}
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating...
          {:else}
            Create Artist
          {/if}
        </button>
      </div>
    </form>
  </div>
</div>