# UI Component Documentation

Complete documentation for the CustomBooru UI component library.

## Quick Start

```typescript
import { Button, Modal, Input, Card } from '$lib/ui';
import { tokens } from '$lib/design-system/tokens';
```

## Component Categories

### Core Components
Essential interactive components for user interface.

- **[Button](./Button.md)** - Interactive buttons with variants and states
- **[Modal](./Modal.md)** - Accessible dialog and overlay components  
- **[Input](./Input.md)** - Form input fields with validation
- **[Card](./Card.md)** - Container components with elevation

### Form Components
Components specifically designed for form interfaces.

- **Input** - Text, email, password, and other input types
- **Textarea** - Multi-line text input
- **Select** - Dropdown selection component
- **TagInput** - Multi-tag input with autocomplete

### Display Components
Components for presenting information and content.

- **Badge** - Status indicators and labels
- **Avatar** - User profile images with fallbacks
- **ProgressBar** - Loading and progress indication
- **ErrorMessage** - Consistent error display

### Utility Components
Supporting components for enhanced functionality.

- **LoadingSpinner** - Animated loading indicators
- **FileUpload** - Drag-and-drop file selection
- **ImagePreview** - Image display with loading states

## Design System Integration

All components are built on top of the CustomBooru design system:

### Design Tokens
```typescript
import { tokens } from '$lib/design-system/tokens';

// Use design tokens in custom components
const customStyle = `
  ${tokens.colors.brand.gradient.primary}
  ${tokens.spacing.layout.md}
  ${tokens.borderRadius.lg}
`;
```

### Utility Functions
```typescript
import { cn, getSizeClasses, getVariantClasses } from '$lib/ui/utils';

// Combine classes conditionally
const classes = cn(
  'base-classes',
  condition && 'conditional-classes',
  props.className
);
```

## Common Patterns

### Form with Validation
```svelte
<script>
  import { Button, Input, Modal } from '$lib/ui';
  
  let form = { name: '', email: '' };
  let errors = {};
  let isSubmitting = false;
</script>

<form on:submit|preventDefault={handleSubmit}>
  <div class="space-y-4">
    <Input
      label="Full Name"
      bind:value={form.name}
      error={errors.name}
      required
    />
    
    <Input
      label="Email Address"
      type="email"
      bind:value={form.email}
      error={errors.email}
      required
    />
  </div>
  
  <div class="mt-6 flex justify-end space-x-3">
    <Button variant="secondary" type="button">
      Cancel
    </Button>
    <Button variant="primary" type="submit" loading={isSubmitting}>
      {isSubmitting ? 'Saving...' : 'Save'}
    </Button>
  </div>
</form>
```

### Modal with Form
```svelte
<script>
  import { Modal, Button, Input } from '$lib/ui';
  
  let showModal = false;
  let formData = {};
</script>

<Modal isOpen={showModal} onClose={() => showModal = false} title="Add Item">
  {#snippet children()}
    <div class="flex-1 overflow-y-auto p-6">
      <Input label="Title" bind:value={formData.title} />
    </div>
    
    <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
      <Button variant="secondary" onclick={() => showModal = false}>
        Cancel
      </Button>
      <Button variant="primary" onclick={handleSave}>
        Save
      </Button>
    </div>
  {/snippet}
</Modal>
```

### Card Grid Layout
```svelte
<script>
  import { Card, Button, Badge } from '$lib/ui';
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {#each items as item}
    <Card hover clickable onclick={() => viewItem(item)}>
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">{item.title}</h3>
          <Badge variant={item.status === 'active' ? 'success' : 'secondary'}>
            {item.status}
          </Badge>
        </div>
        
        <p class="text-gray-600 mb-4">{item.description}</p>
        
        <div class="flex justify-end">
          <Button size="sm" variant="ghost">
            View Details
          </Button>
        </div>
      </div>
    </Card>
  {/each}
</div>
```

## Theming and Customization

### Custom Theme
```typescript
// custom-tokens.ts
import { tokens } from '$lib/design-system/tokens';

export const customTokens = {
  ...tokens,
  colors: {
    ...tokens.colors,
    brand: {
      primary: {
        500: '#your-color'
      }
    }
  }
};
```

### Component Customization
```svelte
<!-- Using custom classes -->
<Button class="shadow-2xl transform rotate-1" variant="primary">
  Custom Style
</Button>

<!-- Using design tokens -->
<div class="{tokens.colors.brand.gradient.primary} p-4 rounded-lg">
  Branded Container
</div>
```

## Accessibility Guidelines

### Keyboard Navigation
- All interactive components support keyboard navigation
- Tab order follows logical flow
- Enter/Space activates buttons and links
- Escape closes modals and dropdowns

### Screen Reader Support
- Semantic HTML elements used throughout
- ARIA labels provided where needed
- Form validation errors announced
- Loading states communicated

### Visual Accessibility
- High contrast color combinations
- Focus indicators visible and clear
- Text size meets accessibility standards
- Color not the only indicator of state

### Best Practices
```svelte
<!-- Good: Descriptive labels -->
<Button aria-label="Delete user account">
  <TrashIcon />
</Button>

<!-- Good: Error association -->
<Input
  label="Email"
  bind:value={email}
  error={emailError}
  aria-describedby="email-error"
/>

<!-- Good: Loading announcements -->
<Button loading={isLoading} aria-live="polite">
  {isLoading ? 'Saving changes...' : 'Save'}
</Button>
```

## Performance Optimization

### Bundle Size
- Components are tree-shakeable
- Only import what you need
- Shared utilities minimize duplication

### Runtime Performance
- Minimal JavaScript footprint
- CSS animations for smooth performance
- Efficient state management
- Debounced user interactions

### Loading Performance
- Components lazy-load when possible
- Image components include loading states
- Progressive enhancement supported

## Browser Compatibility

### Modern Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Fallbacks
- Graceful degradation for older browsers
- Alternative animations for reduced motion
- Fallback colors for unsupported features

## Development Tools

### TypeScript Support
All components include full TypeScript definitions:

```typescript
import type { ButtonProps, ModalProps } from '$lib/ui/types';

// Type-safe component usage
const buttonProps: ButtonProps = {
  variant: 'primary',
  size: 'md',
  onclick: handleClick
};
```

### Development Utilities
```typescript
import { generateId, debounce, formatFileSize } from '$lib/ui/utils';

// Utility functions for common tasks
const uniqueId = generateId('modal');
const debouncedSearch = debounce(searchFunction, 300);
const fileSize = formatFileSize(1024000); // "1 MB"
```

## Contributing

### Adding New Components
1. Create component in `/src/lib/ui/`
2. Add TypeScript interfaces to `types.ts`
3. Export from `index.ts`
4. Create documentation in `/docs/`
5. Update this README

### Component Standards
- Follow accessibility guidelines
- Include TypeScript definitions
- Provide comprehensive documentation
- Include usage examples
- Support all required variants and sizes

### Testing
- Visual regression testing
- Accessibility compliance testing
- Keyboard navigation testing
- Cross-browser compatibility testing

---

For more information about the design system foundation, see the [Design System README](../design-system/README.md).