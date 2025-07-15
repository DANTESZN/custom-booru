<script lang="ts">
  import { cn, transitions } from './utils';
  import { tokens } from '$lib/design-system/tokens';

  let {
    variant = 'default',
    padding = 'md',
    shadow = 'sm',
    border = true,
    hover = false,
    clickable = false,
    class: className = '',
    onclick,
    children,
    ...restProps
  }: {
    variant?: 'default' | 'outlined' | 'elevated' | 'ghost';
    padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    shadow?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    border?: boolean;
    hover?: boolean;
    clickable?: boolean;
    class?: string;
    onclick?: (event: MouseEvent) => void;
    children?: any;
  } = $props();

  const cardClasses = $derived(() => {
    const baseClasses = `rounded-lg ${tokens.colors.glass.white} ${tokens.colors.glass.backdrop}`;
    
    const variantClasses = {
      default: tokens.colors.glass.white,
      outlined: `${tokens.colors.glass.white} border-2 ${tokens.colors.glass.border}`,
      elevated: `${tokens.colors.glass.whiteStrong} shadow-lg`,
      ghost: 'bg-transparent'
    }[variant];

    const paddingClasses = {
      none: '',
      xs: 'p-2',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8'
    }[padding];

    const shadowClasses = shadow !== 'none' ? {
      xs: 'shadow-xs',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl'
    }[shadow] : '';

    const borderClasses = border && variant === 'default' ? `border ${tokens.colors.glass.border}` : '';
    
    const interactiveClasses = clickable || onclick ? 'cursor-pointer' : '';
    
    const hoverClasses = hover || clickable || onclick ? 
      `${tokens.animations.liftOnHover} ${tokens.animations.glowOnHover} active:scale-[0.98]` : '';

    return cn(
      baseClasses,
      variantClasses,
      paddingClasses,
      shadowClasses,
      borderClasses,
      interactiveClasses,
      hoverClasses,
      transitions.default,
      className
    );
  });

  function handleClick(event: MouseEvent) {
    if (clickable || onclick) {
      onclick?.(event);
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if ((clickable || onclick) && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      handleClick(event as any);
    }
  }
</script>

<div
  class={cardClasses}
  onclick={handleClick}
  onkeydown={handleKeydown}
  role={clickable || onclick ? 'button' : undefined}
  tabindex={clickable || onclick ? 0 : undefined}
  {...restProps}
>
  {@render children?.()}
</div>