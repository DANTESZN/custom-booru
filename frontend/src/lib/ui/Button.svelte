<script lang="ts">
  import type { ButtonProps } from './types';
  import { cn, getSizeClasses, getVariantClasses, transitions, focusRing } from './utils';
  import { tokens } from '$lib/design-system/tokens';

  let {
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    disabled = false,
    type = 'button',
    class: className = '',
    onclick,
    children,
    builders = [],
    ...restProps
  }: ButtonProps & { children?: any; builders?: any[] } = $props();

  // Compute button classes
  const buttonClasses = $derived(() => {
    const baseClasses = `inline-flex items-center justify-center font-medium rounded-lg border ${tokens.animations.scaleOnHover}`;
    const sizeClasses = getSizeClasses(size, 'button');
    const variantClasses = getVariantClasses(variant, 'button');
    const widthClasses = fullWidth ? 'w-full' : '';
    const disabledClasses = (disabled || loading) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
    const loadingClasses = loading ? 'pointer-events-none' : '';
    
    return cn(
      baseClasses,
      sizeClasses,
      variantClasses,
      widthClasses,
      disabledClasses,
      loadingClasses,
      transitions.default,
      focusRing,
      className
    );
  });

  function handleClick(event: MouseEvent) {
    if (disabled || loading) {
      event.preventDefault();
      return;
    }
    onclick?.(event);
  }

  function applyBuilders(node: HTMLElement, builders: any[]) {
    const unsubs: Array<() => void> = [];
    
    builders.forEach(builder => {
      if (builder && typeof builder === 'function') {
        const result = builder(node);
        if (result && typeof result.destroy === 'function') {
          unsubs.push(result.destroy);
        }
      } else if (builder && typeof builder.action === 'function') {
        const result = builder.action(node, builder.props);
        if (result && typeof result.destroy === 'function') {
          unsubs.push(result.destroy);
        }
      }
    });
    
    return {
      destroy() {
        unsubs.forEach(unsub => unsub());
      }
    };
  }
</script>

<button
  {type}
  class={buttonClasses}
  disabled={disabled || loading}
  onclick={handleClick}
  use:applyBuilders={builders}
  {...restProps}
>
  {#if loading}
    <svg 
      class="animate-spin {getSizeClasses(size, 'icon')} mr-2" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        class="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        stroke-width="4"
      ></circle>
      <path 
        class="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  {/if}
  
  {@render children?.()}
</button>