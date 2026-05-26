import React, { useEffect, useRef } from 'react';
import { useCursorStore } from '../../store/cursorStore';

export const CursorFollower = () => {
  const { isEnabled } = useCursorStore();
  const dotRef = useRef(null);
  const circleRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (!isEnabled) return;

    const onMouseMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }

      if (circleRef.current) {
        // Adding a slight delay via CSS transitions for a spring effect
        circleRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
    };

    const onMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      const isInteractive = target.closest('button, a, input, textarea, [role="button"], img, [data-interactive]');
      if (isInteractive && circleRef.current) {
        circleRef.current.classList.add('w-12', 'h-12', 'bg-[#eb0004]/10', 'border-[#eb0004]');
        circleRef.current.classList.remove('w-8', 'h-8');
        
        if (textRef.current) {
          textRef.current.style.opacity = '1';
          if (isInteractive.tagName === 'IMG') {
            textRef.current.textContent = 'VIEW';
          } else if (isInteractive.closest('aside')) {
            textRef.current.textContent = 'SET';
          } else {
            textRef.current.textContent = 'RUN';
          }
        }
      }
    };

    const onMouseOut = (e) => {
      const target = e.target;
      if (!target) return;

      const isInteractive = target.closest('button, a, input, textarea, [role="button"], img, [data-interactive]');
      if (isInteractive && circleRef.current) {
        circleRef.current.classList.remove('w-12', 'h-12', 'bg-[#eb0004]/10');
        circleRef.current.classList.add('w-8', 'h-8');
        
        if (textRef.current) {
          textRef.current.style.opacity = '0';
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    window.addEventListener('mouseout', onMouseOut);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mouseout', onMouseOut);
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <>
      {/* Outer Follower Circle (Lagging/Spring Effect) */}
      <div
        ref={circleRef}
        className="w-8 h-8 border border-[#eb0004] rounded-full fixed top-0 left-0 -ml-4 -mt-4 pointer-events-none z-[99998] flex items-center justify-center transition-all duration-100 ease-out"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      >
        <span
          ref={textRef}
          className="text-[7px] font-bold text-[#eb0004] font-mono tracking-wider opacity-0 transition-opacity duration-150 select-none"
        >
          RUN
        </span>
      </div>

      {/* Inner Dot pointer (Instant tracking) */}
      <div
        ref={dotRef}
        className="w-1.5 h-1.5 bg-[#eb0004] rounded-full fixed top-0 left-0 -ml-0.75 -mt-0.75 pointer-events-none z-[99999]"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      />
    </>
  );
};

export default CursorFollower;
