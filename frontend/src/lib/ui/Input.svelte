<script lang="ts">
  import type { InputProps } from './types';
  import { cn, getSizeClasses, transitions, focusRing, generateId } from './utils';
  import { tokens } from '$lib/design-system/tokens';

  let {
    type = 'text',
    placeholder = '',
    value = $bindable(''),
    error = '',
    label = '',
    required = false,
    readonly = false,
    disabled = false,
    size = 'md',
    class: className = '',
    id = generateId('input'),
    oninput,
    onchange,
    onfocus,
    onblur,
    ...restProps
  }: InputProps = $props();

  let focused = $state(false);

  // Compute input classes
  const inputClasses = $derived(() => {
    const baseClasses = `block w-full border shadow-sm placeholder-gray-400`;
    const borderRadius = 'rounded-lg';
    const sizeClasses = getSizeClasses(size, 'input');
    const stateClasses = error 
      ? `border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500` 
      : `border-gray-300 focus:ring-purple-500 focus:border-purple-500`;
    const disabledClasses = disabled ? `bg-gray-50 text-gray-500 cursor-not-allowed` : `${tokens.colors.glass.white}`;
    const readonlyClasses = readonly ? 'bg-gray-50' : '';
    
    return cn(
      baseClasses,
      borderRadius,
      sizeClasses,
      stateClasses,
      disabledClasses,
      readonlyClasses,
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

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    value = target.value;
    oninput?.(event);
  }

  function handleChange(event: Event) {
    onchange?.(event);
  }

  function handleFocus(event: FocusEvent) {
    focused = true;
    onfocus?.(event);
  }

  function handleBlur(event: FocusEvent) {
    focused = false;
    onblur?.(event);
  }
</script>

<div class="w-full">
  {#if label}
    <label for={id} class={labelClasses}>
      {label}
      {#if required}
        <span class="text-red-500 ml-1">*</span>
      {/if}
    </label>
  {/if}
  
  <div class="relative">
    <input
      {id}
      {type}
      {placeholder}
      {value}
      {required}
      {readonly}
      {disabled}
      class={inputClasses}
      oninput={handleInput}
      onchange={handleChange}
      onfocus={handleFocus}
      onblur={handleBlur}
      {...restProps}
    />
    
    {#if error}
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      </div>
    {/if}
  </div>
  
  {#if error}
    <p class="mt-1 text-sm text-red-600" id="{id}-error">
      {error}
    </p>
  {/if}
</div>