export interface SavedSchedule {
  id: string;
  name: string;
  subjects: string[];
  startDate: string;
  endDate: string;
  createdAt: string;
  scheduleData: {
    date: string;
    subject: string;
  }[];
}
export const saveSchedule = (schedule: Omit<SavedSchedule, 'id' | 'createdAt'>) => {
  const schedules = getSavedSchedules();
  const newSchedule: SavedSchedule = {
    ...schedule,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  localStorage.setItem('schedules', JSON.stringify([...schedules, newSchedule]));
  return newSchedule;
};
export const getSavedSchedules = (): SavedSchedule[] => {
  const schedules = localStorage.getItem('schedules');
  return schedules ? JSON.parse(schedules) : [];
};
export const generateSchedule = (subjects: string[], startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const scheduleData: {
    date: string;
    subject: string;
  }[] = [];
  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    // Skip weekends
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      scheduleData.push({
        date: date.toISOString().split('T')[0],
        subject: subjects[Math.floor(Math.random() * subjects.length)]
      });
    }
  }
  return scheduleData;
};