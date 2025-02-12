import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TodayTaskCard } from "./TodayTaskCard";
import { LiquidProgressBar } from "./LiquidProgressBar";
import { ViewToggle } from "./ViewToggle";
import { getSavedSchedules, SavedSchedule } from "../../utils/scheduleStorage";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ViewType = "daily" | "weekly" | "monthly";

// Helper function to get week days
const getWeekDates = (date: Date): Date[] => {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
  return Array(7).fill(null).map((_, i) => {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    return day;
  });
};

// Helper function to get month days
const getMonthDates = (date: Date): Date[] => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const days = [];
  let current = new Date(start);
  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
};

export const SavedSchedulePage = () => {
  const { id } = useParams<{ id: string }>();
  const [schedule, setSchedule] = useState<SavedSchedule | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>("daily");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const schedules = getSavedSchedules();
    const found = schedules.find(s => s.id === id);
    if (found) {
      setSchedule(found);
      const completed = found.scheduleData.filter(item => new Date(item.date) < new Date()).length;
      setProgress(Math.round(completed / found.scheduleData.length * 100));
    }
  }, [id]);

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    setCurrentDate(new Date()); // Reset to current date when changing views
  };

  const CurrentMonth = currentDate.toLocaleDateString('en-US', { month: 'long' });
  
  const handleDateNavigation = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    const modifier = direction === "prev" ? -1 : 1;
    
    switch(currentView) {
      case "daily":
        newDate.setDate(newDate.getDate() + modifier);
        break;
      case "weekly":
        newDate.setDate(newDate.getDate() + (modifier * 7));
        break;
      case "monthly":
        newDate.setMonth(newDate.getMonth() + modifier);
        break;
    }
    setCurrentDate(newDate);
  };

  const renderDailyView = () => {
    const dateStr = currentDate.toISOString().split("T")[0];
    const tasks = schedule?.scheduleData.filter(item => item.date === dateStr) || [];
    const isToday = currentDate.toDateString() === new Date().toDateString();

    return (
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-xl font-bold">
            {currentDate.toLocaleDateString()}
          </h2>
          {isToday && <span className="bg-green-500 text-white px-2 py-1 rounded">Today</span>}
        </div>
        
        {tasks.map((task, i) => (
          <TodayTaskCard 
            key={i}
            subject={task.subject}
            isToday={isToday}
            onComplete={() => setProgress(prev => Math.min(prev + 5, 100))}
          />
        ))}
      </div>
    );
  };

  const renderWeeklyView = () => {
    const weekDays = getWeekDates(currentDate);
    const today = new Date();

    return (
      <div className="mt-8">
        <h2 className="text-white text-xl font-bold mb-4">
          Week of {weekDays[0].toLocaleDateString()} - {weekDays[6].toLocaleDateString()}
        </h2>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((date, i) => {
            const dateStr = date.toISOString().split("T")[0];
            const tasks = schedule?.scheduleData.filter(item => item.date === dateStr) || [];
            const isToday = date.toDateString() === today.toDateString();

            return (
              <div key={i} className={`p-2 rounded ${isToday ? 'bg-purple-500/20' : 'bg-white/5'}`}>
                <div className="text-white text-sm mb-1">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-[#E0B0FF] text-xs">
                  {tasks.map((task, j) => (
                    <div key={j} className="truncate">{task.subject}</div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthlyView = () => {
    const monthDays = getMonthDates(currentDate);
    const today = new Date();

    return (
      <div className="mt-8">
        <h2 className="text-white text-xl font-bold mb-4">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="grid grid-cols-7 gap-1">
          {monthDays.map((date, i) => {
            const dateStr = date.toISOString().split("T")[0];
            const tasks = schedule?.scheduleData.filter(item => item.date === dateStr) || [];
            const isToday = date.toDateString() === today.toDateString();

            return (
              <div 
                key={i} 
                className={`min-h-[80px] p-1 text-sm ${isToday ? 'bg-purple-500/30' : 'bg-white/5'}`}
              >
                <div className="text-white">{date.getDate()}</div>
                <div className="text-[#E0B0FF] text-xs">
                  {tasks.map((task, j) => (
                    <div key={j} className="truncate">{task.subject}</div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (!schedule) return null;

  return (
    <main className="min-h-screen w-full bg-[#2D0A54] px-4 py-8 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-white text-3xl font-bold">{schedule.name}</h1>
          <ViewToggle currentView={currentView} onViewChange={handleViewChange} />
        </div>

        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => handleDateNavigation("prev")}
            className="text-white hover:text-[#E040FB] transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => setCurrentDate(new Date())}
            className="text-white hover:text-[#E040FB] transition-colors"
          >
            {`${currentView === "daily"? "Today" : currentView === "weekly"? "This Week" : currentView === "monthly"? "This Month" : " "}`}
          </button>
          <button 
            onClick={() => handleDateNavigation("next")}
            className="text-white hover:text-[#E040FB] transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {currentView === "daily" && renderDailyView()}
          {currentView === "weekly" && renderWeeklyView()}
          {currentView === "monthly" && renderMonthlyView()}
          
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6">
            <h2 className="text-[#E040FB] text-xl font-bold mb-4">
              Overall Progress
            </h2><LiquidProgressBar 
              progress={75}
              width={100}
              height={200}
              gradientFrom="#3f51b5"
              gradientTo="#2196f3"
              rippleColor="#2196f3"
              className="my-4"
            /><LiquidProgressBar progress={progress} />
          </div>
        </div>
      </div>
    </main>
  );
};