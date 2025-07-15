# Modal Component

An accessible modal dialog component with glass morphism effects and comprehensive focus management.

## Features

- Glass morphism backdrop with blur effect
- Automatic focus management
- Keyboard navigation (Escape to close)
- Click-outside-to-close functionality
- Multiple size options
- Scrollable content area
- Accessibility compliant
- Portal-based rendering

## Import

```typescript
import { Modal } from '$lib/ui';
```

## Basic Usage

```svelte
<script>
  let showModal = false;
  
  function openModal() {
    showModal = true;
  }
  
  function closeModal() {
    showModal = false;
  }
</script>

<button onclick={openModal}>Open Modal</button>

<Modal isOpen={showModal} onClose={closeModal} title="Modal Title">
  {#snippet children()}
    <div class="p-6">
      <p>Modal content goes here.</p>
    </div>
  {/snippet}
</Modal>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | `false` | Controls modal visibility |
| `title` | `string` | `''` | Modal title (optional) |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Modal size |
| `closable` | `boolean` | `true` | Shows close button and enables escape |
| `class` | `string` | `''` | Additional CSS classes |
| `onClose` | `() => void` | `required` | Close handler function |

## Sizes

### Small (sm)
Compact modal for simple confirmations.
```svelte
<Modal size="sm" isOpen={show} onClose={close} title="Confirm">
  {#snippet children()}
    <div class="p-4">
      <p>Are you sure?</p>
    </div>
  {/snippet}
</Modal>
```

### Medium (md) - Default
Standard modal for most use cases.
```svelte
<Modal size="md" isOpen={show} onClose={close} title="Edit Profile">
  {#snippet children()}
    <div class="p-6">
      <!-- Form content -->
    </div>
  {/snippet}
</Modal>
```

### Large (lg)
Wider modal for complex forms or content.
```svelte
<Modal size="lg" isOpen={show} onClose={close} title="Upload Images">
  {#snippet children()}
    <div class="p-6">
      <!-- Multi-step form -->
    </div>
  {/snippet}
</Modal>
```

### Extra Large (xl)
Maximum width modal for detailed views.
```svelte
<Modal size="xl" isOpen={show} onClose={close} title="Image Gallery">
  {#snippet children()}
    <div class="p-8">
      <!-- Gallery grid -->
    </div>
  {/snippet}
</Modal>
```

### Full Screen (full)
Full viewport modal for immersive experiences.
```svelte
<Modal size="full" isOpen={show} onClose={close} title="Full Editor">
  {#snippet children()}
    <div class="h-full p-6">
      <!-- Full-height editor -->
    </div>
  {/snippet}
</Modal>
```

## Content Structure

### With Footer
```svelte
<Modal isOpen={show} onClose={close} title="Confirm Action">
  {#snippet children()}
    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto p-6">
      <p>This action cannot be undone.</p>
    </div>
    
    <!-- Fixed Footer -->
    <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
      <Button variant="secondary" onclick={close}>Cancel</Button>
      <Button variant="danger" onclick={confirmAction}>Delete</Button>
    </div>
  {/snippet}
</Modal>
```

### Scrollable Content
```svelte
<Modal isOpen={show} onClose={close} title="Long Content">
  {#snippet children()}
    <div class="flex-1 overflow-y-auto p-6">
      <!-- Long scrollable content -->
      {#each items as item}
        <div class="mb-4">{item.content}</div>
      {/each}
    </div>
  {/snippet}
</Modal>
```

### Form Modal
```svelte
<Modal isOpen={show} onClose={close} title="Add New Item">
  {#snippet children()}
    <form on:submit|preventDefault={handleSubmit}>
      <div class="flex-1 overflow-y-auto p-6 space-y-4">
        <Input label="Name" bind:value={form.name} required />
        <Textarea label="Description" bind:value={form.description} />
      </div>
      
      <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
        <Button type="button" variant="secondary" onclick={close}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  {/snippet}
</Modal>
```

## Advanced Examples

### Confirmation Modal
```svelte
<script>
  let showConfirm = false;
  let isDeleting = false;
  
  async function confirmDelete() {
    isDeleting = true;
    try {
      await deleteItem();
      showConfirm = false;
    } finally {
      isDeleting = false;
    }
  }
</script>

<Modal 
  isOpen={showConfirm} 
  onClose={() => showConfirm = false} 
  title="Confirm Deletion"
  size="sm"
>
  {#snippet children()}
    <div class="p-6">
      <p class="text-gray-600 mb-6">
        This action cannot be undone. The item will be permanently deleted.
      </p>
      
      <div class="flex justify-end space-x-3">
        <Button variant="secondary" onclick={() => showConfirm = false}>
          Cancel
        </Button>
        <Button 
          variant="danger" 
          loading={isDeleting}
          onclick={confirmDelete}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </div>
  {/snippet}
</Modal>
```

### Non-Closable Modal
```svelte
<Modal 
  isOpen={showProgress} 
  onClose={noop} 
  title="Processing..."
  closable={false}
  size="sm"
>
  {#snippet children()}
    <div class="p-6 text-center">
      <ProgressBar value={progress} />
      <p class="mt-4 text-gray-600">Please wait while we process your request.</p>
    </div>
  {/snippet}
</Modal>
```

## Styling

### Custom Classes
```svelte
<Modal 
  class="custom-modal-styles" 
  isOpen={show} 
  onClose={close}
>
  {#snippet children()}
    <!-- Content -->
  {/snippet}
</Modal>
```

### Design Tokens
The component uses these design tokens:

- **Background**: `tokens.colors.glass.whiteStrong`
- **Backdrop**: `tokens.colors.glass.backdrop`
- **Z-Index**: `tokens.zIndex.modal`
- **Border**: `tokens.colors.glass.border`

## Accessibility

### Focus Management
- Automatically focuses first interactive element
- Traps focus within modal
- Restores focus to trigger element on close
- Supports Tab navigation

### Keyboard Navigation
- **Escape**: Closes modal (if closable)
- **Tab/Shift+Tab**: Navigate through interactive elements
- **Enter/Space**: Activate focused elements

### Screen Reader Support
- Proper ARIA roles and labels
- Modal announced when opened
- Content properly associated with title
- Hidden from screen readers when closed

### Best Practices
```svelte
<!-- Good: Descriptive title -->
<Modal title="Delete User Account" isOpen={show} onClose={close}>
  {#snippet children()}
    <!-- Content clearly explains the action -->
  {/snippet}
</Modal>

<!-- Good: Action context -->
<Modal 
  title="Upload Complete" 
  isOpen={showSuccess} 
  onClose={closeSuccess}
  aria-labelledby="success-title"
>
  {#snippet children()}
    <div class="p-6">
      <h3 id="success-title">Upload Successful</h3>
      <p>Your images have been uploaded successfully.</p>
    </div>
  {/snippet}
</Modal>
```

## State Management

### With Stores
```svelte
<script>
  import { modalStore } from '$lib/stores/modal';
  
  // Open modal from anywhere
  function openModal() {
    modalStore.open('user-profile', { userId: 123 });
  }
</script>

<Modal 
  isOpen={$modalStore.isOpen && $modalStore.type === 'user-profile'}
  onClose={() => modalStore.close()}
  title="User Profile"
>
  {#snippet children()}
    <!-- Profile content using $modalStore.data -->
  {/snippet}
</Modal>
```

### Multiple Modals
```svelte
<script>
  let modals = {
    edit: false,
    delete: false,
    share: false
  };
  
  function openModal(type) {
    modals[type] = true;
  }
  
  function closeModal(type) {
    modals[type] = false;
  }
</script>

<!-- Edit Modal -->
<Modal isOpen={modals.edit} onClose={() => closeModal('edit')}>
  <!-- Edit content -->
</Modal>

<!-- Delete Modal -->
<Modal isOpen={modals.delete} onClose={() => closeModal('delete')}>
  <!-- Delete confirmation -->
</Modal>

<!-- Share Modal -->
<Modal isOpen={modals.share} onClose={() => closeModal('share')}>
  <!-- Share options -->
</Modal>
```

## Performance

- Portal rendering prevents layout shifts
- Efficient backdrop blur using CSS
- Minimal JavaScript for interactions
- Optimized animation performance

## Browser Support

- Modern browsers with backdrop-filter support
- Fallback blur for older browsers
- Touch-friendly on mobile devices
- Responsive sizing

## Related Components

- [Button](./Button.md) - For modal actions
- [Input](./Input.md) - For form modals
- [ProgressBar](./ProgressBar.md) - For loading modals
- [Card](./Card.md) - For content structure