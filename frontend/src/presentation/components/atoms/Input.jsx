import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Input = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  className,
  ...props
}) => {
  return (
    <div className={twMerge('w-full flex flex-col gap-1.5', className)}>
      {label && (
        <label
          htmlFor={id}
          className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest pl-0.5 font-mono"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={clsx(
          'w-full px-4 py-3 rounded-none border bg-white dark:bg-black text-black dark:text-white placeholder-zinc-500 font-mono text-xs transition-colors duration-100 focus:outline-none focus:border-[#eb0004] disabled:opacity-50 disabled:pointer-events-none',
          error
            ? 'border-red-650'
            : 'border-black dark:border-zinc-800'
        )}
        {...props}
      />
      {error && (
        <span className="text-[10px] font-bold text-red-500 font-mono pl-0.5 mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
