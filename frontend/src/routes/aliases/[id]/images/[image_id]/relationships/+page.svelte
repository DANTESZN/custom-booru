<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { imageApi } from '$lib/api/images';
  import { aliasApi } from '$lib/api/aliases';
  import { authStore } from '$lib/stores/auth';
  import type { JsonApiResource, Image, Alias } from '$lib/types';

  let aliasId = '';
  let imageId = '';
  let alias: JsonApiResource<Alias> | null = null;
  let image: JsonApiResource<Image> | null = null;
  let relationships = $state([]);
  let relationshipTypes = $state({});
  let availableImages = $state([]);
  let isLoading = $state(true);
  let error = $state('');
  let saving = $state(false);

  // Form state
  let selectedImageId = $state('');
  let selectedRelationshipType = $state('');
  let relationshipDescription = $state('');
  let showAddForm = $state(false);

  onMount(async () => {
    aliasId = $page.params.id;
    imageId = $page.params.image_id;

    // Wait for auth store to initialize
    const authState = $authStore;
    if (authState.isLoading) {
      await new Promise((resolve) => {
        const unsubscribe = authStore.subscribe((state) => {
          if (!state.isLoading) {
            unsubscribe();
            resolve(true);
          }
        });
      });
    }

    try {
      // Load alias and image data
      alias = await aliasApi.getById(aliasId);
      image = await imageApi.getById(aliasId, imageId);

      // Load relationships and relationship types
      relationships = await imageApi.getRelationships(aliasId, imageId);
      relationshipTypes = await imageApi.getRelationshipTypes();

      // Load other images from the same alias (for creating relationships)
      const imagesResponse = await imageApi.getByAlias(aliasId, 1, 100);
      availableImages = imagesResponse.data.filter(img => img.id !== imageId);

      isLoading = false;
    } catch (err: any) {
      console.error('Error loading data:', err);
      if (err.status === 404) {
        error = 'Image not found';
      } else if (err.status === 403) {
        error = 'You do not have permission to manage relationships for this image';
      } else if (err.status === 401) {
        error = 'You must be logged in to manage relationships';
      } else {
        error = err.message || 'Failed to load data';
      }
      isLoading = false;
    }
  });

  async function addRelationship() {
    if (!selectedImageId || !selectedRelationshipType) return;

    saving = true;
    try {
      await imageApi.addRelationship(
        aliasId, 
        imageId, 
        selectedImageId, 
        selectedRelationshipType, 
        relationshipDescription || undefined
      );

      // Reload relationships
      relationships = await imageApi.getRelationships(aliasId, imageId);
      
      // Reset form
      selectedImageId = '';
      selectedRelationshipType = '';
      relationshipDescription = '';
      showAddForm = false;
      
    } catch (err: any) {
      console.error('Error adding relationship:', err);
      error = err.message || 'Failed to add relationship';
    }
    saving = false;
  }

  async function removeRelationship(relationshipId: string) {
    if (!confirm('Are you sure you want to remove this relationship?')) return;

    saving = true;
    try {
      await imageApi.removeRelationship(aliasId, imageId, relationshipId);
      
      // Reload relationships
      relationships = await imageApi.getRelationships(aliasId, imageId);
      
    } catch (err: any) {
      console.error('Error removing relationship:', err);
      error = err.message || 'Failed to remove relationship';
    }
    saving = false;
  }
</script>

<svelte:head>
  <title>Manage Relationships - {image?.attributes.title || 'Image'} - CustomBooru</title>
</svelte:head>

