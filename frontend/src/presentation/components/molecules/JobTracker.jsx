import React from 'react';
import ProgressBar from '../atoms/ProgressBar';

export const JobTracker = ({
  progress = 0,
  stepText = 'Processing...',
  status = 'processing'
}) => {
  return (
    <div className="w-full flex flex-col gap-1.5 font-mono">
      <div className="flex justify-between items-center text-[10px] font-bold">
        <span className="text-zinc-500 dark:text-zinc-400 truncate max-w-[80%] uppercase">
          {stepText}
        </span>
        <span className="text-[#eb0004] dark:text-red-500 tabular-nums">
          {Math.round(progress)}%
        </span>
      </div>
      <ProgressBar progress={progress} />
    </div>
  );
};

export default JobTracker;
