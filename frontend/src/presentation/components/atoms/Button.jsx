import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-none transition-all duration-150 active:translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none px-5 py-2.5 text-xs sm:text-sm tracking-widest font-mono uppercase';
  
  const variants = {
    primary: 'bg-[#eb0004] hover:bg-[#ff1a1d] text-white border border-[#eb0004] active:bg-[#c00003]',
    secondary: 'bg-white hover:bg-black hover:text-white text-black border border-black dark:bg-black dark:hover:bg-white dark:hover:text-black dark:text-white dark:border-zinc-800',
    accent: 'bg-black text-white border border-zinc-800 hover:bg-[#eb0004] hover:border-[#eb0004] dark:bg-white dark:text-black dark:hover:bg-[#eb0004] dark:hover:text-white',
    danger: 'bg-red-950/20 text-red-500 border border-red-900 hover:bg-red-900 hover:text-white',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={twMerge(clsx(baseStyles, variants[variant], className))}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
