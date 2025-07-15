<script lang="ts">
  import type { BadgeProps } from './types';
  import { cn, getSizeClasses, getVariantClasses, transitions } from './utils';
  import { tokens } from '$lib/design-system/tokens';

  let {
    variant = 'secondary',
    size = 'sm',
    removable = false,
    class: className = '',
    onRemove,
    children,
    ...restProps
  }: BadgeProps & { children?: any } = $props();

  const badgeClasses = $derived(() => {
    const baseClasses = `inline-flex items-center font-medium border rounded-full ${tokens.colors.glass.backdrop}`;
    // Use text size class instead of padding for badges
    const sizeClasses = getSizeClasses(size, 'text');
    const paddingClasses = {
      xs: 'px-2 py-0.5',
      sm: 'px-2.5 py-0.5',
      md: 'px-3 py-1',
      lg: 'px-3.5 py-1',
      xl: 'px-4 py-1.5'
    }[size];
    const variantClasses = getVariantClasses(variant, 'badge');
    
    return cn(
      baseClasses,
      sizeClasses,
      paddingClasses,
      variantClasses,
      transitions.colors,
      className
    );
  });

  function handleRemove(event: MouseEvent) {
    event.stopPropagation();
    onRemove?.();
  }
</script>

<span class={badgeClasses} {...restProps}>
  {@render children?.()}
  
  {#if removable && onRemove}
    <button
      type="button"
      onclick={handleRemove}
      class="ml-1 h-4 w-4 flex items-center justify-center rounded-full hover:bg-black hover:bg-opacity-10 focus:outline-none focus:bg-black focus:bg-opacity-10 transition-colors"
      aria-label="Remove"
    >
      <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </button>
  {/if}
</span>