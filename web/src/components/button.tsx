import { Button as BaseUIButton } from '@base-ui/react/button';
import * as React from 'react';

export interface ButtonProps extends React.ComponentPropsWithoutRef<typeof BaseUIButton> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  children,
  className = '',
  ...props
}: ButtonProps) {
  // Flat UI color variants
  const variantStyles = {
    primary: 'bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700',
    secondary: 'bg-gray-700 text-slate-800 hover:bg-slate-300 active:bg-slate-400',
    danger: 'bg-rose-500 text-white hover:bg-rose-600 active:bg-rose-700',
  };

  return (
    <BaseUIButton
      className={`
        inline-flex items-center justify-center gap-2 
        px-4 py-2.5 text-sm font-medium 
        rounded-lg transition-colors duration-150 
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500
        disabled:opacity-50 disabled:pointer-events-none cursor-pointer
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </BaseUIButton>
  );
}