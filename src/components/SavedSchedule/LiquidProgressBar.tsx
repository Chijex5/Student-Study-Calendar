import React, { useEffect, useState, useRef, useCallback } from "react";
import { clamp } from "lodash-es";

type LiquidProgressBarProps = {
  progress: number;
  width?: number;
  height?: number;
  borderColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
  rippleColor?: string;
  className?: string;
};

export const LiquidProgressBar = ({
  progress: targetProgress,
  width = 64,
  height = 192,
  borderColor = "#4A148C",
  gradientFrom = "#9C27B0",
  gradientTo = "#E040FB",
  rippleColor = "#E040FB",
  className = "",
}: LiquidProgressBarProps) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const progressRef = useRef(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [rippleKey, setRippleKey] = useState(0);
  const targetRef = useRef(clamp(targetProgress, 0, 100));

  const animate = useCallback((time: number) => {
    if (previousTimeRef.current === undefined) {
      previousTimeRef.current = time;
    }
    
    const deltaTime = time - previousTimeRef.current;
    if (deltaTime > 16) { // ~60fps
      const progress = progressRef.current;
      const target = targetRef.current;
      const direction = target > progress ? 1 : -1;
      const step = Math.min(Math.abs(target - progress), deltaTime * 0.2);
      
      const newProgress = progress + step * direction;
      progressRef.current = clamp(newProgress, 0, 100);
      setDisplayProgress(Math.round(progressRef.current));

      // Trigger ripple at 5% milestones
      if (Math.floor(progress / 5) !== Math.floor(progressRef.current / 5)) {
        setRippleKey(prev => prev + 1);
      }

      previousTimeRef.current = time;
    }

    if (Math.round(progressRef.current) !== targetRef.current) {
      requestRef.current = requestAnimationFrame(animate);
    }
  }, []);

  useEffect(() => {
    targetRef.current = clamp(targetProgress, 0, 100);
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [targetProgress, animate]);

  return (
    <div 
      className={`relative mx-auto ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
      role="progressbar"
      aria-valuenow={Math.round(displayProgress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* Percentage Display */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-white text-4xl font-bold z-10">
        {Math.round(displayProgress)}%
      </div>

      {/* Container */}
      <div 
        className="relative h-full w-full mx-auto rounded-full border-2 overflow-hidden bg-gray-900/20"
        style={{ 
          borderColor: borderColor,
          marginTop: `${height * 0.25}px` 
        }}
      >
        {/* Liquid Fill */}
        <div
          className="absolute bottom-0 w-full transition-all duration-100 ease-out"
          style={{
            height: `${displayProgress}%`,
            background: `linear-gradient(to top, ${gradientFrom}, ${gradientTo})`,
          }}
        >
          {/* Liquid Surface Animation */}
          <div className="absolute top-0 left-0 w-full h-4 bg-white/30 transform -skew-x-45 animate-wave" />

          {/* Ripple Effect */}
          <div 
            key={rippleKey}
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-16 animate-ripple"
            style={{ borderColor: rippleColor }}
          />
        </div>
      </div>

      <style>{`
        @keyframes wave {
          0% { transform: translateX(0%) skewX(-45deg); }
          100% { transform: translateX(100%) skewX(-45deg); }
        }
        @keyframes ripple {
          0% { 
            opacity: 1;
            transform: translateX(-50%) scale(0);
          }
          100% { 
            opacity: 0;
            transform: translateX(-50%) scale(2);
          }
        }
        .animate-wave {
          animation: wave 2s infinite linear;
        }
        .animate-ripple {
          animation: ripple 1s cubic-bezier(0, 0.2, 0.8, 1);
        }
      `}</style>
    </div>
  );
};