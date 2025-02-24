"use client";

import { Activity } from "@prisma/client";
import { ActivityBadge } from "./activity-badge";

type MonthViewProps = {
  currentDate: Date;
  activities: Activity[];
};

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export const MonthView = ({ currentDate, activities }: MonthViewProps) => {
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Ajuster pour commencer par Lundi (1-7) au lieu de Dimanche (0-6)
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const today = new Date();

  const getActivitiesForDay = (day: number) => {
    return activities.filter((activity) => {
      const activityDate = new Date(activity.date);
      return (
        activityDate.getDate() === day &&
        activityDate.getMonth() === currentDate.getMonth() &&
        activityDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const isToday = (day: number) => {
    return (
      today.getDate() === day &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    );
  };

  return (
    <div className="mt-4">
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-strava-gray-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="aspect-square p-2 bg-strava-gray-50 rounded-lg"
          />
        ))}

        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const dayActivities = getActivitiesForDay(day);

          return (
            <div
              key={day}
              className={`aspect-square p-2 rounded-lg ${
                isToday(day)
                  ? "bg-strava-orange/10 border-2 border-strava-orange"
                  : "bg-white border border-strava-gray-200"
              }`}
            >
              <div className="h-full flex flex-col">
                <span
                  className={`text-sm font-medium mb-1 ${
                    isToday(day) ? "text-strava-orange" : "text-strava-gray-600"
                  }`}
                >
                  {day}
                </span>

                <div className="flex-1 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-strava-gray-200 scrollbar-track-transparent">
                  {dayActivities.length > 0 && (
                    <div className="space-y-1">
                      {dayActivities.map((activity) => (
                        <ActivityBadge key={activity.id} activity={activity} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
