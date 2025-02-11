import React from "react";
export const DateSelection = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  error
}: {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  error: string;
}) => {
  return <div className="space-y-6">
      <h2 className="text-2xl text-white font-bold mb-6">Set Study Duration</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-[#E0B0FF] mb-2">Start Date</label>
          <input type="date" value={startDate} onChange={e => onStartDateChange(e.target.value)} min={new Date().toISOString().split("T")[0]} className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border-2 border-[#4A148C] focus:border-[#E040FB] outline-none" />
        </div>
        <div>
          <label className="block text-[#E0B0FF] mb-2">End Date</label>
          <input type="date" value={endDate} onChange={e => onEndDateChange(e.target.value)} min={startDate || new Date().toISOString().split("T")[0]} className={`w-full px-4 py-3 rounded-lg bg-white/10 text-white border-2 ${error ? "border-[#FF6B6B] animate-pulse" : "border-[#4A148C]"} focus:border-[#E040FB] outline-none`} />
        </div>
        {error && <p className="text-[#FF6B6B] text-sm">{error}</p>}
      </div>
    </div>;
};