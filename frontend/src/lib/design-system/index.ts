/**
 * CustomBooru Design System
 * 
 * A comprehensive design system providing design tokens, utilities,
 * and guidelines for consistent UI development.
 */

// Export design tokens
export { tokens } from './tokens';
export type { 
  DesignTokens, 
  ColorTokens, 
  TypographyTokens, 
  SpacingTokens, 
  SizeTokens 
} from './tokens';

// Re-export commonly used token collections for convenience
export { 
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
  animations
} from './tokens';

// Version and metadata
export const DESIGN_SYSTEM_VERSION = '1.0.0';
export const DESIGN_SYSTEM_NAME = 'CustomBooru Design System';

/**
 * Design system configuration and theme provider
 */
export interface DesignSystemConfig {
  /** Custom color overrides */
  colors?: Partial<typeof colors>;
  /** Custom spacing overrides */
  spacing?: Partial<typeof spacing>;
  /** Custom typography overrides */
  typography?: Partial<typeof typography>;
  /** Enable/disable specific features */
  features?: {
    glassMorphism?: boolean;
    animations?: boolean;
    responsiveScale?: boolean;
  };
}

/**
 * Default design system configuration
 */
export const defaultConfig: DesignSystemConfig = {
  features: {
    glassMorphism: true,
    animations: true,
    responsiveScale: true,
  }
};

/**
 * Utility function to create custom theme configuration
 * 
 * @param config - Custom configuration overrides
 * @returns Merged configuration with defaults
 */
export function createTheme(config: DesignSystemConfig = {}): DesignSystemConfig {
  return {
    ...defaultConfig,
    ...config,
    features: {
      ...defaultConfig.features,
      ...config.features,
    },
  };
}

/**
 * Design system constants for internal use
 */
export const CONSTANTS = {
  // Base sizing unit (4px)
  BASE_UNIT: 4,
  
  // Default animation duration
  DEFAULT_TRANSITION: '200ms',
  
  // Default focus ring offset
  FOCUS_OFFSET: '2px',
  
  // Glass morphism opacity values
  GLASS_OPACITY: {
    SUBTLE: 0.8,
    MEDIUM: 0.85,
    STRONG: 0.9,
  },
  
  // Z-index scale
  Z_INDEX_SCALE: {
    DROPDOWN: 20,
    STICKY: 30,
    OVERLAY: 40,
    MODAL: 50,
    POPOVER: 60,
    TOOLTIP: 70,
    TOAST: 80,
  },
} as const;

/**
 * Breakpoint helper functions
 */
export const breakpointHelpers = {
  /**
   * Check if current viewport matches a breakpoint
   * @param breakpoint - Breakpoint name
   * @returns Boolean indicating if breakpoint matches
   */
  matches: (breakpoint: keyof typeof breakpoints): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(`(min-width: ${breakpoints[breakpoint]})`).matches;
  },
  
  /**
   * Get all matching breakpoints for current viewport
   * @returns Array of matching breakpoint names
   */
  getMatching: (): (keyof typeof breakpoints)[] => {
    if (typeof window === 'undefined') return [];
    
    return (Object.keys(breakpoints) as (keyof typeof breakpoints)[])
      .filter(bp => breakpointHelpers.matches(bp));
  },
  
  /**
   * Get the largest matching breakpoint
   * @returns Largest matching breakpoint name
   */
  getCurrent: (): keyof typeof breakpoints | null => {
    const matching = breakpointHelpers.getMatching();
    return matching.length > 0 ? matching[matching.length - 1] : null;
  },
};

/**
 * Color utility functions
 */
export const colorHelpers = {
  /**
   * Get semantic color for a given variant
   * @param variant - Color variant name
   * @returns Color value
   */
  getSemanticColor: (variant: 'success' | 'warning' | 'error' | 'info'): string => {
    return colors.semantic[variant][500];
  },
  
  /**
   * Get brand gradient CSS string
   * @param direction - Gradient direction
   * @returns CSS gradient string
   */
  getBrandGradient: (direction: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-br' | 'to-tr' = 'to-r'): string => {
    const directionMap = {
      'to-r': 'to right',
      'to-l': 'to left', 
      'to-t': 'to top',
      'to-b': 'to bottom',
      'to-br': 'to bottom right',
      'to-tr': 'to top right',
    };
    
    return `linear-gradient(${directionMap[direction]}, ${colors.brand.primary[500]}, ${colors.brand.secondary[500]})`;
  },
};

/**
 * Responsive design helpers
 */
export const responsiveHelpers = {
  /**
   * Generate responsive class string
   * @param base - Base class
   * @param responsive - Responsive overrides
   * @returns Combined class string
   */
  responsive: (
    base: string, 
    responsive: Partial<Record<keyof typeof breakpoints, string>> = {}
  ): string => {
    const classes = [base];
    
    Object.entries(responsive).forEach(([bp, className]) => {
      if (className) {
        classes.push(`${bp}:${className}`);
      }
    });
    
    return classes.join(' ');
  },
  
  /**
   * Generate responsive spacing class
   * @param property - CSS property (p, m, px, py, etc.)
   * @param values - Responsive values
   * @returns Responsive class string
   */
  spacing: (
    property: string,
    values: {
      base: number | string;
      sm?: number | string;
      md?: number | string;
      lg?: number | string;
      xl?: number | string;
    }
  ): string => {
    const classes = [`${property}-${values.base}`];
    
    (['sm', 'md', 'lg', 'xl'] as const).forEach(bp => {
      if (values[bp] !== undefined) {
        classes.push(`${bp}:${property}-${values[bp]}`);
      }
    });
    
    return classes.join(' ');
  },
};

/**
 * Design system validation helpers
 */
export const validators = {
  /**
   * Validate if a color exists in the design system
   * @param color - Color value to validate
   * @returns Boolean indicating if color is valid
   */
  isValidColor: (color: string): boolean => {
    // This is a simplified validation - in a real implementation,
    // you might want to check against all defined colors
    return color.startsWith('#') || color.startsWith('rgb') || color.startsWith('hsl');
  },
  
  /**
   * Validate if a spacing value follows the design system grid
   * @param value - Spacing value in pixels
   * @returns Boolean indicating if value is on grid
   */
  isOnSpacingGrid: (value: number): boolean => {
    return value % CONSTANTS.BASE_UNIT === 0;
  },
  
  /**
   * Validate component props against design system constraints
   * @param props - Component props to validate
   * @returns Validation result with warnings
   */
  validateProps: (props: Record<string, any>): { valid: boolean; warnings: string[] } => {
    const warnings: string[] = [];
    
    // Example validations
    if (props.size && !['xs', 'sm', 'md', 'lg', 'xl'].includes(props.size)) {
      warnings.push(`Invalid size "${props.size}". Use design system sizes: xs, sm, md, lg, xl`);
    }
    
    if (props.variant && !['primary', 'secondary', 'success', 'warning', 'danger', 'ghost'].includes(props.variant)) {
      warnings.push(`Invalid variant "${props.variant}". Use design system variants.`);
    }
    
    return {
      valid: warnings.length === 0,
      warnings,
    };
  },
};

/**
 * Export everything for convenient access
 */
export default {
  tokens,
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
  helpers: {
    breakpoint: breakpointHelpers,
    color: colorHelpers,
    responsive: responsiveHelpers,
    validators,
  },
  constants: CONSTANTS,
  version: DESIGN_SYSTEM_VERSION,
  name: DESIGN_SYSTEM_NAME,
  createTheme,
  defaultConfig,
};