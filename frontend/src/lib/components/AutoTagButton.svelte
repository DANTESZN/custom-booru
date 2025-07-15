<script lang="ts">
  import { AutoTaggerService, type AutoTagResult } from '$lib/services/autoTagger';
  import type { JsonApiResource, Image } from '$lib/types';
  
  // Import UI components and design tokens
  import { Button, ModalButton, ErrorMessage, Badge } from '$lib/ui';
  import { Dialog, Button as BitsButton } from 'bits-ui';
  import { tokens } from '$lib/design-system/tokens';

  interface Props {
    image: JsonApiResource<Image>;
    onTagsGenerated: (tags: Array<{name: string, confidence: number, selected: boolean}>) => void;
    disabled?: boolean;
  }

  let { image, onTagsGenerated, disabled = false }: Props = $props();

  // State management with Svelte 5 runes
  let isLoading = $state(false);
  let error = $state('');
  let showResults = $state(false);
  let autoTagResult = $state<AutoTagResult | null>(null);
  let selectedTags = $state<Array<{name: string, confidence: number, selected: boolean}>>([]);
  let processingStep = $state<'idle' | 'analyzing' | 'generating' | 'complete'>('idle');
  
  // Derived state for better UX
  const hasResults = $derived(selectedTags.length > 0);
  const hasHighConfidenceTags = $derived(selectedTags.some(tag => tag.confidence >= 0.7));
  const buttonText = $derived(
    isLoading 
      ? (processingStep === 'analyzing' ? 'Analyzing Image...' 
         : processingStep === 'generating' ? 'Generating Tags...' 
         : 'Processing...')
      : 'Auto-Tag with AI'
  );

  async function handleAutoTag() {
    if (!image || isLoading) {
      return;
    }

    // Reset state
    isLoading = true;
    error = '';
    showResults = false;
    processingStep = 'analyzing';
    selectedTags = [];
    autoTagResult = null;

    try {
      // Step 1: Analyzing image
      processingStep = 'analyzing';
      await new Promise(resolve => setTimeout(resolve, 300)); // Brief pause for UX
      
      // Step 2: Generate tags
      processingStep = 'generating';
      const result = await AutoTaggerService.autoTagImage(image);
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

      processingStep = 'complete';
      showResults = true;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to generate tags';
      console.error('Auto-tagging error:', err);
      processingStep = 'idle';
    } finally {
      isLoading = false;
    }
  }

  // Tag management functions with improved state handling
  function toggleTag(index: number) {
    if (index >= 0 && index < selectedTags.length) {
      selectedTags[index] = {
        ...selectedTags[index],
        selected: !selectedTags[index].selected
      };
    }
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

  function selectByConfidenceRange(min: number, max: number = 1.0) {
    selectedTags = selectedTags.map(tag => ({
      ...tag,
      selected: tag.confidence >= min && tag.confidence <= max
    }));
  }

  function applySelectedTags() {
    const tagsToAdd = selectedTags.filter(tag => tag.selected);
    if (tagsToAdd.length > 0) {
      onTagsGenerated(tagsToAdd);
      showResults = false;
      // Reset for next use
      selectedTags = [];
      autoTagResult = null;
      processingStep = 'idle';
    }
  }

  function handleModalClose() {
    showResults = false;
    // Reset state when closing without applying
    if (processingStep === 'complete') {
      selectedTags = [];
      autoTagResult = null;
      processingStep = 'idle';
    }
  }

  function getTagLabelClass(tag: {selected: boolean, confidence: number}): string {
    const baseClass = 'group flex items-center gap-3 p-3 rounded-lg border cursor-pointer backdrop-blur-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1';
    if (tag.selected) {
      return `${baseClass} bg-purple-50/90 border-purple-300 shadow-md ring-2 ring-purple-200`;
    }
    // Confidence-based styling
    if (tag.confidence >= 0.8) {
      return `${baseClass} bg-green-50/80 border-green-200 shadow-sm`;
    } else if (tag.confidence >= 0.6) {
      return `${baseClass} bg-yellow-50/80 border-yellow-200 shadow-sm`;
    }
    return `${baseClass} bg-red-50/80 border-red-200 shadow-sm`;
  }

  const selectedCount = $derived(selectedTags.filter(tag => tag.selected).length);

  // Handle modal close from Bits UI
  $effect(() => {
    if (!showResults && processingStep === 'complete') {
      // Reset state when modal is closed
      selectedTags = [];
      autoTagResult = null;
      processingStep = 'idle';
    }
  });
</script>

<div class="relative">
  <!-- Auto-Tag Button -->
  <button
    type="button"
    onclick={handleAutoTag}
    disabled={disabled || isLoading || !image?.attributes.file_url}
    class="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-lg border text-purple-700 bg-purple-100 border-purple-300 hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 backdrop-blur-sm bg-purple-100/80"
  >
    {#if isLoading}
      <svg class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    {:else}
      <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    {/if}
    {buttonText}
  </button>

  <!-- Error Message -->
  {#if error}
    <div class="absolute top-full left-0 mt-2 z-10 min-w-64">
      <ErrorMessage 
        message={error} 
        dismissible={true}
        onDismiss={() => error = ''}
      />
    </div>
  {/if}
</div>

<!-- Results Modal -->
<Dialog.Root bind:open={showResults}>
  <Dialog.Portal>
    <Dialog.Overlay 
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" 
    />
    <Dialog.Content 
      class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-4xl max-h-[90vh] bg-white/95 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
      onInteractOutside={handleModalClose}
      onEscapeKeydown={handleModalClose}
    >
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200/50 bg-gradient-to-r from-purple-50/50 to-pink-50/50 backdrop-blur-sm flex items-center justify-between">
        <Dialog.Title class="text-lg font-medium text-gray-900">AI Generated Tags</Dialog.Title>
        <Dialog.Close class="text-gray-400 hover:text-gray-600 transition-colors rounded-md p-1 hover:bg-gray-100">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span class="sr-only">Close</span>
        </Dialog.Close>
      </div>
      
      <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto">
      <div class="p-6">
        {#if hasResults}
          <!-- Summary Stats -->
          <div class="mb-6 p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-white/20">
            <div class="flex items-center justify-between text-sm">
              <div class="flex gap-2">
                <BitsButton.Root 
                  disabled
                  class="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-green-100 text-green-800 border border-green-200 cursor-default"
                >
                  High
                  <span class="bg-green-200 text-green-900 px-1.5 py-0.5 rounded-full text-xs font-bold">
                    {selectedTags.filter(t => t.confidence >= 0.8).length}
                  </span>
                </BitsButton.Root>
                <BitsButton.Root 
                  disabled
                  class="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-yellow-100 text-yellow-800 border border-yellow-200 cursor-default"
                >
                  Medium
                  <span class="bg-yellow-200 text-yellow-900 px-1.5 py-0.5 rounded-full text-xs font-bold">
                    {selectedTags.filter(t => t.confidence >= 0.6 && t.confidence < 0.8).length}
                  </span>
                </BitsButton.Root>
                <BitsButton.Root 
                  disabled
                  class="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-100 text-red-800 border border-red-200 cursor-default"
                >
                  Low
                  <span class="bg-red-200 text-red-900 px-1.5 py-0.5 rounded-full text-xs font-bold">
                    {selectedTags.filter(t => t.confidence < 0.6).length}
                  </span>
                </BitsButton.Root>
              </div>
              <BitsButton.Root 
                disabled
                class="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-lg bg-purple-100 text-purple-800 border border-purple-200 cursor-default"
              >
                Selected
                <span class="bg-purple-200 text-purple-900 px-2 py-0.5 rounded-full text-xs font-bold">
                  {selectedCount} / {selectedTags.length}
                </span>
              </BitsButton.Root>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="flex flex-wrap gap-2 mb-6">
            <ModalButton
              variant="blue"
              size="sm"
              onclick={selectAll}
            >
              Select All
            </ModalButton>
            <ModalButton
              variant="secondary"
              size="sm"
              onclick={selectNone}
            >
              Select None
            </ModalButton>
            <ModalButton
              variant="green"
              size="sm"
              onclick={selectHighConfidence}
              disabled={!hasHighConfidenceTags}
            >
              High Confidence Only
            </ModalButton>
            <ModalButton
              variant="yellow"
              size="sm"
              onclick={() => selectByConfidenceRange(0.6, 0.8)}
            >
              Medium Only
            </ModalButton>
          </div>
        {/if}

        <!-- Tags List -->
        {#if hasResults}
          <div class="space-y-2 max-h-96 overflow-y-auto">
            {#each selectedTags as tag, index (tag.name)}
              <label class={getTagLabelClass(tag)}>
                <input
                  type="checkbox"
                  checked={tag.selected}
                  onchange={() => toggleTag(index)}
                  class="h-4 w-4 text-purple-600 focus:ring-purple-500 focus:ring-offset-2 border-gray-300 rounded transition-colors duration-200"
                />
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-medium text-gray-900 truncate group-hover:text-purple-700 transition-colors duration-200">
                        {tag.name}
                      </span>
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          class="h-full rounded-full transition-all duration-300 {tag.confidence >= 0.8 ? 'bg-green-500' : tag.confidence >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'}"
                          style="width: {tag.confidence * 100}%"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </label>
            {/each}
          </div>
        {:else}
          <div class="text-center py-8 text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p>No tags generated yet</p>
          </div>
        {/if}
      </div>
    </div>

    <!-- Footer -->
    <div class="px-6 py-4 border-t border-gray-200/50 bg-gradient-to-r from-purple-50/30 to-pink-50/30 backdrop-blur-sm flex items-center justify-between">
      <div class="flex flex-col gap-1">
        <span class="text-sm text-gray-600 font-medium">
          {selectedCount} of {selectedTags.length} tags selected
        </span>
        {#if selectedCount > 0}
          <span class="text-xs text-purple-600">
            {selectedTags.filter(t => t.selected && t.confidence >= 0.8).length} high confidence,
            {selectedTags.filter(t => t.selected && t.confidence >= 0.6 && t.confidence < 0.8).length} medium,
            {selectedTags.filter(t => t.selected && t.confidence < 0.6).length} low
          </span>
        {/if}
      </div>
      <div class="flex gap-3">
        <ModalButton
          variant="secondary"
          size="md"
          onclick={handleModalClose}
        >
          Cancel
        </ModalButton>
        <ModalButton
          variant="primary"
          size="md"
          onclick={applySelectedTags}
          disabled={selectedCount === 0}
        >
          Add {selectedCount > 0 ? selectedCount : ''} Selected Tag{selectedCount !== 1 ? 's' : ''}
        </ModalButton>
      </div>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>