<script lang="ts">
  import type { AvatarProps } from './types';
  import { cn, getSizeClasses, getColorClasses, getInitials } from './utils';

  let {
    src = '',
    alt = '',
    size = 'md',
    fallback = '',
    color = 'purple',
    class: className = '',
    ...restProps
  }: AvatarProps = $props();

  let imageError = $state(false);

  const avatarClasses = $derived(() => {
    const baseClasses = 'inline-flex items-center justify-center rounded-full text-white font-semibold flex-shrink-0';
    const sizeClasses = getSizeClasses(size, 'avatar');
    const colorClasses = !src || imageError ? getColorClasses(color) : '';
    
    return cn(
      baseClasses,
      sizeClasses,
      colorClasses,
      className
    );
  });

  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  const displayFallback = $derived(() => {
    if (fallback) {
      return getInitials(fallback);
    }
    if (alt) {
      return getInitials(alt);
    }
    return '?';
  });

  function handleImageError() {
    imageError = true;
  }
</script>

<div class={avatarClasses} {...restProps}>
  {#if src && !imageError}
    <img
      {src}
      {alt}
      class="w-full h-full object-cover rounded-full"
      onerror={handleImageError}
    />
  {:else}
    <span class={textSizeClasses[size]}>
      {displayFallback}
    </span>
  {/if}
</div>