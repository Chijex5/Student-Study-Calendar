import React, { useEffect, useState } from "react";
export const LiquidProgressBar = ({
  progress
}: {
  progress: number;
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [showRipple, setShowRipple] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedProgress(prev => {
        if (prev < progress) {
          if (Math.floor(prev / 5) !== Math.floor((prev + 1) / 5)) {
            setShowRipple(true);
            setTimeout(() => setShowRipple(false), 1000);
          }
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [progress]);
  return <div className="relative w-full h-48">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-white text-4xl font-bold">
        {animatedProgress}%
      </div>
      <div className="relative h-full w-16 mx-auto mt-12 rounded-full border-2 border-[#4A148C] overflow-hidden">
        <div className="absolute bottom-0 w-full transition-all duration-500 ease-out" style={{
        height: `${animatedProgress}%`,
        background: "linear-gradient(to top, #9C27B0, #E040FB)"
      }}>
          {/* Liquid surface effect */}
          <div className="absolute top-0 left-0 w-full h-2 bg-white/30 transform -skew-x-45" />
          {/* Ripple effect */}
          {showRipple && <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-16">
              <div className="absolute inset-0 animate-ripple rounded-full border-2 border-[#E040FB]" />
            </div>}
        </div>
      </div>
    </div>;
};