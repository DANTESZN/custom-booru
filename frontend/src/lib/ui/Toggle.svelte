<script lang="ts">
  import { Switch } from 'bits-ui';
  import { cn } from './utils';
  import { tokens } from '$lib/design-system/tokens';

  let {
    checked = $bindable(false),
    disabled = false,
    size = 'md',
    label = '',
    description = '',
    class: className = '',
    onCheckedChange,
    ...restProps
  }: {
    checked?: boolean;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    label?: string;
    description?: string;
    class?: string;
    onCheckedChange?: (checked: boolean) => void;
  } = $props();

  const sizeClasses = {
    sm: {
      root: 'w-8 h-5',
      thumb: 'w-4 h-4 data-[state=checked]:translate-x-3',
    },
    md: {
      root: 'w-11 h-6',
      thumb: 'w-5 h-5 data-[state=checked]:translate-x-5',
    },
    lg: {
      root: 'w-14 h-7', 
      thumb: 'w-6 h-6 data-[state=checked]:translate-x-7',
    }
  };

  const rootClasses = $derived(() => cn(
    'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-gray-200',
    sizeClasses[size].root,
    className
  ));

  const thumbClasses = $derived(() => cn(
    'pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform',
    'data-[state=unchecked]:translate-x-0',
    sizeClasses[size].thumb
  ));

  function handleCheckedChange(newChecked: boolean) {
    checked = newChecked;
    onCheckedChange?.(newChecked);
  }
</script>

<div class="flex items-start space-x-3">
  <Switch.Root 
    bind:checked 
    onCheckedChange={handleCheckedChange}
    {disabled}
    class={rootClasses}
    {...restProps}
  >
    <Switch.Thumb class={thumbClasses} />
  </Switch.Root>

  {#if label || description}
    <div class="flex-1">
      {#if label}
        <label class="text-sm font-medium text-gray-900 cursor-pointer">
          {label}
        </label>
      {/if}
      {#if description}
        <p class="text-sm text-gray-500">
          {description}
        </p>
      {/if}
    </div>
  {/if}
</div>