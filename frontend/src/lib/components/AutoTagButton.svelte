<script lang="ts">
  import { AutoTaggerService, type AutoTagResult } from '$lib/services/autoTagger';
  import type { JsonApiResource, Image } from '$lib/types';

  interface Props {
    image: JsonApiResource<Image>;
    onTagsGenerated: (tags: Array<{name: string, confidence: number, selected: boolean}>) => void;
    disabled?: boolean;
  }

  let { image, onTagsGenerated, disabled = false }: Props = $props();

  let isLoading = $state(false);
  let error = $state('');
  let showResults = $state(false);
  let autoTagResult = $state<AutoTagResult | null>(null);
  let selectedTags = $state<Array<{name: string, confidence: number, selected: boolean}>>([]);

  async function handleAutoTag() {
    console.log('🔍 DEBUG: AutoTagButton - handleAutoTag called');
    console.log('🔍 DEBUG: AutoTagButton - image:', image);
    console.log('🔍 DEBUG: AutoTagButton - isLoading:', isLoading);
    
    if (!image || isLoading) {
      console.log('🔍 DEBUG: AutoTagButton - Early return - no image or already loading');
      return;
    }

    console.log('🔍 DEBUG: AutoTagButton - Starting auto-tag process');
    isLoading = true;
    error = '';
    showResults = false;

    try {
      console.log('🔍 DEBUG: AutoTagButton - Calling AutoTaggerService.autoTagImage');
      const result = await AutoTaggerService.autoTagImage(image);
      console.log('🔍 DEBUG: AutoTagButton - Got result from AutoTaggerService:', result);
      autoTagResult = result;
      
      // Combine general and character tags, sort by confidence
      const allTags = [
        ...result.generalTags.map(tag => ({ ...tag, type: 'general' as const })),
        ...result.characterTags.map(tag => ({ ...tag, type: 'character' as const }))
      ].sort((a, b) => b.confidence - a.confidence);

      // Initialize selection state (auto-select high confidence tags)
      selectedTags = allTags.map(tag => ({
        name: tag.name,
        confidence: tag.confidence,
        selected: tag.confidence >= 0.7 // Auto-select high confidence tags
      }));

      showResults = true;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to generate tags';
      console.error('Auto-tagging error:', err);
    } finally {
      isLoading = false;
    }
  }

  function toggleTag(index: number) {
    selectedTags[index].selected = !selectedTags[index].selected;
  }

  function selectAll() {
    selectedTags = selectedTags.map(tag => ({ ...tag, selected: true }));
  }

  function selectNone() {
    selectedTags = selectedTags.map(tag => ({ ...tag, selected: false }));
  }

  function selectHighConfidence() {
    selectedTags = selectedTags.map(tag => ({ 
      ...tag, 
      selected: tag.confidence >= 0.7 
    }));
  }

  function applySelectedTags() {
    const tagsToAdd = selectedTags.filter(tag => tag.selected);
    onTagsGenerated(tagsToAdd);
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
</script>

<div class="relative">
  <!-- Auto-Tag Button -->
  <button
    type="button"
    onclick={handleAutoTag}
    disabled={disabled || isLoading || !image?.attributes.file_url}
    class="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-700 bg-purple-100 border border-purple-300 rounded-md hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
  >
    {#if isLoading}
      <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Generating...
    {:else}
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
      Auto-Tag with AI
    {/if}
  </button>

  <!-- Error Message -->
  {#if error}
    <div class="absolute top-full left-0 mt-2 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700 z-10 min-w-64">
      <div class="flex items-start gap-2">
        <svg class="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <div>
          <p class="font-medium">Auto-tagging failed</p>
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
  {#if showResults && selectedTags.length > 0}
    <div class="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-20 min-w-96 max-w-2xl">
      <!-- Header -->
      <div class="px-4 py-3 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">AI Generated Tags</h3>
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
        
        <!-- Quick Actions -->
        <div class="flex gap-2 mt-3">
          <button
            type="button"
            onclick={selectAll}
            class="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded hover:bg-blue-200"
          >
            Select All
          </button>
          <button
            type="button"
            onclick={selectNone}
            class="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
          >
            Select None
          </button>
          <button
            type="button"
            onclick={selectHighConfidence}
            class="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded hover:bg-green-200"
          >
            High Confidence Only
          </button>
        </div>
      </div>

      <!-- Tags List -->
      <div class="max-h-64 overflow-y-auto p-4">
        <div class="space-y-2">
          {#each selectedTags as tag, index}
            <label class="flex items-center gap-3 p-2 rounded-md border cursor-pointer transition-colors {tag.selected ? 'bg-purple-50 border-purple-200' : getConfidenceBackground(tag.confidence)}">
              <input
                type="checkbox"
                bind:checked={tag.selected}
                onchange={() => toggleTag(index)}
                class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-900 truncate">
                    {tag.name}
                  </span>
                  <span class="text-xs font-mono {getConfidenceColor(tag.confidence)}">
                    {Math.round(tag.confidence * 100)}%
                  </span>
                </div>
              </div>
            </label>
          {/each}
        </div>
      </div>

      <!-- Footer -->
      <div class="px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-600">
            {selectedTags.filter(tag => tag.selected).length} of {selectedTags.length} tags selected
          </span>
          <div class="flex gap-2">
            <button
              type="button"
              onclick={() => showResults = false}
              class="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onclick={applySelectedTags}
              class="px-3 py-1.5 text-sm font-medium text-white bg-purple-600 rounded hover:bg-purple-700"
            >
              Add Selected Tags
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<!-- Backdrop for modal -->
{#if showResults}
  <div 
    class="fixed inset-0 bg-black bg-opacity-25 z-10"
    onclick={() => showResults = false}
  ></div>
{/if}