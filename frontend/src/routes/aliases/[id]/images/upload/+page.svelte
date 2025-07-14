<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { imageStore } from '$lib/stores/images';
  import { aliasApi } from '$lib/api/aliases';
  import { tagStore } from '$lib/stores/tags';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  
  let aliasId = '';
  let alias = null;
  
  let title = '';
  let description = '';
  let file = null;
  let metadata = {
    width: '',
    height: '',
    source_url: ''
  };
  let isLoading = false;
  let error = '';
  let previewUrl = '';
  
  // Tag management
  let selectedTags = [];
  let availableTags = [];
  let tagSuggestions = [];
  let showTagSuggestions = false;
  let currentTagInput = '';
  
  // Use store for reactivity
  const loadingStore = writable(false);
  const errorStore = writable('');

  async function loadAlias() {
    try {
      alias = await aliasApi.getById(aliasId);
    } catch (err) {
      error = err.message || 'Failed to load artist';
      errorStore.set(error);
    }
  }

  async function loadTags() {
    try {
      const result = await tagStore.loadTags(1, 100);
      if (result.success) {
        availableTags = result.data.data;
      }
    } catch (err) {
      console.error('Failed to load tags:', err);
    }
  }

  function addTag(tagName) {
    if (tagName && !selectedTags.includes(tagName)) {
      selectedTags = [...selectedTags, tagName];
    }
    currentTagInput = '';
    showTagSuggestions = false;
  }

  function removeTag(tagName) {
    selectedTags = selectedTags.filter(tag => tag !== tagName);
  }

  function handleTagInput(event) {
    const target = event.target;
    currentTagInput = target.value;
    
    if (currentTagInput.length > 0) {
      tagSuggestions = availableTags.filter(tag => 
        tag.attributes.name.toLowerCase().includes(currentTagInput.toLowerCase()) &&
        !selectedTags.includes(tag.attributes.name)
      );
      showTagSuggestions = tagSuggestions.length > 0;
    } else {
      showTagSuggestions = false;
    }
  }

  function handleTagKeydown(event) {
    if (event.key === 'Enter' && currentTagInput.trim()) {
      event.preventDefault();
      addTag(currentTagInput.trim());
    } else if (event.key === 'Escape') {
      showTagSuggestions = false;
    }
  }

  function handleFileChange(event) {
    const target = event.target;
    const selectedFile = target.files?.[0];
    
    if (selectedFile) {
      file = selectedFile;
      previewUrl = URL.createObjectURL(selectedFile);
      
      // Auto-fill title from filename if empty
      if (!title) {
        title = selectedFile.name.replace(/\.[^/.]+$/, "");
      }
    }
  }

  async function handleSubmit() {
    if (!file) {
      error = 'Please select an image file';
      errorStore.set(error);
      return;
    }

    if (!title.trim()) {
      error = 'Title is required';
      errorStore.set(error);
      return;
    }

    isLoading = true;
    loadingStore.set(true);
    error = '';
    errorStore.set('');

    // Filter out empty metadata
    const filteredMetadata = Object.entries(metadata)
      .filter(([_, value]) => value.trim())
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    const imageData = {
      image: {
        title: title.trim(),
        description: description.trim() || '',
        file,
        metadata: Object.keys(filteredMetadata).length > 0 ? filteredMetadata : undefined
      }
    };

    // Add tags if any are selected
    if (selectedTags.length > 0) {
      imageData.tags = selectedTags;
    }

    const result = await imageStore.uploadImage(aliasId, imageData);
    
    if (result.success) {
      goto(`/aliases/${aliasId}/images`);
    } else {
      error = result.error || 'Failed to upload image';
      errorStore.set(error);
    }
    
    isLoading = false;
    loadingStore.set(false);
  }

  onMount(() => {
    aliasId = $page.params.id;
    loadAlias();
    loadTags();
  });
</script>

