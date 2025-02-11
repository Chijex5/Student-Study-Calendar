import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TodayTaskCard } from "./TodayTaskCard";
import { LiquidProgressBar } from "./LiquidProgressBar";
import { ViewToggle } from "./ViewToggle";
import { getSavedSchedules, SavedSchedule } from "../../utils/scheduleStorage";
type ViewType = "daily" | "weekly" | "monthly";
export const SavedSchedulePage = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const [schedule, setSchedule] = useState<SavedSchedule | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>("daily");
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const schedules = getSavedSchedules();
    const found = schedules.find(s => s.id === id);
    if (found) {
      setSchedule(found);
      // Calculate progress
      const completed = found.scheduleData.filter(item => new Date(item.date) < new Date()).length;
      setProgress(Math.round(completed / found.scheduleData.length * 100));
    }
  }, [id]);
  if (!schedule) return null;
  const today = new Date().toISOString().split("T")[0];
  const todayTask = schedule.scheduleData.find(item => item.date === today);
  const nextTask = schedule.scheduleData.find(item => new Date(item.date) > new Date(today));
  return <main className="min-h-screen w-full bg-[#2D0A54] px-4 py-8 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-white text-3xl font-bold mb-8">{schedule.name}</h1>
        <ViewToggle currentView={currentView} onViewChange={setCurrentView} />
        <div className="grid gap-8 md:grid-cols-2">
          {todayTask && <TodayTaskCard subject={todayTask.subject} nextSubject={nextTask?.subject || "No upcoming tasks"} onComplete={() => {
          // Handle completion
          setProgress(prev => Math.min(prev + 5, 100));
        }} />}
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6">
            <h2 className="text-[#E040FB] text-xl font-bold mb-4">
              Overall Progress
            </h2>
            <LiquidProgressBar progress={progress} />
          </div>
        </div>
      </div>
    </main>;
};