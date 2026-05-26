import React, { useState, useRef } from 'react';
import Card from '../atoms/Card';
import Badge from '../atoms/Badge';
import JobTracker from '../molecules/JobTracker';
import { Download, RefreshCw, Layers, Image, Eye, Clock, Maximize2, Trash2 } from 'lucide-react';
import { useJobStore } from '../../store/jobStore';
import { useAuthStore } from '../../store/authStore';

export const JobCard = ({ job, onReusePrompt }) => {
  const { deleteJob } = useJobStore();
  const { user } = useAuthStore();
  const [showFullImage, setShowFullImage] = useState(false);
  const [comparisonSliderVal, setComparisonSliderVal] = useState(50);
  const containerRef = useRef(null);

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this job?')) {
      deleteJob(job.id, user?.username);
    }
  };

  const formatTime = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return '';
    }
  };

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setComparisonSliderVal(pct);
  };

  const isCompleted = job.status === 'completed';
  const isProcessing = job.status === 'processing';
  const isQueued = job.status === 'queued';

  return (
    <Card className="flex flex-col gap-4 rounded-none border border-black dark:border-zinc-800 bg-white dark:bg-black relative group hover:border-[#eb0004] dark:hover:border-red-900/60 transition-all duration-150 shadow-none font-mono">
      {/* Top Header */}
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-zinc-100 dark:bg-zinc-950 text-zinc-550 dark:text-zinc-450 border border-black dark:border-zinc-800 rounded-none">
            {job.type === 'text-to-image' ? <Image size={12} /> : <Layers size={12} />}
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-zinc-800 dark:text-zinc-300 uppercase tracking-widest">
              {job.type === 'text-to-image' ? 'TEXT-TO-IMAGE' : 'ASSET-CHANGE'}
            </span>
            <span className="text-[8px] text-zinc-450 dark:text-zinc-555 flex items-center gap-1 mt-0.5 font-bold">
              <Clock size={8} />
              {formatTime(job.createdAt)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Badge status={job.status} />
          <button
            onClick={handleDelete}
            className="p-1 text-zinc-400 hover:text-[#eb0004] hover:bg-zinc-100 dark:hover:bg-zinc-950 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-805 rounded-none"
            title="Delete Job"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Prompt Display */}
      <p className="text-[10px] font-bold text-zinc-800 dark:text-zinc-350 line-clamp-2 leading-relaxed uppercase">
        "{job.prompt}"
      </p>

      {/* Asset display for asset-change */}
      {job.type === 'asset-change' && job.assetName && (
        <div className="text-[8px] bg-zinc-50 dark:bg-zinc-950/40 p-1.5 rounded-none text-zinc-500 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-800/40 flex items-center gap-1.5 font-bold">
          <span className="font-black text-[#eb0004] uppercase tracking-widest text-[8px]">BASE:</span>
          <span className="truncate">{job.assetName}</span>
        </div>
      )}

      {/* Middle Content: Display Progress or Result */}
      <div className="relative aspect-square w-full rounded-none bg-zinc-100 dark:bg-zinc-950 border border-black dark:border-zinc-850 flex flex-col items-center justify-center overflow-hidden">
        {isCompleted && job.resultUrl ? (
          job.type === 'asset-change' && job.assetImgUrl ? (
            /* Interactive Hover Compare View */
            <div 
              ref={containerRef}
              onMouseMove={handleMouseMove}
              className="relative w-full h-full select-none bg-checkered cursor-crosshair"
            >
              {/* Generated Image (Right layer) */}
              <img
                src={job.resultUrl}
                alt="Generated Outcome"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />

              {/* Base Image (Left layer with slider width clipping) */}
              <div 
                className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-[#eb0004]"
                style={{ width: `${comparisonSliderVal}%` }}
              >
                <img
                  src={job.assetImgUrl}
                  alt="Base Asset"
                  className="absolute inset-y-0 left-0 w-full h-full object-cover max-w-none"
                  style={{ width: containerRef.current?.offsetWidth || '100%', height: '100%' }}
                />
              </div>

              {/* Fullscreen Trigger */}
              <button
                onClick={() => setShowFullImage(true)}
                className="absolute top-2 right-2 bg-white hover:bg-[#eb0004] hover:text-white text-black p-1.5 border border-black z-30 transition-all opacity-0 group-hover:opacity-100"
                title="View Fullscreen"
              >
                <Eye size={12} />
              </button>
            </div>
          ) : (
            /* Standard text-to-image output */
            <>
              <img
                src={job.resultUrl}
                alt="Generated Art"
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.01]"
                loading="lazy"
              />
              {/* Hover Actions overlay */}
              <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-150 backdrop-blur-[1px]">
                <button
                  onClick={() => setShowFullImage(true)}
                  className="p-2 bg-white hover:bg-[#eb0004] hover:text-white text-black rounded-none border border-black transition-all active:translate-y-0.5"
                  title="View Fullscreen"
                >
                  <Eye size={14} />
                </button>
                <a
                  href={job.resultUrl}
                  target="_blank"
                  rel="noreferrer"
                  download={`image-gen-${job.id}.jpg`}
                  className="p-2 bg-white hover:bg-[#eb0004] hover:text-white text-black rounded-none border border-black transition-all active:translate-y-0.5"
                  title="Download Image"
                >
                  <Download size={14} />
                </a>
              </div>
            </>
          )
        ) : (
          /* Running or queued states */
          <div className="w-full h-full p-6 flex flex-col justify-center items-center gap-3 relative bg-gradient-to-tr from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900/40">
            {/* Shimmer skeleton lines in background */}
            <div className="absolute inset-0 bg-shimmer pointer-events-none opacity-20 dark:opacity-10" />
            
            <div className="relative">
              <div className="w-10 h-10 rounded-none border-2 border-black dark:border-zinc-800 border-t-[#eb0004] animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-zinc-455 dark:text-zinc-650 text-[10px] font-bold">
                {isQueued ? '⏳' : '⚙️'}
              </div>
            </div>
            
            <div className="text-center">
              <span className="text-[8px] font-bold text-zinc-450 dark:text-zinc-650 uppercase tracking-widest block">
                {isQueued ? 'QUEUE POSITION' : 'GENERATING ASSET'}
              </span>
              <span className="text-[10px] font-extrabold text-zinc-700 dark:text-zinc-350 mt-1 block uppercase">
                {isQueued ? 'Awaiting GPU slot' : 'AI Studio Runner'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Progress Tracker (If Active) */}
      {(isQueued || isProcessing) && (
        <div className="mt-1">
          <JobTracker
            progress={job.progress}
            stepText={job.stepText}
            status={job.status}
          />
        </div>
      )}

      {/* Card Actions (Footer) */}
      {isCompleted && (
        <div className="grid grid-cols-2 gap-2 mt-1 pt-3 border-t border-black dark:border-zinc-800">
          <button
            onClick={() => onReusePrompt(job.prompt)}
            className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-none text-[8px] font-bold bg-zinc-150 hover:bg-black hover:text-white dark:bg-zinc-950 dark:hover:bg-white dark:hover:text-black text-black dark:text-zinc-400 transition-colors border border-black dark:border-zinc-800 uppercase tracking-widest font-mono"
          >
            <RefreshCw size={10} />
            REUSE
          </button>
          <a
            href={job.resultUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-none text-[8px] font-bold bg-[#eb0004]/10 hover:bg-[#eb0004] hover:text-white border border-[#eb0004]/30 text-[#eb0004] hover:border-[#eb0004] transition-colors uppercase tracking-widest font-mono"
          >
            <Download size={10} />
            DOWNLOAD
          </a>
        </div>
      )}

      {/* Image Lightbox Modal with hover comparison */}
      {showFullImage && (
        <LightboxModal
          baseImg={job.assetImgUrl}
          resultImg={job.resultUrl}
          onClose={() => setShowFullImage(false)}
        />
      )}
    </Card>
  );
};

/* Full-screen Lightbox with Hover Compare support */
const LightboxModal = ({ baseImg, resultImg, onClose }) => {
  const [val, setVal] = useState(50);
  const boxRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!boxRef.current) return;
    const rect = boxRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setVal(pct);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-8 animate-fade-in"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white text-3xl font-light hover:text-[#eb0004] transition-colors z-50 font-mono"
        onClick={onClose}
      >
        &times;
      </button>
      
      <div 
        ref={boxRef}
        onMouseMove={handleMouseMove}
        className="relative max-w-4xl w-full aspect-square md:h-[80vh] md:w-auto border border-white/10 bg-checkered cursor-crosshair overflow-hidden select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Result Image */}
        <img
          src={resultImg}
          alt="Generated Preview"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />

        {/* Base Image Overlay */}
        {baseImg && (
          <div
            className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-[#eb0004] pointer-events-none"
            style={{ width: `${val}%` }}
          >
            <img
              src={baseImg}
              alt="Base Preview"
              className="absolute inset-y-0 left-0 h-full object-contain max-w-none"
              style={{ width: boxRef.current?.offsetWidth || '100%', height: '100%' }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default JobCard;
