<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { imageStore } from '$lib/stores/images';
  import { imageApi } from '$lib/api/images';
  import { tagStore } from '$lib/stores/tags';
  import type { JsonApiResource, Image } from '$lib/types';

  // Props
  export let isOpen = false;
  export let aliasId: string;
  export let currentImageId: string;
  export let relationshipTypes: Record<string, string>;
  export let onSuccess: (newRelationships: any[]) => void;
  export let onClose: () => void;

  // Types
  interface SelectedFile {
    id: string;
    file: File;
    previewUrl: string;
    title: string;
    description: string;
    status: 'pending' | 'uploading' | 'completed' | 'failed';
    progress: number;
    error?: string;
  }

  interface SharedSettings {
    tags: string[];
    relationshipType: string;
    relationshipDescription: string;
    metadata: {
      source_url: string;
    };
  }

  // State
  let selectedFiles: SelectedFile[] = [];
  let sharedSettings: SharedSettings = {
    tags: [],
    relationshipType: '',
    relationshipDescription: '',
    metadata: { source_url: '' }
  };
  
  let availableTags: any[] = [];
  let tagSuggestions: any[] = [];
  let showTagSuggestions = false;
  let currentTagInput = '';
  
  let isUploading = false;
  let uploadComplete = false;
  let totalProgress = 0;
  let error = '';

  // Load available tags
  onMount(async () => {
    try {
      const result = await tagStore.loadTags(1, 100);
      if (result.success) {
        availableTags = result.data.data;
      }
    } catch (err) {
      console.error('Failed to load tags:', err);
    }
  });

  // Cleanup preview URLs
  onDestroy(() => {
    selectedFiles.forEach(file => {
      if (file.previewUrl) {
        URL.revokeObjectURL(file.previewUrl);
      }
    });
  });

  // File handling
  function handleFileSelection(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = Array.from(target.files || []);
    addFiles(files);
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    const files = Array.from(event.dataTransfer?.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    addFiles(imageFiles);
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
  }

  function addFiles(files: File[]) {
    const newFiles = files.map(file => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
      title: file.name.replace(/\.[^/.]+$/, ""),
      description: '',
      status: 'pending' as const,
      progress: 0
    }));
    selectedFiles = [...selectedFiles, ...newFiles];
  }

  function removeFile(fileId: string) {
    const file = selectedFiles.find(f => f.id === fileId);
    if (file?.previewUrl) {
      URL.revokeObjectURL(file.previewUrl);
    }
    selectedFiles = selectedFiles.filter(f => f.id !== fileId);
  }

  // Tag management
  function addTag(tagName: string) {
    if (tagName && !sharedSettings.tags.includes(tagName)) {
      sharedSettings.tags = [...sharedSettings.tags, tagName];
    }
    currentTagInput = '';
    showTagSuggestions = false;
  }

  function removeTag(tagName: string) {
    sharedSettings.tags = sharedSettings.tags.filter(tag => tag !== tagName);
  }

  function handleTagInput(event: Event) {
    const target = event.target as HTMLInputElement;
    currentTagInput = target.value;
    
    if (currentTagInput.length > 0) {
      tagSuggestions = availableTags.filter(tag => 
        tag.attributes.name.toLowerCase().includes(currentTagInput.toLowerCase()) &&
        !sharedSettings.tags.includes(tag.attributes.name)
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

  // Upload process
  async function handleBatchUpload() {
    if (selectedFiles.length === 0 || !sharedSettings.relationshipType) {
      error = 'Please select files and relationship type';
      return;
    }

    if (!aliasId) {
      error = 'Missing alias ID - please refresh the page';
      return;
    }

    console.log('Starting batch upload with aliasId:', aliasId, 'currentImageId:', currentImageId);

    isUploading = true;
    error = '';
    const uploadedImages: JsonApiResource<Image>[] = [];
    const newRelationships: any[] = [];

    try {
      // Upload all images
      for (let i = 0; i < selectedFiles.length; i++) {
        const selectedFile = selectedFiles[i];
        selectedFile.status = 'uploading';

        try {
          // Prepare image data
          const imageData = {
            image: {
              title: selectedFile.title.trim(),
              description: selectedFile.description.trim() || '',
              file: selectedFile.file,
              metadata: Object.keys(sharedSettings.metadata).length > 0 && sharedSettings.metadata.source_url.trim() 
                ? sharedSettings.metadata 
                : undefined
            },
            tags: sharedSettings.tags.length > 0 ? sharedSettings.tags : undefined
          };

          // Upload image
          const uploadResult = await imageStore.uploadImage(aliasId, imageData);
          
          if (uploadResult.success) {
            uploadedImages.push(uploadResult.data);
            selectedFile.status = 'completed';
            selectedFile.progress = 100;
          } else {
            selectedFile.status = 'failed';
            selectedFile.error = uploadResult.error || 'Upload failed';
          }
        } catch (err: any) {
          selectedFile.status = 'failed';
          selectedFile.error = err.message || 'Upload failed';
        }

        // Update total progress
        totalProgress = ((i + 1) / selectedFiles.length) * 50; // 50% for uploads
      }

      // Create relationships if we have successful uploads
      if (uploadedImages.length > 0) {
        // 1. Create relationships between each uploaded image and the current image
        for (let i = 0; i < uploadedImages.length; i++) {
          const uploadedImage = uploadedImages[i];
          try {
            const relationship = await imageApi.addRelationship(
              aliasId,
              currentImageId,
              uploadedImage.id,
              sharedSettings.relationshipType,
              sharedSettings.relationshipDescription || undefined
            );
            newRelationships.push(relationship);
          } catch (err: any) {
            console.error(`Failed to create relationship for image ${uploadedImage.id}:`, err);
          }
          
          // Update progress
          totalProgress = 50 + ((i + 1) / uploadedImages.length) * 25; // 25% for main relationships
        }

        // 2. Interconnect all uploaded images as a series (if more than one image)
        if (uploadedImages.length > 1) {
          const seriesRelationshipType = 'series'; // Use 'series' for interconnections
          
          for (let i = 0; i < uploadedImages.length; i++) {
            for (let j = i + 1; j < uploadedImages.length; j++) {
              try {
                const relationship = await imageApi.addRelationship(
                  aliasId,
                  uploadedImages[i].id,
                  uploadedImages[j].id,
                  seriesRelationshipType,
                  `Part of batch upload series`
                );
                newRelationships.push(relationship);
              } catch (err: any) {
                console.error(`Failed to create series relationship between ${uploadedImages[i].id} and ${uploadedImages[j].id}:`, err);
              }
            }
            
            // Update progress
            const seriesProgress = ((i + 1) / uploadedImages.length) * 25; // 25% for series relationships
            totalProgress = 75 + seriesProgress;
          }
        }
      }

      totalProgress = 100;
      uploadComplete = true;
      
      // Call success callback
      onSuccess(newRelationships);
      
      // Close modal after a brief delay
      setTimeout(() => {
        closeModal();
      }, 1500);

    } catch (err: any) {
      error = err.message || 'Batch upload failed';
      isUploading = false;
    }
  }

  function closeModal() {
    // Cleanup
    selectedFiles.forEach(file => {
      if (file.previewUrl) {
        URL.revokeObjectURL(file.previewUrl);
      }
    });
    
    // Reset state
    selectedFiles = [];
    sharedSettings = {
      tags: [],
      relationshipType: '',
      relationshipDescription: '',
      metadata: { source_url: '' }
    };
    currentTagInput = '';
    showTagSuggestions = false;
    isUploading = false;
    uploadComplete = false;
    totalProgress = 0;
    error = '';
    
    onClose();
  }

  // Close modal on escape key
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && !isUploading) {
      closeModal();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
  <!-- Modal backdrop -->
  <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <!-- Modal content -->
    <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900">Upload & Link Images</h2>
          {#if !isUploading}
            <button
              on:click={closeModal}
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          {/if}
        </div>
        <p class="text-sm text-gray-600 mt-1">
          Upload multiple images and automatically create relationships with the current image and between each other as a series.
        </p>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
        {#if !isUploading && !uploadComplete}
          <!-- File Selection -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Select Images
            </label>
            <div
              class="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors bg-gradient-to-br from-purple-50 to-pink-50"
              on:drop={handleDrop}
              on:dragover={handleDragOver}
            >
              <svg class="mx-auto h-12 w-12 text-purple-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div class="text-sm text-gray-600">
                <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                  <span>Upload images</span>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    on:change={handleFileSelection}
                    class="sr-only"
                  />
                </label>
                <span class="pl-1">or drag and drop</span>
              </div>
              <p class="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB each</p>
            </div>
          </div>

          <!-- Selected Files -->
          {#if selectedFiles.length > 0}
            <div class="mb-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Selected Images ({selectedFiles.length})</h3>
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-60 overflow-y-auto">
                {#each selectedFiles as file}
                  <div class="relative group border border-gray-200 rounded-lg p-2">
                    <img src={file.previewUrl} alt={file.title} class="w-full h-24 object-cover rounded" />
                    <button
                      on:click={() => removeFile(file.id)}
                      class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <input
                      type="text"
                      bind:value={file.title}
                      class="w-full mt-1 text-xs border border-gray-300 rounded px-2 py-1"
                      placeholder="Image title"
                    />
                    <textarea
                      bind:value={file.description}
                      class="w-full mt-1 text-xs border border-gray-300 rounded px-2 py-1 resize-none"
                      rows="2"
                      placeholder="Description (optional)"
                    ></textarea>
                  </div>
                {/each}
              </div>
            </div>

            <!-- Shared Settings -->
            <div class="space-y-4">
              <h3 class="text-lg font-medium text-gray-900">Shared Settings</h3>
              
              <!-- Relationship Type -->
              <div>
                <label for="relationship-type" class="block text-sm font-medium text-gray-700 mb-1">
                  Relationship Type *
                </label>
                <select
                  id="relationship-type"
                  bind:value={sharedSettings.relationshipType}
                  class="w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  required
                >
                  <option value="">Select relationship type</option>
                  {#each Object.entries(relationshipTypes) as [type, description]}
                    <option value={type}>{type} - {description}</option>
                  {/each}
                </select>
              </div>

              <!-- Relationship Description -->
              <div>
                <label for="relationship-description" class="block text-sm font-medium text-gray-700 mb-1">
                  Relationship Description
                </label>
                <input
                  type="text"
                  id="relationship-description"
                  bind:value={sharedSettings.relationshipDescription}
                  class="w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Optional description for the relationships"
                />
              </div>

              <!-- Shared Tags -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Shared Tags
                </label>
                <div class="space-y-2">
                  <!-- Selected Tags -->
                  {#if sharedSettings.tags.length > 0}
                    <div class="flex flex-wrap gap-2">
                      {#each sharedSettings.tags as tag}
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
                      class="w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                    
                    <!-- Tag Suggestions -->
                    {#if showTagSuggestions}
                      <div class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-xl py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
                        {#each tagSuggestions as tag}
                          <button
                            type="button"
                            on:click={() => addTag(tag.attributes.name)}
                            class="w-full text-left px-4 py-2 hover:bg-purple-50 flex justify-between items-center"
                          >
                            <span>{tag.attributes.name}</span>
                            <span class="text-xs text-gray-500">({tag.attributes.usage_count || 0} images)</span>
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

              <!-- Source URL -->
              <div>
                <label for="source-url" class="block text-sm font-medium text-gray-700 mb-1">
                  Source URL (applied to all images)
                </label>
                <input
                  type="url"
                  id="source-url"
                  bind:value={sharedSettings.metadata.source_url}
                  class="w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="https://example.com/source"
                />
              </div>
            </div>
          {/if}

          <!-- Error Display -->
          {#if error}
            <div class="mt-4 rounded-md bg-red-50 p-4">
              <div class="text-sm text-red-700">
                {error}
              </div>
            </div>
          {/if}

        {:else if isUploading}
          <!-- Upload Progress -->
          <div class="text-center py-8">
            <div class="mb-6">
              <svg class="animate-spin mx-auto h-12 w-12 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            
            <h3 class="text-lg font-medium text-gray-900 mb-2">Uploading Images...</h3>
            <p class="text-sm text-gray-600 mb-4">Please wait while we upload your images and create relationships</p>
            
            <!-- Overall Progress -->
            <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div class="bg-purple-600 h-2 rounded-full transition-all duration-300" style="width: {totalProgress}%"></div>
            </div>
            <p class="text-sm text-gray-600">{Math.round(totalProgress)}% complete</p>

            <!-- Individual File Status -->
            <div class="mt-6 space-y-2 max-h-40 overflow-y-auto">
              {#each selectedFiles as file}
                <div class="flex items-center justify-between text-sm">
                  <span class="truncate flex-1 text-left">{file.title}</span>
                  <span class="ml-2 flex items-center">
                    {#if file.status === 'completed'}
                      <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    {:else if file.status === 'failed'}
                      <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    {:else if file.status === 'uploading'}
                      <svg class="animate-spin w-4 h-4 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    {:else}
                      <div class="w-4 h-4 bg-gray-300 rounded-full"></div>
                    {/if}
                    <span class="ml-2 capitalize">{file.status}</span>
                  </span>
                </div>
              {/each}
            </div>
          </div>

        {:else if uploadComplete}
          <!-- Success Message -->
          <div class="text-center py-8">
            <div class="mb-6">
              <svg class="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Upload Complete!</h3>
            <p class="text-sm text-gray-600">
              Successfully uploaded {selectedFiles.filter(f => f.status === 'completed').length} images and created relationships.
            </p>
          </div>
        {/if}
      </div>

      <!-- Footer -->
      {#if !isUploading && !uploadComplete}
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
          <button
            type="button"
            on:click={closeModal}
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Cancel
          </button>
          <button
            type="button"
            on:click={handleBatchUpload}
            disabled={selectedFiles.length === 0 || !sharedSettings.relationshipType}
            class="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 border border-transparent rounded-xl shadow-sm hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200"
          >
            Upload & Link Images ({selectedFiles.length})
          </button>
        </div>
      {/if}
    </div>
  </div>
{/if}