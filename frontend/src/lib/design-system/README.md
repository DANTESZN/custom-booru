# CustomBooru Design System

A comprehensive design system built with Svelte 5, TypeScript, and Tailwind CSS, providing consistent visual and interactive components for the CustomBooru application.

## Overview

The CustomBooru Design System is built around the core brand identity featuring a purple-pink gradient theme with glass morphism effects. It provides a complete set of design tokens, components, and guidelines to ensure consistency across the application.

## Core Principles

### Brand Identity
- **Primary Colors**: Purple (#a855f7) to Pink (#ec4899) gradients
- **Glass Morphism**: Translucent backgrounds with backdrop blur
- **Modern Aesthetics**: Clean, minimalist design with smooth animations
- **Accessibility**: WCAG 2.1 AA compliant components

### Design Philosophy
1. **Consistency**: Unified visual language across all components
2. **Accessibility**: Keyboard navigation, screen reader support, proper focus management
3. **Performance**: Optimized for modern browsers with efficient CSS
4. **Flexibility**: Customizable components with multiple variants and sizes

## Design Tokens

Design tokens are the foundational elements of our design system, stored in `tokens.ts`:

### Colors
```typescript
// Brand Colors
colors.brand.primary[500]    // #a855f7 (Primary Purple)
colors.brand.secondary[500]  // #ec4899 (Primary Pink)
colors.brand.gradient.primary // Purple to Pink gradient

// Glass Effects
colors.glass.white          // bg-white/80
colors.glass.whiteStrong    // bg-white/90
colors.glass.backdrop       // backdrop-blur-md
```

### Typography
```typescript
typography.fontSize.base    // 1rem (16px)
typography.fontWeight.medium // 500
typography.lineHeight.normal // 1.5
```

### Spacing
```typescript
spacing[4]                  // 1rem (16px)
spacing.layout.md          // 2rem (32px)
```

### Sizes
```typescript
sizes.md.height            // 2.5rem (h-10)
sizes.md.icon              // w-5 h-5
```

## Component Library

### Core Components

#### Button
Multi-variant button component with loading states and accessibility features.

**Variants:**
- `primary` - Gradient purple-to-pink (default)
- `secondary` - White with gray border
- `success` - Green background
- `warning` - Yellow background  
- `danger` - Red background
- `ghost` - Transparent background

**Sizes:** `xs`, `sm`, `md`, `lg`, `xl`

**Features:**
- Loading spinner animation
- Hover and focus states
- Full-width option
- Disabled state handling

#### Modal
Accessible modal dialog with backdrop blur and focus management.

**Features:**
- Glass morphism backdrop
- Auto-focus management
- Escape key handling
- Click-outside-to-close
- Customizable sizes
- Scrollable content area

**Sizes:** `sm`, `md`, `lg`, `xl`, `full`

#### Input
Form input component with validation states and consistent styling.

**Features:**
- Label and error message support
- Glass morphism background
- Focus ring styling
- Validation states (error/success)
- Multiple input types
- Required field indicators

#### Card
Container component with elevation and interaction states.

**Variants:**
- `default` - Glass morphism background
- `outlined` - Border with glass background
- `elevated` - Strong shadow
- `ghost` - Transparent

**Features:**
- Hover animations (lift and glow)
- Clickable variants
- Customizable padding
- Shadow options

#### Badge
Small status and labeling component.

**Features:**
- Color-coded variants
- Removable option
- Size variants
- Glass morphism effects

#### ProgressBar
Loading and progress indication component.

**Features:**
- Animated progress transitions
- Color variants
- Size options
- Label display
- Percentage calculation

### Supporting Components

- **Avatar**: User profile images with fallback initials
- **ErrorMessage**: Consistent error display
- **FileUpload**: Drag-and-drop file selection
- **LoadingSpinner**: Animated loading indicators
- **Select**: Dropdown selection component
- **TagInput**: Multi-tag input with autocomplete
- **Textarea**: Multi-line text input

## Usage Guidelines

### Importing Components

```typescript
// Individual imports
import { Button, Modal, Input } from '$lib/ui';

// Design tokens
import { tokens } from '$lib/design-system/tokens';
```

### Component Usage

```svelte
<!-- Button Examples -->
<Button variant="primary" size="md" onclick={handleClick}>
  Primary Action
</Button>

<Button variant="secondary" loading={isLoading}>
  {#snippet children()}Loading Action{/snippet}
</Button>

<!-- Modal Example -->
<Modal isOpen={showModal} onClose={closeModal} title="Dialog Title" size="lg">
  {#snippet children()}
    <div class="p-6">
      Modal content goes here
    </div>
  {/snippet}
</Modal>

<!-- Input Example -->
<Input
  label="Email Address"
  type="email"
  bind:value={email}
  error={emailError}
  required
/>
```

### Design Token Usage

```svelte
<script>
  import { tokens } from '$lib/design-system/tokens';
</script>

<div class="{tokens.colors.brand.gradient.primary} p-4 rounded-lg">
  <h2 class="{tokens.sizes.lg.text} font-semibold">
    Branded Content
  </h2>
</div>
```

## Accessibility

All components follow WCAG 2.1 AA guidelines:

### Keyboard Navigation
- Tab navigation through interactive elements
- Enter/Space activation for buttons
- Escape key handling for modals

### Screen Reader Support
- Proper ARIA labels and roles
- Semantic HTML structure
- Descriptive text for complex interactions

### Focus Management
- Visible focus indicators
- Logical tab order
- Focus trapping in modals

### Color Contrast
- Minimum 4.5:1 contrast ratio for text
- Color-blind friendly palette
- Alternative indicators beyond color

## Customization

### Theme Customization
Modify `tokens.ts` to adjust the global theme:

```typescript
// Custom color scheme
export const colors = {
  brand: {
    primary: {
      500: '#your-color', // Custom primary
    }
  }
};
```

### Component Customization
Components accept custom classes for one-off modifications:

```svelte
<Button class="custom-button-style" variant="primary">
  Custom Styled Button
</Button>
```

### Utility Functions
The design system provides utility functions in `utils.ts`:

```typescript
import { cn, getSizeClasses, getVariantClasses } from '$lib/ui/utils';

// Combine classes conditionally
const classes = cn(
  'base-classes',
  condition && 'conditional-classes',
  customClass
);
```

## Development

### Adding New Components
1. Create component in `/src/lib/ui/`
2. Add TypeScript interfaces to `types.ts`
3. Export from `index.ts`
4. Update documentation

### Design Token Updates
1. Modify `tokens.ts`
2. Update component utilities in `utils.ts`
3. Test component consistency
4. Update documentation

### Testing Components
Components should be tested for:
- Visual consistency across browsers
- Accessibility compliance
- Keyboard navigation
- Screen reader compatibility
- Responsive behavior

## Browser Support

- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- Progressive enhancement for older browsers
- Responsive design for mobile devices

## Performance

- CSS-in-JS avoided for better performance
- Optimized Tailwind CSS bundle
- Minimal JavaScript footprint
- Efficient animation using CSS transforms

---

For questions or contributions to the design system, please refer to the main project documentation.