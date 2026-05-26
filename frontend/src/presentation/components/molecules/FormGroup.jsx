import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const FormGroup = ({
  label,
  error,
  hint,
  children,
  className,
  ...props
}) => {
  return (
    <div className={twMerge('w-full flex flex-col gap-1.5', className)} {...props}>
      {label && (
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">
          {label}
        </span>
      )}
      {children}
      {hint && !error && (
        <span className="text-xs text-slate-400 dark:text-slate-500 pl-1 mt-0.5">
          {hint}
        </span>
      )}
      {error && (
        <span className="text-xs text-red-500 pl-1 mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
};

export default FormGroup;
