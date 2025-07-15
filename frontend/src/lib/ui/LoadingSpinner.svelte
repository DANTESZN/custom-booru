<script lang="ts">
  import type { Size } from './types';
  import { cn, getSizeClasses } from './utils';

  let {
    size = 'md',
    class: className = '',
    color = 'purple',
    label = 'Loading...',
    showLabel = false,
    ...restProps
  }: {
    size?: Size;
    class?: string;
    color?: 'purple' | 'white' | 'gray';
    label?: string;
    showLabel?: boolean;
  } = $props();

  const colorClasses = {
    purple: 'text-purple-600',
    white: 'text-white',
    gray: 'text-gray-600'
  };

  const spinnerClasses = $derived(() => {
    return cn(
      'animate-spin',
      getSizeClasses(size, 'icon'),
      colorClasses[color],
      className
    );
  });
</script>

<div class="flex items-center justify-center" {...restProps}>
  <svg 
    class={spinnerClasses}
    fill="none" 
    viewBox="0 0 24 24"
    aria-label={label}
    role="status"
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
  
  {#if showLabel}
    <span class="ml-2 text-sm text-gray-600">{label}</span>
  {/if}
</div>