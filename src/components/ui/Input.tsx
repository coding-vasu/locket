import React, { forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, error, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-[11px] font-bold text-muted uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-dim">
              {icon}
              <span className="h-4 w-px bg-border"></span>
            </div>
          )}
          <input
            ref={ref}
            className={clsx(
              'w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-main',
              'focus:outline-none focus:border-dim focus:ring-1 focus:ring-dim',
              'transition-all placeholder:text-dim',
              icon && 'pl-10',
              error && 'border-red-500',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
