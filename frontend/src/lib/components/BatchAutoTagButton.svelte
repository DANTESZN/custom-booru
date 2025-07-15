<script lang="ts">
  import { AutoTaggerService, type AutoTagResult } from '$lib/services/autoTagger';
  import type { JsonApiResource, Image } from '$lib/types';
  
  // Import UI components and design tokens
  import { Button, Modal, ProgressBar, ErrorMessage, Badge, Card } from '$lib/ui';
  import { tokens } from '$lib/design-system/tokens';

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

  function getConfidenceVariant(confidence: number): 'success' | 'warning' | 'danger' {
    if (confidence >= 0.8) return 'success';
    if (confidence >= 0.6) return 'warning';
    return 'danger';
  }

  function getConfidenceBackground(confidence: number): string {
    if (confidence >= 0.8) return 'bg-green-50 border-green-200';
    if (confidence >= 0.6) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  }

  // Derived values
  const successfulResults = $derived(() => batchResults.filter(result => result.result && result.tags.length > 0));
  const failedResults = $derived(() => batchResults.filter(result => result.error));
  const totalSelectedTags = $derived(() => batchResults.reduce((sum, result) => sum + result.tags.filter(tag => tag.selected).length, 0));
  const progressPercentage = $derived(() => progress.total > 0 ? (progress.completed / progress.total) * 100 : 0);
</script>

<div class="relative">
  <!-- Batch Auto-Tag Button -->
  <Button
    variant="secondary"
    onclick={handleBatchAutoTag}
    disabled={disabled || isProcessing || !images.length}
    loading={isProcessing}
    class="text-purple-700 bg-purple-100/80 border-purple-300 hover:bg-purple-200 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 backdrop-blur-sm"
  >
    {#if !isProcessing}
      <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    {/if}
    {isProcessing ? `Processing ${progress.completed}/${progress.total}...` : `Auto-Tag All Images (${images.length})`}
  </Button>

  <!-- Progress Bar -->
  {#if isProcessing}
    <Card class="absolute top-full left-0 mt-2 w-64 z-10 shadow-lg backdrop-blur-md bg-white/90 border border-white/20">
      <div class="flex items-center justify-between text-sm text-gray-600 mb-2">
        <span>Processing images...</span>
        <span class="font-medium">{progress.completed}/{progress.total}</span>
      </div>
      <ProgressBar
        value={progressPercentage}
        showLabel={false}
        class="h-2"
      />
    </Card>
  {/if}

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
<Modal
  isOpen={showResults}
  onClose={() => showResults = false}
  size="xl"
  class="max-h-[90vh]"
>
  {#snippet children()}
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-200/50 bg-gradient-to-r from-purple-50/50 to-pink-50/50 backdrop-blur-sm">
      <h3 class="text-lg font-medium text-gray-900">Batch AI Tagging Results</h3>
      
      <!-- Summary -->
      <div class="flex gap-4 mt-3 text-sm text-gray-600">
        <span class="flex items-center gap-1">
          <div class="w-2 h-2 bg-green-500 rounded-full"></div>
          {successfulResults.length} successful
        </span>
        <span class="flex items-center gap-1">
          <div class="w-2 h-2 bg-red-500 rounded-full"></div>
          {failedResults.length} failed
        </span>
        <span class="flex items-center gap-1">
          <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
          {totalSelectedTags} tags selected
        </span>
      </div>
      
      <!-- Global Actions -->
      <div class="flex gap-2 mt-3">
        <Button
          variant="secondary"
          size="xs"
          onclick={selectAllImages}
          class="text-blue-700 bg-blue-100/80 border-blue-200 hover:bg-blue-200 shadow-sm hover:shadow transition-all duration-200"
        >
          Select All Tags
        </Button>
        <Button
          variant="secondary"
          size="xs"
          onclick={selectNoneImages}
          class="shadow-sm hover:shadow transition-all duration-200"
        >
          Select None
        </Button>
        <Button
          variant="secondary"
          size="xs"
          onclick={selectHighConfidenceAll}
          class="text-green-700 bg-green-100/80 border-green-200 hover:bg-green-200 shadow-sm hover:shadow transition-all duration-200"
        >
          High Confidence Only
        </Button>
      </div>
    </div>

    <!-- Results List -->
    <div class="flex-1 overflow-y-auto p-6 max-h-[60vh]">
      <div class="space-y-6">
        {#each batchResults as result, imageIndex}
          <Card class="p-4">
            <!-- Image Header -->
            <div class="flex items-center gap-4 mb-4">
              {#if result.image.attributes.file_url}
                <img
                  src={result.image.attributes.file_url}
                  alt={result.image.attributes.title}
                  class="h-16 w-16 object-cover rounded-lg shadow-sm border border-gray-200/50"
                />
              {:else}
                <div class="h-16 w-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center shadow-sm border border-gray-200/50">
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
                  <Button
                    variant="secondary"
                    size="xs"
                    onclick={() => selectAllForImage(imageIndex)}
                    class="text-blue-700 bg-blue-100/80 border-blue-200 hover:bg-blue-200 shadow-sm hover:shadow transition-all duration-200"
                  >
                    All
                  </Button>
                  <Button
                    variant="secondary"
                    size="xs"
                    onclick={() => selectNoneForImage(imageIndex)}
                    class="shadow-sm hover:shadow transition-all duration-200"
                  >
                    None
                  </Button>
                  <Button
                    variant="secondary"
                    size="xs"
                    onclick={() => selectHighConfidenceForImage(imageIndex)}
                    class="text-green-700 bg-green-100/80 border-green-200 hover:bg-green-200 shadow-sm hover:shadow transition-all duration-200"
                  >
                    High
                  </Button>
                </div>
              {/if}
            </div>

            <!-- Tags -->
            {#if result.tags.length > 0}
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {#each result.tags as tag, tagIndex}
                  <label class="flex items-center gap-2 p-2 rounded-md border cursor-pointer backdrop-blur-sm transition-all duration-200 text-sm hover:shadow-sm transform hover:scale-[1.01] {tag.selected ? 'bg-purple-50/80 border-purple-200 shadow-sm' : getConfidenceBackground(tag.confidence)}">
                    <input
                      type="checkbox"
                      bind:checked={tag.selected}
                      onchange={() => toggleTag(imageIndex, tagIndex)}
                      class="h-3 w-3 text-purple-600 focus:ring-purple-500 focus:ring-offset-2 border-gray-300 rounded transition-colors duration-200"
                    />
                    <span class="flex-1 truncate font-medium text-gray-900">
                      {tag.name}
                    </span>
                    <Badge
                      variant={getConfidenceVariant(tag.confidence)}
                      size="sm"
                    >
                      {Math.round(tag.confidence * 100)}%
                    </Badge>
                  </label>
                {/each}
              </div>
            {/if}
          </Card>
        {/each}
      </div>
    </div>

    <!-- Footer -->
    <div class="px-6 py-4 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm flex items-center justify-between">
      <span class="text-sm text-gray-600 font-medium">
        {totalSelectedTags} total tags selected
      </span>
      <div class="flex gap-3">
        <Button
          variant="secondary"
          onclick={() => showResults = false}
          class="hover:bg-gray-100 transition-all duration-200 shadow-sm hover:shadow"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onclick={applyBatchTags}
          class="shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          Apply Selected Tags
        </Button>
      </div>
    </div>
  {/snippet}
</Modal>