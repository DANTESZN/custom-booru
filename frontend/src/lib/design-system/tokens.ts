/**
 * CustomBooru Design System - Design Tokens
 * 
 * This file contains all design tokens used throughout the application.
 * These tokens ensure consistency and make it easy to maintain the design system.
 */

// ============================================================================
// COLOR TOKENS
// ============================================================================

export const colors = {
  // Brand Colors
  brand: {
    primary: {
      50: '#faf5ff',
      100: '#f3e8ff', 
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7', // Primary purple
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87',
    },
    secondary: {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#f9a8d4',
      400: '#f472b6',
      500: '#ec4899', // Primary pink
      600: '#db2777',
      700: '#be185d',
      800: '#9d174d',
      900: '#831843',
    },
    gradient: {
      primary: 'bg-gradient-to-r from-purple-500 to-pink-500',
      primaryHover: 'hover:from-purple-600 hover:to-pink-600',
      background: 'bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50',
      text: 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent',
    }
  },

  // Neutral Colors
  neutral: {
    0: '#ffffff',
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Semantic Colors
  semantic: {
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
    },
    info: {
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
    }
  },

  // Glass morphism colors
  glass: {
    white: 'bg-white/80',
    whiteStrong: 'bg-white/90',
    backdrop: 'backdrop-blur-md',
    backdropStrong: 'backdrop-blur-xl',
    border: 'border-white/20',
  }
} as const;

// ============================================================================
// TYPOGRAPHY TOKENS
// ============================================================================

export const typography = {
  // Font Families
  fontFamily: {
    sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    mono: ['Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
  },

  // Font Sizes
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem',  // 72px
  },

  // Font Weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // Line Heights
  lineHeight: {
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  }
} as const;

// ============================================================================
// SPACING TOKENS
// ============================================================================

export const spacing = {
  // Base spacing scale (rem units)
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  7: '1.75rem',   // 28px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px

  // Layout spacing
  layout: {
    xs: '1rem',    // 16px
    sm: '1.5rem',  // 24px
    md: '2rem',    // 32px
    lg: '3rem',    // 48px
    xl: '4rem',    // 64px
    '2xl': '5rem', // 80px
    '3xl': '6rem', // 96px
  },

  // Container spacing
  container: {
    padding: 'px-4 sm:px-6 lg:px-8',
    maxWidth: 'max-w-7xl mx-auto',
  }
} as const;

// ============================================================================
// SIZE TOKENS
// ============================================================================

export const sizes = {
  // Component sizes
  xs: {
    height: '1.5rem',    // h-6
    padding: '0.25rem 0.5rem', // px-2 py-1
    text: 'text-xs',
    icon: 'w-3 h-3',
  },
  sm: {
    height: '2rem',      // h-8
    padding: '0.375rem 0.75rem', // px-3 py-1.5
    text: 'text-sm',
    icon: 'w-4 h-4',
  },
  md: {
    height: '2.5rem',    // h-10
    padding: '0.5rem 1rem', // px-4 py-2
    text: 'text-sm',
    icon: 'w-5 h-5',
  },
  lg: {
    height: '3rem',      // h-12
    padding: '0.75rem 1.5rem', // px-6 py-3
    text: 'text-base',
    icon: 'w-6 h-6',
  },
  xl: {
    height: '3.5rem',    // h-14
    padding: '1rem 2rem', // px-8 py-4
    text: 'text-lg',
    icon: 'w-8 h-8',
  }
} as const;

// ============================================================================
// BORDER RADIUS TOKENS
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: '0.125rem',  // 2px
  md: '0.375rem',  // 6px
  lg: '0.5rem',    // 8px
  xl: '0.75rem',   // 12px
  '2xl': '1rem',   // 16px
  '3xl': '1.5rem', // 24px
  full: '9999px',
} as const;

// ============================================================================
// SHADOW TOKENS
// ============================================================================

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
} as const;

// ============================================================================
// TRANSITION TOKENS
// ============================================================================

export const transitions = {
  // Duration
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },

  // Timing functions
  timing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    linear: 'linear',
  },

  // Common transition classes
  default: 'transition-all duration-200 ease-out',
  fast: 'transition-all duration-150 ease-out',
  slow: 'transition-all duration-300 ease-out',
  colors: 'transition-colors duration-200 ease-out',
  transform: 'transition-transform duration-200 ease-out',
  opacity: 'transition-opacity duration-200 ease-out',
} as const;

// ============================================================================
// Z-INDEX TOKENS
// ============================================================================

export const zIndex = {
  base: 0,
  raised: 10,
  dropdown: 20,
  sticky: 30,
  overlay: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
  toast: 80,
  max: 9999,
} as const;

// ============================================================================
// FOCUS RING TOKENS
// ============================================================================

export const focusRing = {
  default: 'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2',
  inset: 'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500',
  none: 'focus:outline-none',
} as const;

// ============================================================================
// BREAKPOINT TOKENS
// ============================================================================

export const breakpoints = {
  sm: '640px',
  md: '768px', 
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ============================================================================
// ANIMATION TOKENS
// ============================================================================

export const animations = {
  spin: 'animate-spin',
  ping: 'animate-ping',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
  
  // Custom micro-interactions
  scaleOnHover: 'hover:scale-105 transition-transform duration-200',
  liftOnHover: 'hover:-translate-y-1 transition-transform duration-200',
  glowOnHover: 'hover:shadow-lg transition-shadow duration-200',
} as const;

// ============================================================================
// EXPORTED TOKEN COLLECTIONS
// ============================================================================

export const tokens = {
  colors,
  typography,
  spacing,
  sizes,
  borderRadius,
  shadows,
  transitions,
  zIndex,
  focusRing,
  breakpoints,
  animations,
} as const;

export type DesignTokens = typeof tokens;
export type ColorTokens = typeof colors;
export type TypographyTokens = typeof typography;
export type SpacingTokens = typeof spacing;
export type SizeTokens = typeof sizes;