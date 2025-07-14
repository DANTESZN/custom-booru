<script lang="ts">
  import { AutoTaggerService, type AutoTagResult } from '$lib/services/autoTagger';
  import type { JsonApiResource, Image } from '$lib/types';

  interface Props {
    images: JsonApiResource<Image>[];
    onBatchTagsGenerated: (results: Array<{
      image: JsonApiResource<Image>;
      tags: Array<{name: string, confidence: number, selected: boolean}>;
    }>) => void;
    disabled?: boolean;
  }

  let { images, onBatchTagsGenerated, disabled = false }: Props = $props();

  let isProcessing = $state(false);
  let progress = $state({ completed: 0, total: 0 });
  let error = $state('');
  let showResults = $state(false);
  let batchResults = $state<Array<{
    image: JsonApiResource<Image>;
    result: AutoTagResult | null;
    error?: string;
    tags: Array<{name: string, confidence: number, selected: boolean}>;
  }>>([]);

  async function handleBatchAutoTag() {
    if (!images.length || isProcessing) return;

    isProcessing = true;
    error = '';
    progress = { completed: 0, total: images.length };
    batchResults = [];

    try {
      const results = await AutoTaggerService.autoTagImages(
        images,
        {}, // Use default config
        (completed, total) => {
          progress = { completed, total };
        }
      );

      // Process results and prepare for display
      batchResults = results.map(({ image, result, error: resultError }) => {
        if (result) {
          // Combine general and character tags, sort by confidence
          const allTags = [
            ...result.generalTags.map(tag => ({ ...tag, type: 'general' as const })),
            ...result.characterTags.map(tag => ({ ...tag, type: 'character' as const }))
          ].sort((a, b) => b.confidence - a.confidence);

          // Initialize selection state (auto-select high confidence tags)
          const tags = allTags.map(tag => ({
            name: tag.name,
            confidence: tag.confidence,
            selected: tag.confidence >= 0.7 // Auto-select high confidence tags
          }));

          return { image, result, tags };
        } else {
          return { 
            image, 
            result: null, 
            error: resultError, 
            tags: [] 
          };
        }
      });

      showResults = true;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Batch auto-tagging failed';
      console.error('Batch auto-tagging error:', err);
    } finally {
      isProcessing = false;
    }
  }

  function toggleTag(imageIndex: number, tagIndex: number) {
    batchResults[imageIndex].tags[tagIndex].selected = !batchResults[imageIndex].tags[tagIndex].selected;
  }

  function selectAllForImage(imageIndex: number) {
    batchResults[imageIndex].tags = batchResults[imageIndex].tags.map(tag => ({ ...tag, selected: true }));
  }

  function selectNoneForImage(imageIndex: number) {
    batchResults[imageIndex].tags = batchResults[imageIndex].tags.map(tag => ({ ...tag, selected: false }));
  }

  function selectHighConfidenceForImage(imageIndex: number) {
    batchResults[imageIndex].tags = batchResults[imageIndex].tags.map(tag => ({ 
      ...tag, 
      selected: tag.confidence >= 0.7 
    }));
  }

  function selectAllImages() {
    batchResults.forEach((_, index) => selectAllForImage(index));
  }

  function selectNoneImages() {
    batchResults.forEach((_, index) => selectNoneForImage(index));
  }

  function selectHighConfidenceAll() {
    batchResults.forEach((_, index) => selectHighConfidenceForImage(index));
  }

  function applyBatchTags() {
    const resultsToApply = batchResults
      .filter(result => result.tags.some(tag => tag.selected))
      .map(result => ({
        image: result.image,
        tags: result.tags.filter(tag => tag.selected)
      }));

    onBatchTagsGenerated(resultsToApply);
    showResults = false;
  }

  function getConfidenceColor(confidence: number): string {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  }

  function getConfidenceBackground(confidence: number): string {
    if (confidence >= 0.8) return 'bg-green-50 border-green-200';
    if (confidence >= 0.6) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  }

  function getSuccessfulResults() {
    return batchResults.filter(result => result.result && result.tags.length > 0);
  }

  function getFailedResults() {
    return batchResults.filter(result => result.error);
  }
</script>

