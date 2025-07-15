<script lang="ts">
  import { Dialog } from 'bits-ui';
  import type { ModalProps } from './types';
  import { cn } from './utils';
  import { tokens } from '$lib/design-system/tokens';
  import Button from './Button.svelte';

  let {
    isOpen = false,
    title = '',
    size = 'md',
    closable = true,
    class: className = '',
    onClose,
    content,
    ...restProps
  }: ModalProps & { content?: any } = $props();

  // Size mappings
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full mx-4'
  };

  function handleOpenChange(open: boolean) {
    if (!open && closable) {
      onClose();
    }
  }
</script>

<Dialog.Root bind:open={isOpen} onOpenChange={handleOpenChange}>
  <Dialog.Portal>
    <Dialog.Overlay 
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
    />
    <Dialog.Content 
      class={cn(
        'bg-white rounded-2xl shadow-2xl w-full flex flex-col z-50',
        'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
        'max-h-[90vh] overflow-hidden border border-gray-200',
        sizeClasses[size],
        className
      )}
      {...restProps}
    >
      <!-- Header -->
      {#if title || closable}
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200/30 bg-gradient-to-r from-purple-50/50 to-pink-50/50 flex-shrink-0">
          {#if title}
            <Dialog.Title class="text-2xl font-bold text-gray-900">
              {title}
            </Dialog.Title>
          {/if}
          
          {#if closable}
            <Button
              variant="ghost"
              size="sm"
              onclick={onClose}
              class="text-gray-400 hover:text-gray-600"
              aria-label="Close modal"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          {/if}
        </div>
      {/if}

      <!-- Main Content Area -->
      {#if content}
        {@render content()}
      {/if}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>