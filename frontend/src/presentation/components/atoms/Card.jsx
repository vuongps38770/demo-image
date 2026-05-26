import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Card = ({
  children,
  className,
  variant = 'default',
  ...props
}) => {
  const baseStyles = 'rounded-none p-5 transition-all duration-150';
  
  const variants = {
    default: 'bg-white border border-black dark:bg-black dark:border-zinc-800 text-black dark:text-zinc-200',
    'accent-blue': 'bg-zinc-50 border border-black dark:bg-black dark:border-red-600 dark:text-red-500',
    'accent-green': 'bg-zinc-50 border border-black dark:bg-black dark:border-zinc-700 dark:text-zinc-300',
    'accent-indigo': 'bg-zinc-50 border border-black dark:bg-black dark:border-zinc-800 dark:text-zinc-400',
  };

  return (
    <div
      className={twMerge(clsx(baseStyles, variants[variant], className))}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
