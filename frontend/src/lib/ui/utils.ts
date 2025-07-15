// Design system utilities for consistent styling

import type { Size, Variant, Color } from './types';
import { tokens } from '$lib/design-system/tokens';

// Size mappings using design tokens
export const sizeClasses = {
  xs: {
    text: tokens.sizes.xs.text,
    height: 'h-6',
    icon: tokens.sizes.xs.icon,
    avatar: 'w-6 h-6',
    button: 'px-2 py-1 text-xs',
    input: 'px-2 py-1 text-xs'
  },
  sm: {
    text: tokens.sizes.sm.text,
    height: 'h-8',
    icon: tokens.sizes.sm.icon,
    avatar: 'w-8 h-8',
    button: 'px-3 py-1.5 text-sm',
    input: 'px-3 py-1.5 text-sm'
  },
  md: {
    text: tokens.sizes.md.text,
    height: 'h-10',
    icon: tokens.sizes.md.icon,
    avatar: 'w-10 h-10',
    button: 'px-4 py-2 text-sm',
    input: 'px-3 py-2 text-sm'
  },
  lg: {
    text: tokens.sizes.lg.text,
    height: 'h-12',
    icon: tokens.sizes.lg.icon,
    avatar: 'w-12 h-12',
    button: 'px-6 py-3 text-base',
    input: 'px-4 py-3 text-base'
  },
  xl: {
    text: tokens.sizes.xl.text,
    height: 'h-14',
    icon: tokens.sizes.xl.icon,
    avatar: 'w-14 h-14',
    button: 'px-8 py-4 text-lg',
    input: 'px-4 py-4 text-lg'
  }
};

// Variant color mappings using design tokens
export const variantClasses = {
  primary: {
    button: `bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-transparent shadow-md hover:shadow-lg`,
    badge: `bg-purple-100 text-purple-800 border border-purple-200`,
    text: 'text-purple-600'
  },
  secondary: {
    button: `bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm`,
    badge: `bg-gray-100 text-gray-800 border border-gray-200`,
    text: 'text-gray-600'
  },
  success: {
    button: `bg-green-600 hover:bg-green-700 text-white border-transparent shadow-md`,
    badge: `bg-green-100 text-green-800 border border-green-200`,
    text: 'text-green-600'
  },
  warning: {
    button: `bg-yellow-500 hover:bg-yellow-600 text-white border-transparent shadow-md`,
    badge: `bg-yellow-100 text-yellow-800 border border-yellow-200`,
    text: 'text-yellow-600'
  },
  danger: {
    button: `bg-red-600 hover:bg-red-700 text-white border-transparent shadow-md`,
    badge: `bg-red-100 text-red-800 border border-red-200`,
    text: 'text-red-600'
  },
  ghost: {
    button: `bg-transparent text-gray-700 border-transparent hover:bg-gray-100`,
    badge: `bg-transparent text-gray-600 border border-gray-300`,
    text: 'text-gray-500'
  }
};

// Color mappings for avatars and other elements using design tokens
export const colorClasses = {
  gray: 'bg-gray-500',
  purple: tokens.colors.brand.gradient.primary,
  pink: 'bg-pink-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500'
};

// Progress bar colors using design tokens
export const progressColors = {
  gray: 'bg-gray-600',
  purple: tokens.colors.brand.gradient.primary,
  pink: 'bg-pink-600',
  blue: 'bg-blue-600',
  green: 'bg-green-600',
  yellow: 'bg-yellow-600',
  red: 'bg-red-600'
};

// Common transition classes using design tokens
export const transitions = {
  default: tokens.transitions.default,
  fast: tokens.transitions.fast,
  slow: tokens.transitions.slow,
  colors: tokens.transitions.colors,
  transform: tokens.transitions.transform
};

// Focus ring styles using design tokens
export const focusRing = tokens.focusRing.default;

// Utility function to combine classes
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Get size-specific classes
export function getSizeClasses(size: Size, type: keyof typeof sizeClasses.md): string {
  return sizeClasses[size][type];
}

// Get variant-specific classes
export function getVariantClasses(variant: Variant, type: keyof typeof variantClasses.primary): string {
  return variantClasses[variant][type];
}

// Get color classes
export function getColorClasses(color: Color): string {
  return colorClasses[color];
}

// Get progress color classes
export function getProgressColorClasses(color: Color): string {
  return progressColors[color];
}

// Generate initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Generate unique ID
export function generateId(prefix = 'ui'): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 11)}`;
}