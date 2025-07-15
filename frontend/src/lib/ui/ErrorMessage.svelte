<script lang="ts">
  import { cn, transitions } from './utils';

  let {
    message = '',
    variant = 'error',
    size = 'sm',
    icon = true,
    dismissible = false,
    class: className = '',
    onDismiss,
    ...restProps
  }: {
    message: string;
    variant?: 'error' | 'warning' | 'info' | 'success';
    size?: 'xs' | 'sm' | 'md' | 'lg';
    icon?: boolean;
    dismissible?: boolean;
    class?: string;
    onDismiss?: () => void;
  } = $props();

  const containerClasses = $derived(() => {
    const baseClasses = 'flex items-start rounded-md border p-3';
    
    const variantClasses = {
      error: 'bg-red-50 border-red-200 text-red-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800',
      success: 'bg-green-50 border-green-200 text-green-800'
    }[variant];

    const sizeClasses = {
      xs: 'text-xs p-2',
      sm: 'text-sm p-3',
      md: 'text-base p-4',
      lg: 'text-lg p-5'
    }[size];

    return cn(baseClasses, variantClasses, sizeClasses, className);
  });

  const iconClasses = $derived(() => {
    const baseClasses = 'flex-shrink-0 mr-2';
    const sizeClasses = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    }[size];

    const colorClasses = {
      error: 'text-red-500',
      warning: 'text-yellow-500',
      info: 'text-blue-500',
      success: 'text-green-500'
    }[variant];

    return cn(baseClasses, sizeClasses, colorClasses);
  });

  const textClasses = $derived(() => {
    const baseClasses = 'flex-1';
    return cn(baseClasses);
  });

  const dismissButtonClasses = $derived(() => {
    const baseClasses = 'flex-shrink-0 ml-2 p-1 rounded-md hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const colorClasses = {
      error: 'text-red-500 hover:bg-red-500 focus:ring-red-500',
      warning: 'text-yellow-500 hover:bg-yellow-500 focus:ring-yellow-500',
      info: 'text-blue-500 hover:bg-blue-500 focus:ring-blue-500',
      success: 'text-green-500 hover:bg-green-500 focus:ring-green-500'
    }[variant];

    return cn(baseClasses, colorClasses, transitions.colors);
  });

  function getIcon() {
    switch (variant) {
      case 'error':
        return `<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />`;
      case 'warning':
        return `<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />`;
      case 'info':
        return `<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />`;
      case 'success':
        return `<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />`;
      default:
        return '';
    }
  }

  function handleDismiss() {
    onDismiss?.();
  }
</script>

{#if message}
  <div class={containerClasses} {...restProps}>
    {#if icon}
      <svg class={iconClasses} fill="currentColor" viewBox="0 0 20 20">
        {@html getIcon()}
      </svg>
    {/if}
    
    <div class={textClasses}>
      {message}
    </div>
    
    {#if dismissible}
      <button
        type="button"
        class={dismissButtonClasses}
        onclick={handleDismiss}
        aria-label="Dismiss"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    {/if}
  </div>
{/if}