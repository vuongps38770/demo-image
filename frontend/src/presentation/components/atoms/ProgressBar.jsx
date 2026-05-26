import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const ProgressBar = ({
  progress = 0,
  height = 'h-2',
  className,
  ...props
}) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div
      className={twMerge(
        clsx(
          'w-full bg-zinc-100 dark:bg-zinc-950 rounded-none border border-black dark:border-zinc-800 overflow-hidden',
          height,
          className
        )
      )}
      {...props}
    >
      <div
        className="h-full bg-[#eb0004] transition-all duration-300 ease-out"
        style={{ width: `${clampedProgress}%` }}
      />
    </div>
  );
};

export default ProgressBar;
