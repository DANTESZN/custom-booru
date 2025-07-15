<script lang="ts">
  interface Props {
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost' | 'blue' | 'green' | 'yellow';
    size?: 'xs' | 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    type?: 'button' | 'submit' | 'reset';
    onclick?: (event: MouseEvent) => void;
    class?: string;
    children?: any;
  }

  let {
    variant = 'secondary',
    size = 'sm',
    disabled = false,
    loading = false,
    type = 'button',
    onclick,
    class: className = '',
    children
  }: Props = $props();

  function handleClick(event: MouseEvent) {
    if (disabled || loading) {
      event.preventDefault();
      return;
    }
    onclick?.(event);
  }
</script>

{#if variant === 'primary'}
  <button
    {type}
    disabled={disabled || loading}
    onclick={handleClick}
    class="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 {size === 'xs' ? 'px-2 py-1 text-xs' : size === 'sm' ? 'px-3 py-1.5 text-sm' : size === 'md' ? 'px-4 py-2 text-sm' : 'px-6 py-3 text-base'} {disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} {className}"
    style="background: linear-gradient(to right, #8b5cf6, #ec4899); color: white; border: none; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);"
  >
    {#if loading}
      <svg class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    {/if}
    {@render children?.()}
  </button>
{:else if variant === 'blue'}
  <button
    {type}
    disabled={disabled || loading}
    onclick={handleClick}
    class="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 {size === 'xs' ? 'px-2 py-1 text-xs' : size === 'sm' ? 'px-3 py-1.5 text-sm' : size === 'md' ? 'px-4 py-2 text-sm' : 'px-6 py-3 text-base'} {disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} {className}"
    style="background-color: #dbeafe; color: #1d4ed8; border: 1px solid #93c5fd; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);"
  >
    {#if loading}
      <svg class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    {/if}
    {@render children?.()}
  </button>
{:else if variant === 'green'}
  <button
    {type}
    disabled={disabled || loading}
    onclick={handleClick}
    class="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 {size === 'xs' ? 'px-2 py-1 text-xs' : size === 'sm' ? 'px-3 py-1.5 text-sm' : size === 'md' ? 'px-4 py-2 text-sm' : 'px-6 py-3 text-base'} {disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} {className}"
    style="background-color: #dcfce7; color: #166534; border: 1px solid #86efac; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);"
  >
    {#if loading}
      <svg class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    {/if}
    {@render children?.()}
  </button>
{:else if variant === 'yellow'}
  <button
    {type}
    disabled={disabled || loading}
    onclick={handleClick}
    class="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 {size === 'xs' ? 'px-2 py-1 text-xs' : size === 'sm' ? 'px-3 py-1.5 text-sm' : size === 'md' ? 'px-4 py-2 text-sm' : 'px-6 py-3 text-base'} {disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} {className}"
    style="background-color: #fef3c7; color: #92400e; border: 1px solid #fcd34d; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);"
  >
    {#if loading}
      <svg class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    {/if}
    {@render children?.()}
  </button>
{:else}
  <!-- secondary and other variants -->
  <button
    {type}
    disabled={disabled || loading}
    onclick={handleClick}
    class="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 {size === 'xs' ? 'px-2 py-1 text-xs' : size === 'sm' ? 'px-3 py-1.5 text-sm' : size === 'md' ? 'px-4 py-2 text-sm' : 'px-6 py-3 text-base'} {disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} {className}"
    style="background-color: white; color: #374151; border: 1px solid #d1d5db; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);"
  >
    {#if loading}
      <svg class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    {/if}
    {@render children?.()}
  </button>
{/if}