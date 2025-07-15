# CustomBooru Style Guide

A comprehensive guide to the visual design principles, typography, color usage, and component patterns for the CustomBooru design system.

## Visual Identity

### Brand Colors

#### Primary Palette
The CustomBooru brand is built around a sophisticated purple-to-pink gradient system:

```css
/* Primary Purple */
--purple-500: #a855f7;
--purple-600: #9333ea;
--purple-700: #7c3aed;

/* Primary Pink */
--pink-500: #ec4899;
--pink-600: #db2777;
--pink-700: #be185d;

/* Brand Gradient */
.brand-gradient {
  background: linear-gradient(to right, #a855f7, #ec4899);
}
```

#### Usage Guidelines
- **Primary Purple (#a855f7)**: Main brand color, primary buttons, links
- **Primary Pink (#ec4899)**: Accent color, secondary elements, highlights
- **Gradient**: Hero sections, primary CTAs, brand moments

#### Supporting Colors
```css
/* Neutral Grays */
--gray-50: #f9fafb;    /* Backgrounds */
--gray-100: #f3f4f6;   /* Light backgrounds */
--gray-300: #d1d5db;   /* Borders */
--gray-600: #4b5563;   /* Secondary text */
--gray-900: #111827;   /* Primary text */

/* Semantic Colors */
--success: #22c55e;    /* Success states */
--warning: #f59e0b;    /* Warning states */
--error: #ef4444;      /* Error states */
--info: #3b82f6;       /* Informational states */
```

### Glass Morphism

A key visual element of the CustomBooru design system is the use of glass morphism effects:

```css
/* Glass Effect Variations */
.glass-subtle {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.glass-strong {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}
```

#### When to Use Glass Effects
- **Modal backgrounds**: Creates depth and focus
- **Card overlays**: Subtle elevation over backgrounds
- **Navigation elements**: Semi-transparent headers/sidebars
- **Form containers**: Elegant input groupings

## Typography

### Font System
CustomBooru uses a system font stack for optimal performance and readability:

```css
/* Primary Font Stack */
font-family: system-ui, -apple-system, BlinkMacSystemFont, 
             'Segoe UI', Roboto, sans-serif;

/* Monospace Font Stack */
font-family: Menlo, Monaco, Consolas, 
             'Liberation Mono', 'Courier New', monospace;
```

### Type Scale
A harmonious scale based on a 1.125 ratio:

```css
/* Font Sizes */
--text-xs: 0.75rem;    /* 12px - Small labels, captions */
--text-sm: 0.875rem;   /* 14px - Body text, form labels */
--text-base: 1rem;     /* 16px - Primary body text */
--text-lg: 1.125rem;   /* 18px - Large body text */
--text-xl: 1.25rem;    /* 20px - Small headings */
--text-2xl: 1.5rem;    /* 24px - Section headings */
--text-3xl: 1.875rem;  /* 30px - Page headings */
--text-4xl: 2.25rem;   /* 36px - Hero headings */
--text-5xl: 3rem;      /* 48px - Display headings */
```

### Font Weights
```css
--font-normal: 400;    /* Body text */
--font-medium: 500;    /* Emphasized text */
--font-semibold: 600;  /* Subheadings */
--font-bold: 700;      /* Headings */
```

### Line Heights
```css
--leading-tight: 1.25;    /* Headings */
--leading-snug: 1.375;    /* Large text */
--leading-normal: 1.5;    /* Body text */
--leading-relaxed: 1.625; /* Long-form content */
--leading-loose: 2;       /* Spaced content */
```

### Typography Examples

```html
<!-- Page Heading -->
<h1 class="text-4xl font-bold text-gray-900 leading-tight">
  Gallery Overview
</h1>

<!-- Section Heading -->
<h2 class="text-2xl font-semibold text-gray-900 leading-snug">
  Recent Uploads
</h2>

<!-- Body Text -->
<p class="text-base text-gray-600 leading-normal">
  Discover and organize your beautiful collection of artwork 
  with powerful tagging and search capabilities.
</p>

<!-- Small Text -->
<span class="text-sm text-gray-500">
  Last updated 2 hours ago
</span>
```

## Spacing System

### Base Scale
A consistent 4px-based spacing system:

```css
/* Spacing Scale */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
--space-20: 5rem;    /* 80px */
--space-24: 6rem;    /* 96px */
```

### Layout Spacing
Semantic spacing for consistent layouts:

```css
/* Layout Spacing */
--layout-xs: 1rem;    /* 16px - Tight spacing */
--layout-sm: 1.5rem;  /* 24px - Comfortable spacing */
--layout-md: 2rem;    /* 32px - Standard spacing */
--layout-lg: 3rem;    /* 48px - Loose spacing */
--layout-xl: 4rem;    /* 64px - Extra loose spacing */
```

### Usage Guidelines
- **4px (space-1)**: Fine details, borders
- **8px (space-2)**: Small element spacing
- **16px (space-4)**: Standard component spacing
- **24px (space-6)**: Section spacing
- **32px (space-8)**: Major section spacing
- **48px (space-12)**: Page section spacing

## Component Sizing

### Size Scale
Consistent sizing across all components:

```css
/* Component Heights */
--size-xs: 1.5rem;   /* 24px - Extra small */
--size-sm: 2rem;     /* 32px - Small */
--size-md: 2.5rem;   /* 40px - Medium (default) */
--size-lg: 3rem;     /* 48px - Large */
--size-xl: 3.5rem;   /* 56px - Extra large */
```

### Component Padding
```css
/* Button Padding */
.btn-xs { padding: 0.25rem 0.5rem; }
.btn-sm { padding: 0.375rem 0.75rem; }
.btn-md { padding: 0.5rem 1rem; }
.btn-lg { padding: 0.75rem 1.5rem; }
.btn-xl { padding: 1rem 2rem; }

/* Input Padding */
.input-xs { padding: 0.25rem 0.5rem; }
.input-sm { padding: 0.375rem 0.75rem; }
.input-md { padding: 0.5rem 0.75rem; }
.input-lg { padding: 0.75rem 1rem; }
.input-xl { padding: 1rem 1.25rem; }
```

## Border Radius

### Radius Scale
```css
--radius-none: 0;
--radius-sm: 0.125rem;  /* 2px - Small elements */
--radius-md: 0.375rem;  /* 6px - Buttons, inputs */
--radius-lg: 0.5rem;    /* 8px - Cards */
--radius-xl: 0.75rem;   /* 12px - Large cards */
--radius-2xl: 1rem;     /* 16px - Modals */
--radius-3xl: 1.5rem;   /* 24px - Hero elements */
--radius-full: 9999px;  /* Full rounded - Pills, avatars */
```

### Usage Guidelines
- **2px (sm)**: Small UI elements, badges
- **6px (md)**: Buttons, form inputs, small cards
- **8px (lg)**: Standard cards, containers
- **12px (xl)**: Large cards, feature areas
- **16px (2xl)**: Modals, major containers
- **Full**: Pills, avatars, circular elements

## Shadows and Elevation

### Shadow Scale
```css
/* Shadow Definitions */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 
               0 1px 2px -1px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
             0 2px 4px -2px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 
             0 4px 6px -4px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
             0 8px 10px -6px rgba(0, 0, 0, 0.1);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

### Elevation Guidelines
- **Level 0 (No shadow)**: Flush elements, backgrounds
- **Level 1 (sm)**: Subtle elevation, hover states
- **Level 2 (base)**: Cards, buttons
- **Level 3 (md)**: Raised cards, dropdowns
- **Level 4 (lg)**: Floating action buttons, tooltips
- **Level 5 (xl)**: Modals, overlays
- **Level 6 (2xl)**: Full-screen overlays

## Animation and Motion

### Transition Timing
```css
/* Duration */
--duration-fast: 150ms;   /* Quick micro-interactions */
--duration-normal: 200ms; /* Standard transitions */
--duration-slow: 300ms;   /* Complex state changes */
--duration-slower: 500ms; /* Large layout changes */

/* Timing Functions */
--ease-linear: linear;
--ease-in: ease-in;
--ease-out: ease-out;      /* Preferred for most UI */
--ease-in-out: ease-in-out;
```

### Motion Principles
1. **Purposeful**: Animations should have clear intent
2. **Performant**: Use transform and opacity for best performance
3. **Responsive**: Respect prefers-reduced-motion
4. **Subtle**: Enhance without distracting

### Common Transitions
```css
/* Standard Transition */
.transition-standard {
  transition: all 200ms ease-out;
}

/* Color Transitions */
.transition-colors {
  transition: color 200ms ease-out, 
              background-color 200ms ease-out,
              border-color 200ms ease-out;
}

/* Transform Transitions */
.transition-transform {
  transition: transform 200ms ease-out;
}

/* Hover Effects */
.hover-lift:hover {
  transform: translateY(-2px);
  transition: transform 200ms ease-out;
}

.hover-scale:hover {
  transform: scale(1.05);
  transition: transform 200ms ease-out;
}
```

## Iconography

### Icon System
- **Style**: Outline style for consistency
- **Stroke Width**: 2px for optimal readability
- **Sizes**: 16px, 20px, 24px, 32px (matching text sizes)
- **Source**: Heroicons or similar outline icon set

### Icon Usage
```html
<!-- Small Icon (16px) -->
<svg class="w-4 h-4" stroke="currentColor" fill="none" viewBox="0 0 24 24">
  <!-- icon path -->
</svg>

<!-- Medium Icon (20px) -->
<svg class="w-5 h-5" stroke="currentColor" fill="none" viewBox="0 0 24 24">
  <!-- icon path -->
</svg>

<!-- Large Icon (24px) -->
<svg class="w-6 h-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
  <!-- icon path -->
</svg>
```

## Layout Patterns

### Container Patterns
```css
/* Page Container */
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Section Container */
.section {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

/* Card Grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}
```

### Common Layouts
```html
<!-- Two-Column Layout -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
  <main>Content</main>
  <aside>Sidebar</aside>
</div>

<!-- Three-Column Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- Cards -->
</div>

<!-- Centered Content -->
<div class="max-w-2xl mx-auto px-4">
  <!-- Centered content -->
</div>
```

## Responsive Design

### Breakpoints
```css
/* Mobile First Breakpoints */
--screen-sm: 640px;   /* Small tablets */
--screen-md: 768px;   /* Tablets */
--screen-lg: 1024px;  /* Small desktops */
--screen-xl: 1280px;  /* Large desktops */
--screen-2xl: 1536px; /* Extra large screens */
```

### Responsive Typography
```html
<!-- Responsive Headings -->
<h1 class="text-2xl md:text-3xl lg:text-4xl font-bold">
  Responsive Heading
</h1>

<!-- Responsive Body Text -->
<p class="text-sm md:text-base lg:text-lg">
  Responsive body text
</p>
```

### Responsive Spacing
```html
<!-- Responsive Padding -->
<div class="p-4 md:p-6 lg:p-8">
  Content with responsive padding
</div>

<!-- Responsive Margins -->
<section class="mt-8 md:mt-12 lg:mt-16">
  Section with responsive margin
</section>
```

## Accessibility Standards

### Color Contrast
- **Normal Text**: Minimum 4.5:1 contrast ratio
- **Large Text**: Minimum 3:1 contrast ratio
- **Interactive Elements**: Minimum 3:1 for focus indicators

### Focus Indicators
```css
/* Standard Focus Ring */
.focus-ring:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.5);
  border-color: #a855f7;
}

/* Inset Focus Ring */
.focus-inset:focus {
  outline: none;
  box-shadow: inset 0 0 0 2px rgba(168, 85, 247, 0.5);
}
```

### Interactive States
```css
/* Button States */
.btn {
  /* Default state */
  background: #a855f7;
  color: white;
  
  /* Hover state */
  &:hover {
    background: #9333ea;
  }
  
  /* Focus state */
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.5);
  }
  
  /* Active state */
  &:active {
    background: #7c3aed;
  }
  
  /* Disabled state */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
```

## Best Practices

### Do's
✅ Use the design token system for consistency  
✅ Follow the 4px spacing grid  
✅ Maintain proper color contrast ratios  
✅ Use semantic color meanings (red for errors, green for success)  
✅ Apply glass morphism effects purposefully  
✅ Test responsive behavior across breakpoints  
✅ Ensure keyboard accessibility for all interactions  

### Don'ts
❌ Create custom colors outside the design system  
❌ Use random spacing values not on the grid  
❌ Rely solely on color to convey information  
❌ Overuse glass effects (maintain visual hierarchy)  
❌ Ignore accessibility guidelines  
❌ Create overly complex animations  
❌ Use too many different font sizes in one view  

### Performance Guidelines
- Use `transform` and `opacity` for animations
- Leverage CSS custom properties for theming
- Minimize layout shifts with proper sizing
- Optimize images with appropriate formats and sizes
- Use system fonts for fast rendering

---

This style guide serves as the foundation for all visual design decisions in the CustomBooru application. For component-specific guidelines, refer to the individual component documentation.