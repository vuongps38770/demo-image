import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Badge = ({
  status = 'queued',
  className,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center px-2 py-0.5 rounded-none text-[10px] font-bold uppercase tracking-wider border font-mono transition-colors';
  
  const statusStyles = {
    queued: 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-950 dark:text-zinc-500 dark:border-zinc-850',
    processing: 'bg-[#eb0004]/5 text-[#eb0004] border-[#eb0004]/30 dark:bg-[#eb0004]/10 dark:text-red-500 dark:border-red-900/40 animate-pulse',
    completed: 'bg-emerald-500/5 text-emerald-600 border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-900/40',
    failed: 'bg-red-500/5 text-red-600 border-red-500/30 dark:bg-red-950/10 dark:text-red-500 dark:border-red-900/40',
  };

  const statusLabel = {
    queued: 'QUEUED',
    processing: 'RUNNING',
    completed: 'SUCCESS',
    failed: 'FAILED',
  };

  return (
    <span
      className={twMerge(clsx(baseStyles, statusStyles[status] || statusStyles.queued, className))}
      {...props}
    >
      [{statusLabel[status] || status}]
    </span>
  );
};

export default Badge;