<div class="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
  <div class="px-4 py-6 sm:px-0">
    {#if isLoading}
      <div class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    {:else if error}
      <div class="rounded-md bg-red-50 p-4">
        <div class="text-sm text-red-700">
          {error}
        </div>
        <div class="mt-4">
          <a href="/aliases/{aliasId}/images/{imageId}" class="text-indigo-600 hover:text-indigo-500">
            ← Back to image
          </a>
        </div>
      </div>
    {:else if image}
      <!-- Breadcrumb -->
      <nav class="flex mb-8" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-3">
          <li class="inline-flex items-center">
            <a href="/aliases" class="text-gray-500 hover:text-gray-700">Artists</a>
          </li>
          <li>
            <div class="flex items-center">
              <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
              <a href="/aliases/{aliasId}" class="text-gray-500 hover:text-gray-700 ml-1 md:ml-2">
                {alias?.attributes.name}
              </a>
            </div>
          </li>
          <li>
            <div class="flex items-center">
              <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
              <a href="/aliases/{aliasId}/images/{imageId}" class="text-gray-500 hover:text-gray-700 ml-1 md:ml-2">
                {image.attributes.title || 'Untitled'}
              </a>
            </div>
          </li>
          <li>
            <div class="flex items-center">
              <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-900 ml-1 md:ml-2 font-medium">Manage Relationships</span>
            </div>
          </li>
        </ol>
      </nav>

      <!-- Page Header -->
      <div class="md:flex md:items-center md:justify-between mb-8">
        <div class="flex-1 min-w-0">
          <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Manage Image Relationships
          </h1>
          <p class="mt-1 text-sm text-gray-500">
            Create and manage relationships between images for version control, series, themes, and more.
          </p>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <button
            on:click={() => showAddForm = !showAddForm}
            class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Relationship
          </button>
        </div>
      </div>

      <!-- Current Image Info -->
      <div class="bg-white shadow rounded-lg mb-8">
        <div class="px-6 py-4">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              {#if image.attributes.file_url}
                <img src={image.attributes.file_url} alt={image.attributes.title} class="h-16 w-16 object-cover rounded-lg" />
              {:else}
                <div class="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  <svg class="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                  </svg>
                </div>
              {/if}
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900">{image.attributes.title || 'Untitled'}</h3>
              <p class="text-sm text-gray-500">Managing relationships for this image</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Relationship Form -->
      {#if showAddForm}
        <div class="bg-white shadow rounded-lg mb-8">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Add New Relationship</h3>
          </div>
          <div class="px-6 py-4 space-y-4">
            <!-- Relationship Type -->
            <div>
              <label for="relationship-type" class="block text-sm font-medium text-gray-700">
                Relationship Type
              </label>
              <select
                id="relationship-type"
                bind:value={selectedRelationshipType}
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select a relationship type</option>
                {#each Object.entries(relationshipTypes) as [type, description]}
                  <option value={type}>{type} - {description}</option>
                {/each}
              </select>
            </div>

            <!-- Related Image -->
            <div>
              <label for="related-image" class="block text-sm font-medium text-gray-700">
                Related Image
              </label>
              <select
                id="related-image"
                bind:value={selectedImageId}
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select an image</option>
                {#each availableImages as availableImage}
                  <option value={availableImage.id}>
                    {availableImage.attributes.title || 'Untitled'} (ID: {availableImage.id})
                  </option>
                {/each}
              </select>
            </div>

            <!-- Description -->
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700">
                Description (Optional)
              </label>
              <input
                type="text"
                id="description"
                bind:value={relationshipDescription}
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Optional description for this relationship"
              />
            </div>

            <!-- Form Actions -->
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                on:click={() => showAddForm = false}
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="button"
                on:click={addRelationship}
                disabled={!selectedImageId || !selectedRelationshipType || saving}
                class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Adding...' : 'Add Relationship'}
              </button>
            </div>
          </div>
        </div>
      {/if}

      <!-- Existing Relationships -->
      {#if relationships && relationships.length > 0}
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Current Relationships</h3>
          </div>
          <div class="divide-y divide-gray-200">
            {#each relationships as relationshipGroup}
              <div class="px-6 py-4">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-md font-medium text-gray-900 capitalize">{relationshipGroup.type}</h4>
                  <span class="text-sm text-gray-500">{relationshipTypes[relationshipGroup.type] || ''}</span>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {#each relationshipGroup.relationships as relationship}
                    <div class="border border-gray-200 rounded-lg p-4">
                      <div class="flex items-center space-x-3">
                        {#if relationship.related_image.attributes.file_url}
                          <img
                            src={relationship.related_image.attributes.file_url}
                            alt={relationship.related_image.attributes.title}
                            class="h-12 w-12 object-cover rounded"
                          />
                        {:else}
                          <div class="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                            <svg class="h-6 w-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                            </svg>
                          </div>
                        {/if}
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-medium text-gray-900 truncate">
                            {relationship.related_image.attributes.title || 'Untitled'}
                          </p>
                          {#if relationship.description}
                            <p class="text-xs text-gray-500 truncate">{relationship.description}</p>
                          {/if}
                          <p class="text-xs text-gray-400">
                            {relationship.direction === 'outgoing' ? 'This → Related' : 'Related → This'}
                          </p>
                        </div>
                        <button
                          on:click={() => removeRelationship(relationship.id)}
                          disabled={saving}
                          class="text-red-600 hover:text-red-800 disabled:opacity-50"
                        >
                          <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  {/each}
                </div>
              </div>
            {/each}
          </div>
        </div>
      {:else}
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-12 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No relationships</h3>
            <p class="mt-1 text-sm text-gray-500">Get started by adding your first image relationship.</p>
            <div class="mt-6">
              <button
                on:click={() => showAddForm = true}
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Relationship
              </button>
            </div>
          </div>
        </div>
      {/if}

      <!-- Back Button -->
      <div class="mt-8">
        <a
          href="/aliases/{aliasId}/images/{imageId}"
          class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Image
        </a>
      </div>
    {/if}
  </div>
</div>