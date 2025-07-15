<script lang="ts">
  import type { ProgressProps } from './types';
  import { cn, getSizeClasses, getProgressColorClasses, transitions } from './utils';
  import { tokens } from '$lib/design-system/tokens';

  let {
    value = 0,
    max = 100,
    size = 'md',
    color = 'purple',
    showLabel = true,
    label = '',
    class: className = '',
    ...restProps
  }: ProgressProps = $props();

  // Calculate percentage
  const percentage = $derived(() => {
    const percent = Math.min(Math.max((value / max) * 100, 0), 100);
    return Math.round(percent);
  });

  // Height mappings for progress bars
  const heightClasses = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
    xl: 'h-6'
  };

  const containerClasses = $derived(() => {
    return cn(
      'w-full bg-gray-200 rounded-full overflow-hidden',
      heightClasses[size],
      className
    );
  });

  const barClasses = $derived(() => {
    return cn(
      `h-full rounded-full ${tokens.transitions.slow}`,
      getProgressColorClasses(color)
    );
  });

  const displayLabel = $derived(() => {
    return label || `${percentage}%`;
  });
</script>

<div class="w-full" {...restProps}>
  {#if showLabel}
    <div class="flex justify-between items-center mb-2">
      <span class="text-sm font-medium text-gray-700">
        {displayLabel}
      </span>
      <span class="text-sm text-gray-500">
        {percentage}%
      </span>
    </div>
  {/if}
  
  <div class={containerClasses} role="progressbar" aria-valuenow={value} aria-valuemin="0" aria-valuemax={max}>
    <div 
      class={barClasses}
      style="width: {percentage}%"
    ></div>
  </div>
</div>