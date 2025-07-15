<script lang="ts">
  import { cn, transitions } from './utils';
  import LoadingSpinner from './LoadingSpinner.svelte';
  import Badge from './Badge.svelte';

  let {
    src = '',
    alt = '',
    title = '',
    width = undefined,
    height = undefined,
    aspectRatio = 'auto',
    objectFit = 'cover',
    loading = 'lazy',
    placeholder = true,
    overlay = false,
    overlayContent = undefined,
    badge = '',
    badgeVariant = 'primary',
    clickable = false,
    class: className = '',
    onclick,
    onLoad,
    onError,
    ...restProps
  }: {
    src: string;
    alt?: string;
    title?: string;
    width?: number | string;
    height?: number | string;
    aspectRatio?: 'auto' | 'square' | '4/3' | '16/9' | '3/2' | '2/3';
    objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
    loading?: 'lazy' | 'eager';
    placeholder?: boolean;
    overlay?: boolean;
    overlayContent?: any;
    badge?: string;
    badgeVariant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    clickable?: boolean;
    class?: string;
    onclick?: (event: MouseEvent) => void;
    onLoad?: (event: Event) => void;
    onError?: (event: Event) => void;
  } = $props();

  let isLoading = $state(true);
  let hasError = $state(false);
  let imageElement = $state<HTMLImageElement>();

  const containerClasses = $derived(() => {
    const baseClasses = 'relative overflow-hidden rounded-lg bg-gray-100';
    
    const aspectClasses = {
      auto: '',
      square: 'aspect-square',
      '4/3': 'aspect-[4/3]',
      '16/9': 'aspect-video',
      '3/2': 'aspect-[3/2]',
      '2/3': 'aspect-[2/3]'
    }[aspectRatio];

    const clickableClasses = clickable || onclick ? 
      'cursor-pointer hover:opacity-90 active:scale-[0.98]' : '';

    return cn(
      baseClasses,
      aspectClasses,
      clickableClasses,
      transitions.all,
      className
    );
  });

  const imageClasses = $derived(() => {
    const baseClasses = 'w-full h-full transition-opacity duration-300';
    const objectFitClasses = {
      contain: 'object-contain',
      cover: 'object-cover',
      fill: 'object-fill',
      none: 'object-none',
      'scale-down': 'object-scale-down'
    }[objectFit];

    const visibilityClasses = isLoading ? 'opacity-0' : 'opacity-100';

    return cn(baseClasses, objectFitClasses, visibilityClasses);
  });

  const overlayClasses = $derived(() => {
    const baseClasses = 'absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100';
    return cn(baseClasses, transitions.opacity);
  });

  function handleImageLoad(event: Event) {
    isLoading = false;
    hasError = false;
    onLoad?.(event);
  }

  function handleImageError(event: Event) {
    isLoading = false;
    hasError = true;
    onError?.(event);
  }

  function handleClick(event: MouseEvent) {
    if (clickable || onclick) {
      onclick?.(event);
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if ((clickable || onclick) && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      handleClick(event as any);
    }
  }
</script>

<div
  class={containerClasses}
  style:width={width ? (typeof width === 'number' ? `${width}px` : width) : undefined}
  style:height={height ? (typeof height === 'number' ? `${height}px` : height) : undefined}
  onclick={handleClick}
  onkeydown={handleKeydown}
  role={clickable || onclick ? 'button' : undefined}
  tabindex={clickable || onclick ? 0 : undefined}
  {...restProps}
>
  <!-- Loading placeholder -->
  {#if isLoading && placeholder}
    <div class="absolute inset-0 flex items-center justify-center bg-gray-100">
      <LoadingSpinner size="md" />
    </div>
  {/if}

  <!-- Error state -->
  {#if hasError}
    <div class="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-500">
      <svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p class="text-sm">Failed to load image</p>
    </div>
  {:else}
    <!-- Main image -->
    <img
      bind:this={imageElement}
      {src}
      {alt}
      {title}
      {loading}
      class={imageClasses}
      onload={handleImageLoad}
      onerror={handleImageError}
    />
  {/if}

  <!-- Overlay content -->
  {#if overlay && overlayContent && !isLoading && !hasError}
    <div class={overlayClasses}>
      {@render overlayContent()}
    </div>
  {/if}

  <!-- Badge -->
  {#if badge}
    <div class="absolute top-2 right-2">
      <Badge variant={badgeVariant} size="sm">
        {badge}
      </Badge>
    </div>
  {/if}
</div>