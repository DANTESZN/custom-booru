<script lang="ts">
  import { Select } from 'bits-ui';
  import { cn, getSizeClasses, transitions, generateId } from './utils';
  import { tokens } from '$lib/design-system/tokens';

  let {
    value = $bindable(''),
    options = [],
    placeholder = 'Select an option',
    label = '',
    error = '',
    required = false,
    disabled = false,
    size = 'md',
    class: className = '',
    id = generateId('select'),
    onchange,
    ...restProps
  }: {
    value?: string;
    options: Array<{ value: string; label: string; disabled?: boolean }>;
    placeholder?: string;
    label?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    class?: string;
    id?: string;
    onchange?: (event: Event) => void;
  } = $props();

  const triggerClasses = $derived(() => {
    const baseClasses = `flex w-full items-center justify-between border shadow-sm ${tokens.colors.glass.white}`;
    const borderRadius = 'rounded-lg';
    const sizeClasses = getSizeClasses(size, 'input');
    const stateClasses = error 
      ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' 
      : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500';
    const disabledClasses = disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : '';
    
    return cn(
      baseClasses,
      borderRadius,
      sizeClasses,
      stateClasses,
      disabledClasses,
      transitions.colors,
      'focus:outline-none focus:ring-2',
      className
    );
  });

  const labelClasses = $derived(() => {
    const baseClasses = 'block text-sm font-medium mb-1';
    const colorClasses = error ? 'text-red-700' : 'text-gray-700';
    return cn(baseClasses, colorClasses);
  });

  function handleValueChange(newValue: string) {
    value = newValue;
    onchange?.(new CustomEvent('change', { detail: { value: newValue } }));
  }
</script>

<div class="w-full">
  {#if label}
    <label class={labelClasses}>
      {label}
      {#if required}
        <span class="text-red-500 ml-1">*</span>
      {/if}
    </label>
  {/if}
  
  <Select.Root bind:value onValueChange={handleValueChange} {disabled} {...restProps}>
    <Select.Trigger class={triggerClasses}>
      <Select.Value {placeholder} class="text-left" />
      <Select.Icon class="ml-2">
        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </Select.Icon>
    </Select.Trigger>
    
    <Select.Portal>
      <Select.Content 
        class="z-50 min-w-32 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
        sideOffset={5}
      >
        <div class="p-1">
          {#each options as option}
            <Select.Item 
              value={option.value} 
              disabled={option.disabled}
              class="relative flex w-full cursor-pointer items-center rounded-md py-2 px-3 text-sm outline-none hover:bg-purple-50 focus:bg-purple-50 data-[highlighted]:bg-purple-50 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
            >
              <Select.ItemText>{option.label}</Select.ItemText>
              <Select.ItemIndicator class="ml-auto">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </Select.ItemIndicator>
            </Select.Item>
          {/each}
        </div>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
  
  {#if error}
    <p class="mt-1 text-sm text-red-600">
      {error}
    </p>
  {/if}
</div>