<script lang="ts">
  import { cn, getSizeClasses, transitions, generateId } from './utils';

  let {
    value = $bindable(''),
    placeholder = '',
    label = '',
    error = '',
    required = false,
    disabled = false,
    readonly = false,
    rows = 3,
    resize = 'vertical',
    size = 'md',
    class: className = '',
    id = generateId('textarea'),
    oninput,
    onchange,
    onfocus,
    onblur,
    ...restProps
  }: {
    value?: string;
    placeholder?: string;
    label?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    rows?: number;
    resize?: 'none' | 'vertical' | 'horizontal' | 'both';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    class?: string;
    id?: string;
    oninput?: (event: Event) => void;
    onchange?: (event: Event) => void;
    onfocus?: (event: FocusEvent) => void;
    onblur?: (event: FocusEvent) => void;
  } = $props();

  const textareaClasses = $derived(() => {
    const baseClasses = 'block w-full border rounded-lg shadow-sm bg-white';
    const sizeClasses = getSizeClasses(size, 'input');
    const stateClasses = error 
      ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' 
      : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500';
    const disabledClasses = disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : '';
    const readonlyClasses = readonly ? 'bg-gray-50' : '';
    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize'
    }[resize];
    
    return cn(
      baseClasses,
      sizeClasses,
      stateClasses,
      disabledClasses,
      readonlyClasses,
      resizeClasses,
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
    const target = event.target as HTMLTextAreaElement;
    value = target.value;
    oninput?.(event);
  }

  function handleChange(event: Event) {
    onchange?.(event);
  }

  function handleFocus(event: FocusEvent) {
    onfocus?.(event);
  }

  function handleBlur(event: FocusEvent) {
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
    <textarea
      {id}
      {value}
      {placeholder}
      {required}
      {disabled}
      {readonly}
      {rows}
      class={textareaClasses}
      oninput={handleInput}
      onchange={handleChange}
      onfocus={handleFocus}
      onblur={handleBlur}
      aria-describedby={error ? `${id}-error` : undefined}
      {...restProps}
    ></textarea>
    
    {#if error}
      <div class="absolute top-2 right-2 pointer-events-none">
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