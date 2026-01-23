import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-semibold transition-all active:scale-95';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primaryHover shadow-lg shadow-primary/20',
    secondary: 'bg-surface border border-border text-muted hover:bg-surfaceHighlight hover:text-main hover:border-zinc-500',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    ghost: 'text-muted hover:text-main hover:bg-surfaceHighlight/50',
  };
  
  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-3',
  };
  
  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
