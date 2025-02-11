import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
export const ScheduleCard = ({
  id,
  name = "Study Schedule #1",
  progress = 65,
  date = "September 1, 2023"
}: {
  id: string;
  name?: string;
  progress?: number;
  date?: string;
}) => {
  const navigate = useNavigate();
  const [ripplePos, setRipplePos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipplePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };
  return <div onClick={() => navigate(`/schedule/${id}`)} className="
        relative overflow-hidden
        backdrop-blur-[10px] 
        bg-white/10 
        border border-white/20
        p-6 rounded-xl 
        transition-all duration-300
        hover:transform hover:-translate-y-2.5
        hover:shadow-lg hover:shadow-[#6A1B9A]/20
        group cursor-pointer
      " onMouseMove={handleMouseMove} onMouseLeave={() => setRipplePos(null)}>
      {ripplePos && <div className="absolute pointer-events-none" style={{
      left: ripplePos.x,
      top: ripplePos.y,
      transform: "translate(-50%, -50%)",
      width: "200px",
      height: "200px",
      background: "radial-gradient(circle, rgba(224,64,251,0.2) 0%, transparent 70%)",
      borderRadius: "50%",
      transition: "all 0.5s ease-out"
    }} />}
      <h3 className="text-white text-xl font-bold mb-2">{name}</h3>
      <p className="text-[#E0B0FF] mb-4">{date}</p>
      <div className="mb-4">
        <div className="h-1 bg-[#4A148C] rounded-full overflow-hidden">
          <div className="h-full bg-[#26A69A] transition-all duration-300" style={{
          width: `${progress}%`
        }} />
        </div>
        <p className="text-[#E0B0FF] text-sm mt-1">{progress}% Complete</p>
      </div>
      <button className="text-white relative inline-block group">
        View Schedule
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#26A69A] transition-all duration-300 group-hover:w-full" />
      </button>
    </div>;
};