// Core UI component types and interfaces

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Variant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost';
export type Color = 'gray' | 'purple' | 'pink' | 'blue' | 'green' | 'yellow' | 'red';

export interface BaseComponentProps {
  class?: string;
  disabled?: boolean;
  id?: string;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onclick?: (event: MouseEvent) => void;
  'aria-label'?: string;
}

export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'url' | 'search' | 'tel' | 'number';
  placeholder?: string;
  value?: string;
  error?: string;
  label?: string;
  required?: boolean;
  readonly?: boolean;
  size?: Size;
  oninput?: (event: Event) => void;
  onchange?: (event: Event) => void;
  onfocus?: (event: FocusEvent) => void;
  onblur?: (event: FocusEvent) => void;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  onClose: () => void;
}

export interface LoadingState {
  loading: boolean;
  error?: string;
  success?: boolean;
}

export interface ProgressProps extends BaseComponentProps {
  value: number;
  max?: number;
  size?: Size;
  color?: Color;
  showLabel?: boolean;
  label?: string;
}

export interface BadgeProps extends BaseComponentProps {
  variant?: Variant;
  size?: Size;
  removable?: boolean;
  onRemove?: () => void;
}

export interface AvatarProps extends BaseComponentProps {
  src?: string;
  alt?: string;
  size?: Size;
  fallback?: string;
  color?: Color;
}