<div class="relative">
  <!-- Batch Auto-Tag Button -->
  <button
    type="button"
    onclick={handleBatchAutoTag}
    disabled={disabled || isProcessing || !images.length}
    class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 border border-purple-300 rounded-md hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
  >
    {#if isProcessing}
      <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Processing {progress.completed}/{progress.total}...
    {:else}
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
      Auto-Tag All Images ({images.length})
    {/if}
  </button>

  <!-- Progress Bar -->
  {#if isProcessing}
    <div class="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-300 rounded-md p-3 shadow-lg z-10">
      <div class="flex items-center justify-between text-sm text-gray-600 mb-2">
        <span>Processing images...</span>
        <span>{progress.completed}/{progress.total}</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div 
          class="bg-purple-600 h-2 rounded-full transition-all duration-300"
          style="width: {progress.total > 0 ? (progress.completed / progress.total) * 100 : 0}%"
        ></div>
      </div>
    </div>
  {/if}

  <!-- Error Message -->
  {#if error}
    <div class="absolute top-full left-0 mt-2 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700 z-10 min-w-64">
      <div class="flex items-start gap-2">
        <svg class="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <div>
          <p class="font-medium">Batch auto-tagging failed</p>
          <p class="mt-1">{error}</p>
          <button
            type="button"
            onclick={() => error = ''}
            class="mt-2 text-xs text-red-600 hover:text-red-800 underline"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Results Modal -->
  {#if showResults && batchResults.length > 0}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">Batch AI Tagging Results</h3>
            <button
              type="button"
              onclick={() => showResults = false}
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          
          <!-- Summary -->
          <div class="flex gap-4 mt-3 text-sm text-gray-600">
            <span>{getSuccessfulResults().length} successful</span>
            <span>{getFailedResults().length} failed</span>
            <span>{batchResults.reduce((sum, result) => sum + result.tags.filter(tag => tag.selected).length, 0)} tags selected</span>
          </div>
          
          <!-- Global Actions -->
          <div class="flex gap-2 mt-3">
            <button
              type="button"
              onclick={selectAllImages}
              class="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded hover:bg-blue-200"
            >
              Select All Tags
            </button>
            <button
              type="button"
              onclick={selectNoneImages}
              class="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            >
              Select None
            </button>
            <button
              type="button"
              onclick={selectHighConfidenceAll}
              class="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded hover:bg-green-200"
            >
              High Confidence Only
            </button>
          </div>
        </div>

        <!-- Results List -->
        <div class="flex-1 overflow-y-auto p-6">
          <div class="space-y-6">
            {#each batchResults as result, imageIndex}
              <div class="border border-gray-200 rounded-lg p-4">
                <!-- Image Header -->
                <div class="flex items-center gap-4 mb-4">
                  {#if result.image.attributes.file_url}
                    <img
                      src={result.image.attributes.file_url}
                      alt={result.image.attributes.title}
                      class="h-16 w-16 object-cover rounded-lg"
                    />
                  {:else}
                    <div class="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <svg class="h-6 w-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  {/if}
                  
                  <div class="flex-1">
                    <h4 class="font-medium text-gray-900">
                      {result.image.attributes.title || 'Untitled'}
                    </h4>
                    {#if result.error}
                      <p class="text-sm text-red-600">Error: {result.error}</p>
                    {:else if result.tags.length > 0}
                      <p class="text-sm text-gray-600">
                        {result.tags.length} tags found, {result.tags.filter(tag => tag.selected).length} selected
                      </p>
                    {:else}
                      <p class="text-sm text-gray-500">No tags generated</p>
                    {/if}
                  </div>
                  
                  {#if result.tags.length > 0}
                    <div class="flex gap-1">
                      <button
                        type="button"
                        onclick={() => selectAllForImage(imageIndex)}
                        class="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded hover:bg-blue-200"
                      >
                        All
                      </button>
                      <button
                        type="button"
                        onclick={() => selectNoneForImage(imageIndex)}
                        class="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                      >
                        None
                      </button>
                      <button
                        type="button"
                        onclick={() => selectHighConfidenceForImage(imageIndex)}
                        class="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded hover:bg-green-200"
                      >
                        High
                      </button>
                    </div>
                  {/if}
                </div>

                <!-- Tags -->
                {#if result.tags.length > 0}
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {#each result.tags as tag, tagIndex}
                      <label class="flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-colors text-sm {tag.selected ? 'bg-purple-50 border-purple-200' : getConfidenceBackground(tag.confidence)}">
                        <input
                          type="checkbox"
                          bind:checked={tag.selected}
                          onchange={() => toggleTag(imageIndex, tagIndex)}
                          class="h-3 w-3 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <span class="flex-1 truncate font-medium text-gray-900">
                          {tag.name}
                        </span>
                        <span class="text-xs font-mono {getConfidenceColor(tag.confidence)}">
                          {Math.round(tag.confidence * 100)}%
                        </span>
                      </label>
                    {/each}
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">
              {batchResults.reduce((sum, result) => sum + result.tags.filter(tag => tag.selected).length, 0)} total tags selected
            </span>
            <div class="flex gap-3">
              <button
                type="button"
                onclick={() => showResults = false}
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onclick={applyBatchTags}
                class="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded hover:bg-purple-700"
              >
                Apply Selected Tags
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>