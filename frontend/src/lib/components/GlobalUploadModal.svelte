<script lang="ts">
  import { onDestroy } from 'svelte';
  import { imageStore } from '$lib/stores/images';
  import { imageApi } from '$lib/api/images';
  import { aliasApi } from '$lib/api/aliases';
  import type { JsonApiResource, Image, Alias } from '$lib/types';
  
  // Import UI components
  import {
    Modal,
    Button,
    Input,
    Select,
    FileUpload,
    ProgressBar,
    ErrorMessage,
    Avatar,
    Card,
    Toggle
  } from '$lib/ui';
  
  import { Combobox } from 'bits-ui';

  // Props
  let { isOpen = false, onClose }: { isOpen?: boolean; onClose: () => void } = $props();

  // Types
  interface SelectedFile {
    id: string;
    file: File;
    previewUrl: string;
    title: string;
    status: 'pending' | 'uploading' | 'completed' | 'failed';
    progress: number;
    error?: string;
  }

  // State
  let selectedFiles = $state<SelectedFile[]>([]);
  let selectedAlias = $state<JsonApiResource<Alias> | null>(null);
  let aliasSearchQuery = $state('');
  let selectedAliasValue = $state('');
  let aliasSuggestions = $state<JsonApiResource<Alias>[]>([]);
  let allAliases = $state<JsonApiResource<Alias>[]>([]);
  let showAliasSuggestions = $state(false);
  
  // Optional relationship linking
  let enableRelationships = $state(false);
  let relationshipType = $state('series');
  let relationshipTypes = $state<Record<string, string>>({});
  
  // Upload state
  let isUploading = $state(false);
  let uploadComplete = $state(false);
  let totalProgress = $state(0);
  let error = $state('');

  // Load initial data when modal opens
  $effect(() => {
    if (isOpen) {
      loadInitialData();
    }
  });

  async function loadInitialData() {
    try {
      // Load all aliases for search
      allAliases = await aliasApi.getAll();
      console.log('Loaded aliases:', allAliases.length);
      
      // Load relationship types for optional linking
      relationshipTypes = await imageApi.getRelationshipTypes();
      console.log('Loaded relationship types:', relationshipTypes);
    } catch (err: any) {
      console.error('Failed to load initial data:', err);
      error = 'Failed to load data. Please refresh and try again.';
    }
  }

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
      title: file.name.replace(/\.[^/.]+$/, ""), // Auto-generate title from filename
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

  // Alias search and selection
  function handleAliasSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    aliasSearchQuery = target.value;
    
    if (aliasSearchQuery.length > 0) {
      aliasSuggestions = allAliases.filter(alias => 
        alias.attributes.name.toLowerCase().includes(aliasSearchQuery.toLowerCase())
      );
      showAliasSuggestions = aliasSuggestions.length > 0;
    } else {
      showAliasSuggestions = false;
      aliasSuggestions = [];
    }
  }
  
  // Computed values for Combobox
  const comboboxItems = $derived(
    allAliases.map(alias => ({
      value: alias.attributes.name,
      label: alias.attributes.name,
      disabled: false
    }))
  );
  
  const filteredAliases = $derived(
    aliasSearchQuery.length > 0 
      ? allAliases.filter(alias => 
          alias.attributes.name.toLowerCase().includes(aliasSearchQuery.toLowerCase())
        )
      : allAliases
  );
  
  function handleAliasInput(event: Event) {
    const target = event.target as HTMLInputElement;
    aliasSearchQuery = target.value;
  }
  
  function handleAliasSelection(value: string) {
    selectedAliasValue = value;
    const alias = allAliases.find(a => a.attributes.name === value);
    if (alias) {
      selectAlias(alias);
    }
  }

  function selectAlias(alias: JsonApiResource<Alias>) {
    selectedAlias = alias;
    aliasSearchQuery = alias.attributes.name;
    showAliasSuggestions = false;
    aliasSuggestions = [];
  }

  function clearAliasSelection() {
    selectedAlias = null;
    selectedAliasValue = '';
    aliasSearchQuery = '';
    showAliasSuggestions = false;
  }


  // Upload process
  async function handleGlobalUpload() {
    if (selectedFiles.length === 0 || !selectedAlias) {
      error = 'Please select files and an alias';
      return;
    }

    console.log('Starting global upload to alias:', selectedAlias.id);

    isUploading = true;
    error = '';
    const uploadedImages: JsonApiResource<Image>[] = [];

    try {
      // Upload all images
      for (let i = 0; i < selectedFiles.length; i++) {
        const selectedFile = selectedFiles[i];
        selectedFile.status = 'uploading';

        try {
          // Prepare simplified image data (no tags, descriptions, or metadata)
          const imageData = {
            image: {
              title: selectedFile.title.trim(),
              description: '', // Empty description
              file: selectedFile.file
            }
          };

          // Upload image
          const uploadResult = await imageStore.uploadImage(selectedAlias.id, imageData);
          
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
        totalProgress = ((i + 1) / selectedFiles.length) * (enableRelationships ? 70 : 100);
      }

      // Create relationships between uploaded images if enabled and we have multiple successful uploads
      if (enableRelationships && uploadedImages.length > 1) {
        let relationshipCount = 0;
        const totalRelationships = uploadedImages.length * (uploadedImages.length - 1) / 2; // n*(n-1)/2 for all pairs
        
        // Create relationships between all pairs of uploaded images
        for (let i = 0; i < uploadedImages.length; i++) {
          for (let j = i + 1; j < uploadedImages.length; j++) {
            try {
              await imageApi.addRelationship(
                selectedAlias.id,
                uploadedImages[i].id,
                uploadedImages[j].id,
                relationshipType,
                'Uploaded together via global upload'
              );
              relationshipCount++;
              
              // Update progress
              totalProgress = 70 + (relationshipCount / totalRelationships) * 30;
            } catch (err: any) {
              console.error(`Failed to create relationship between images ${uploadedImages[i].id} and ${uploadedImages[j].id}:`, err);
            }
          }
        }
      }

      totalProgress = 100;
      uploadComplete = true;
      
      // Close modal after a brief delay
      setTimeout(() => {
        closeModal();
      }, 2000);

    } catch (err: any) {
      error = err.message || 'Upload failed';
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
    selectedAlias = null;
    selectedAliasValue = '';
    aliasSearchQuery = '';
    showAliasSuggestions = false;
    aliasSuggestions = [];
    enableRelationships = false;
    relationshipType = 'series';
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

  // Close suggestions when clicking outside
  function handleClickOutside(event: MouseEvent) {
    if (!event.target?.closest('.alias-search-container')) {
      showAliasSuggestions = false;
    }
  }

  const canUpload = $derived(() => selectedFiles.length > 0 && selectedAlias && !isUploading);
</script>

<svelte:window onkeydown={handleKeydown} onclick={handleClickOutside} />

<Modal
  {isOpen}
  onClose={closeModal}
  title="Upload Images"
  size="xl"
  closable={!isUploading}
  class="max-h-[90vh]"
>
  {#snippet content()}
    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto">
      <div class="p-6">
      <!-- Description -->
      <p class="text-sm text-gray-600 mb-6">
        Upload multiple images to an artist with optional relationship linking.
      </p>
      
      {#if !isUploading && !uploadComplete}
        <!-- Alias Selection -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Select Artist *
          </label>
          
          {#if selectedAlias}
            <!-- Selected Alias Preview -->
            <div class="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 mb-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {selectedAlias.attributes.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">{selectedAlias.attributes.name}</h3>
                    <p class="text-sm text-gray-600">
                      {selectedAlias.attributes.images_count || 0} images
                      {#if selectedAlias.attributes.bio}
                        • {selectedAlias.attributes.bio}
                      {/if}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onclick={clearAliasSelection}
                  class="text-gray-400 hover:text-gray-600 p-1"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
            </div>
          {:else}
            <!-- Alias Search using Combobox component -->
            <div class="alias-search-container relative">
              <Combobox.Root 
                type="single"
                bind:value={selectedAliasValue}
                onValueChange={handleAliasSelection}
                items={comboboxItems}
                class="w-full"
              >
                <Combobox.Input 
                  placeholder="Search for an artist..."
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  oninput={handleAliasInput}
                />
                
                <Combobox.Portal>
                  <Combobox.Content 
                    class="z-50 max-h-60 w-full bg-white shadow-lg rounded-xl py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none"
                    sideOffset={5}
                  >
                    {#each filteredAliases as alias}
                      <Combobox.Item 
                        value={alias.attributes.name}
                        label={alias.attributes.name}
                        class="relative cursor-pointer select-none py-3 px-4 hover:bg-purple-50 data-[highlighted]:bg-purple-50"
                      >
                        {#snippet children({ selected })}
                          <div class="flex items-center space-x-3">
                            <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {alias.attributes.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div class="font-medium text-gray-900">{alias.attributes.name}</div>
                              <div class="text-sm text-gray-500">{alias.attributes.images_count || 0} images</div>
                            </div>
                          </div>
                        {/snippet}
                      </Combobox.Item>
                    {:else}
                      <span class="block px-4 py-3 text-sm text-gray-500">
                        No artists found.
                      </span>
                    {/each}
                  </Combobox.Content>
                </Combobox.Portal>
              </Combobox.Root>
            </div>
          {/if}
        </div>

        <!-- File Selection (only show if alias is selected) -->
        {#if selectedAlias}
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Select Images *
            </label>
            <div
              class="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors bg-gradient-to-br from-purple-50 to-pink-50"
              ondrop={handleDrop}
              ondragover={handleDragOver}
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
                    onchange={handleFileSelection}
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onclick={() => removeFile(file.id)}
                      class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-0"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Button>
                    <p class="text-xs text-gray-600 mt-1 truncate">{file.title}</p>
                  </div>
                {/each}
              </div>
            </div>
          {/if}

          <!-- Optional Relationship Linking -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-lg font-medium text-gray-900">Link Images Together</h3>
                <p class="text-sm text-gray-600">Create relationships between all uploaded images</p>
                <div class="text-xs text-gray-400 mt-1">
                  Debug: enableRelationships = {enableRelationships}
                </div>
              </div>
              <!-- Temporarily use a basic checkbox to test -->
              <input
                type="checkbox"
                bind:checked={enableRelationships}
                class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
            </div>
            
            {#if enableRelationships}
              <div class="bg-gray-50 rounded-xl p-4">
                <div>
                  <label for="relationship-type" class="block text-sm font-medium text-gray-700 mb-1">
                    Relationship Type
                  </label>
                  {#if Object.keys(relationshipTypes).length > 0}
                    <select
                      bind:value={relationshipType}
                      class="w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">Select relationship type</option>
                      {#each Object.entries(relationshipTypes) as [type, description]}
                        <option value={type}>{type} - {description}</option>
                      {/each}
                    </select>
                  {:else}
                    <div class="w-full px-3 py-2 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 text-sm">
                      Loading relationship types...
                    </div>
                  {/if}
                  
                  <!-- Debug info -->
                  <div class="text-xs text-gray-400 mt-1">
                    Available types: {Object.keys(relationshipTypes).length}, Current: {relationshipType}
                  </div>
                </div>
                <p class="text-xs text-gray-500 mt-2">
                  All uploaded images will be linked to each other with this relationship type.
                </p>
              </div>
            {/if}
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
          <p class="text-sm text-gray-600 mb-4">
            Uploading to {selectedAlias?.attributes.name}
            {#if enableRelationships && selectedFiles.length > 1}
              and linking images together
            {/if}
          </p>
          
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
            Successfully uploaded {selectedFiles.filter(f => f.status === 'completed').length} images to {selectedAlias?.attributes.name}
            {#if enableRelationships && selectedFiles.filter(f => f.status === 'completed').length > 1}
              and linked them together as a {relationshipType}
            {/if}
          </p>
        </div>
      {/if}
      </div>
    </div>

    <!-- Footer - SEPARATE from content -->
    {#if !isUploading && !uploadComplete}
      <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
        <Button
          variant="secondary"
          onclick={closeModal}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onclick={handleGlobalUpload}
          disabled={!canUpload}
          class="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          Upload Images ({selectedFiles.length})
        </Button>
      </div>
    {/if}
  {/snippet}
</Modal>