<svelte:head>
  <title>Upload Image - {alias?.attributes.name || 'Artist'} - CustomBooru</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
  <div class="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <!-- Header -->
      <div class="mb-8 text-center">
        <h1 class="text-4xl font-bold mb-4">
          <span class="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
            Upload Image
          </span>
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Upload a new image for <span class="font-semibold text-purple-600">{alias?.attributes.name || 'this artist'}</span>
        </p>
      </div>

      <div class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 space-y-6">
        <form on:submit|preventDefault={handleSubmit} class="space-y-6">
          <!-- File Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Image File *
            </label>
            <div class="flex justify-center px-6 pt-5 pb-6 border-2 border-purple-300 border-dashed rounded-xl hover:border-purple-400 transition-colors bg-gradient-to-br from-purple-50 to-pink-50">
              <div class="space-y-1 text-center">
                {#if previewUrl}
                  <div class="mb-4">
                    <img src={previewUrl} alt="Preview" class="mx-auto h-32 w-auto rounded-lg shadow-lg" />
                  </div>
                {:else}
                  <svg class="mx-auto h-12 w-12 text-purple-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                {/if}
                <div class="flex text-sm text-gray-600">
                  <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                    <span>{file ? 'Change image' : 'Upload an image'}</span>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      on:change={handleFileChange}
                      class="sr-only"
                      required
                    />
                  </label>
                  <p class="pl-1">or drag and drop</p>
                </div>
                <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>

          <!-- Title -->
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700">
              Title *
            </label>
            <input
              type="text"
              id="title"
              bind:value={title}
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              placeholder="Enter image title"
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
              rows="3"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              placeholder="Brief description of the image..."
            ></textarea>
          </div>

          <!-- Tags -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div class="space-y-2">
              <!-- Selected Tags -->
              {#if selectedTags.length > 0}
                <div class="flex flex-wrap gap-2">
                  {#each selectedTags as tag}
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                      {tag}
                      <button
                        type="button"
                        on:click={() => removeTag(tag)}
                        class="ml-2 text-purple-600 hover:text-purple-500"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
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
                  placeholder="Type to search tags or create new ones..."
                  class="block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                />
                
                <!-- Tag Suggestions -->
                {#if showTagSuggestions}
                  <div class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-xl py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {#each tagSuggestions as tag}
                      <button
                        type="button"
                        on:click={() => addTag(tag.attributes.name)}
                        class="w-full text-left px-4 py-2 hover:bg-purple-50 flex justify-between items-center"
                      >
                        <span>{tag.attributes.name}</span>
                        <span class="text-xs text-gray-500">({tag.attributes.images_count || 0} images)</span>
                      </button>
                    {/each}
                    <!-- Option to create new tag -->
                    {#if currentTagInput.trim() && !tagSuggestions.some(tag => tag.attributes.name.toLowerCase() === currentTagInput.toLowerCase())}
                      <button
                        type="button"
                        on:click={() => addTag(currentTagInput.trim())}
                        class="w-full text-left px-4 py-2 hover:bg-purple-50 flex items-center text-purple-600"
                      >
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Create "{currentTagInput.trim()}"
                      </button>
                    {/if}
                  </div>
                {/if}
              </div>
            </div>
          </div>

          <!-- Metadata -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Metadata</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="width" class="block text-sm font-medium text-gray-700">
                  Width (px)
                </label>
                <input
                  type="number"
                  id="width"
                  bind:value={metadata.width}
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="1920"
                />
              </div>

              <div>
                <label for="height" class="block text-sm font-medium text-gray-700">
                  Height (px)
                </label>
                <input
                  type="number"
                  id="height"
                  bind:value={metadata.height}
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="1080"
                />
              </div>

              <div class="md:col-span-2">
                <label for="source_url" class="block text-sm font-medium text-gray-700">
                  Source URL
                </label>
                <input
                  type="url"
                  id="source_url"
                  bind:value={metadata.source_url}
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="https://example.com/original-post"
                />
              </div>
            </div>
          </div>

      {#if $errorStore}
        <div class="rounded-md bg-red-50 p-4">
          <div class="text-sm text-red-700">
            {$errorStore}
          </div>
        </div>
      {/if}

      <!-- Actions -->
      <div class="flex justify-end space-x-3">
        <a
          href="/aliases/{aliasId}/images"
          class="bg-white py-2 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Cancel
        </a>
        <button
          type="submit"
          disabled={$loadingStore || !file}
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200"
        >
          {#if $loadingStore}
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading...
          {:else}
            Upload Image
          {/if}
        </button>
      </div>
    </form>
  </div>
    </div>
  </div>
</div>