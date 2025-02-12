import React, { useState } from "react";
import { CalendarHeader } from "./CalendarHeader";
import { SubjectTag } from "./SubjectTag";
import { ActionButtons } from "./ActionButtons";
const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const GeneratedCalendar = ({
  scheduleData,
  onSave,
  onRegenerate
}: {
  scheduleData: {
    date: string;
    subject: string;
  }[];
  onSave: () => void;
  onRegenerate: () => void;
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const getDaysInMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const days = [];
    const firstDayOfWeek = firstDay.getDay() || 7;
    for (let i = 1; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(date.getFullYear(), date.getMonth(), i));
    }
    return days;
  };
  const getScheduleForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return scheduleData.find(item => item.date === dateStr);
  };
  const isToday = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };
  return <div>
      <h2 className="text-2xl text-white font-bold mb-6">
        Preview Your Schedule
      </h2>
      <CalendarHeader currentMonth={currentMonth} onMonthChange={setCurrentMonth} />
      <div className="grid grid-cols-7 mb-4">
        {daysOfWeek.map(day => <div key={day} className="text-[#E0B0FF] text-center font-medium">
            {day}
          </div>)}
      </div>
      <div className="grid grid-cols-7 gap-2 mb-6">
        {getDaysInMonth(currentMonth).map((date, index) => {
        const scheduleItem = date ? getScheduleForDate(date) : null;
        return <div key={index} className={`
                aspect-square p-2 rounded-lg
                ${date ? "bg-[#4A148C]" : "bg-transparent"}
                ${isToday(date!) ? "ring-2 ring-[#E040FB]" : ""}
              `}>
              {date && <>
                  <div className="text-white mb-2">{date.getDate()}</div>
                  {scheduleItem && <div className="space-y-1">
                      <SubjectTag subject={scheduleItem.subject} />
                    </div>}
                </>}
            </div>;
      })}
      </div>
      <ActionButtons onSave={onSave} onRegenerate={onRegenerate} />
    </div>;
};