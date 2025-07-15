# Button Component

A versatile button component with multiple variants, sizes, and states built for the CustomBooru design system.

## Features

- 6 semantic variants (primary, secondary, success, warning, danger, ghost)
- 5 size options (xs, sm, md, lg, xl)
- Loading state with spinner animation
- Full-width option
- Hover animations and focus states
- Accessibility compliance
- TypeScript support

## Import

```typescript
import { Button } from '$lib/ui';
```

## Basic Usage

```svelte
<Button onclick={handleClick}>
  Click me
</Button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `Variant` | `'primary'` | Visual style variant |
| `size` | `Size` | `'md'` | Button size |
| `loading` | `boolean` | `false` | Shows loading spinner |
| `fullWidth` | `boolean` | `false` | Expands to full container width |
| `disabled` | `boolean` | `false` | Disables interaction |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML button type |
| `class` | `string` | `''` | Additional CSS classes |
| `onclick` | `(event: MouseEvent) => void` | `undefined` | Click handler |
| `aria-label` | `string` | `undefined` | Accessibility label |

## Variants

### Primary (Default)
The main call-to-action button with purple-to-pink gradient.

```svelte
<Button variant="primary">
  Primary Action
</Button>
```

### Secondary
Neutral button for secondary actions.

```svelte
<Button variant="secondary">
  Secondary Action
</Button>
```

### Success
For positive or completion actions.

```svelte
<Button variant="success">
  Save Changes
</Button>
```

### Warning
For cautionary actions that need attention.

```svelte
<Button variant="warning">
  Delete Draft
</Button>
```

### Danger
For destructive or dangerous actions.

```svelte
<Button variant="danger">
  Delete Forever
</Button>
```

### Ghost
Minimal styling for subtle actions.

```svelte
<Button variant="ghost">
  Cancel
</Button>
```

## Sizes

```svelte
<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>
```

## States

### Loading
Shows spinner and disables interaction.

```svelte
<Button loading={isSubmitting}>
  {isSubmitting ? 'Saving...' : 'Save'}
</Button>
```

### Disabled
Prevents interaction and reduces opacity.

```svelte
<Button disabled={!isValid}>
  Submit Form
</Button>
```

### Full Width
Expands to fill container width.

```svelte
<Button fullWidth>
  Full Width Button
</Button>
```

## Advanced Examples

### Form Submission
```svelte
<script>
  let isSubmitting = false;
  
  async function handleSubmit() {
    isSubmitting = true;
    try {
      await submitForm();
    } finally {
      isSubmitting = false;
    }
  }
</script>

<Button 
  type="submit"
  variant="primary"
  loading={isSubmitting}
  onclick={handleSubmit}
>
  {isSubmitting ? 'Submitting...' : 'Submit'}
</Button>
```

### Icon Button
```svelte
<Button variant="ghost" aria-label="Close dialog">
  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
</Button>
```

### Button Group
```svelte
<div class="flex gap-2">
  <Button variant="secondary">Cancel</Button>
  <Button variant="primary">Confirm</Button>
</div>
```

## Styling

### Custom Classes
Add custom styling while maintaining design system consistency:

```svelte
<Button class="shadow-lg transform rotate-1">
  Custom Styled
</Button>
```

### Design Tokens
The component uses design tokens for consistent styling:

- Colors: `tokens.colors.brand.gradient.primary`
- Transitions: `tokens.transitions.default`
- Focus: `tokens.focusRing.default`
- Animations: `tokens.animations.scaleOnHover`

## Accessibility

- Proper semantic HTML `<button>` element
- Keyboard navigation support (Enter/Space)
- Focus indicators with design system focus ring
- ARIA label support for icon-only buttons
- Loading state announcements
- Disabled state handling

### Screen Reader Support
```svelte
<!-- Good: Descriptive label -->
<Button aria-label="Delete user account">
  <TrashIcon />
</Button>

<!-- Good: Context from content -->
<Button>
  Delete Account
</Button>
```

## Browser Support

- All modern browsers
- Graceful degradation for older browsers
- Touch-friendly on mobile devices

## Performance Notes

- Uses CSS classes for styling (no CSS-in-JS)
- Minimal JavaScript footprint
- Optimized hover/focus animations
- Efficient loading state transitions

## Related Components

- [Modal](./Modal.md) - For dialog actions
- [Input](./Input.md) - For form submissions
- [Card](./Card.md) - For container actions