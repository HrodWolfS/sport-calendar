"use client";

import { useActivities } from "@/lib/hooks/useActivities";
import { Activity } from "@prisma/client";
import { useEffect, useState } from "react";
import { CalendarHeader } from "./calendar-header";
import { MonthView } from "./month-view";
import { WeekView } from "./week-view";

type ViewMode = "month" | "week";

export const Calendar = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const { activities, loading, error, fetchActivities } = useActivities();

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handlePrevious = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (viewMode === "month") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setDate(prev.getDate() - 7);
      }
      return newDate;
    });
  };

  const handleNext = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (viewMode === "month") {
        newDate.setMonth(prev.getMonth() + 1);
      } else {
        newDate.setDate(prev.getDate() + 7);
      }
      return newDate;
    });
  };

  const filterActivitiesByDateRange = (start: Date, end: Date): Activity[] => {
    if (!activities) return [];
    return activities.filter((activity) => {
      const activityDate = new Date(activity.date);
      return activityDate >= start && activityDate <= end;
    });
  };

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-strava-gray-800">Calendrier</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-strava-gray-200 p-6">
        <CalendarHeader
          currentDate={currentDate}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />

        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <p className="text-strava-gray-600">Chargement...</p>
          </div>
        ) : viewMode === "month" ? (
          <MonthView
            currentDate={currentDate}
            activities={filterActivitiesByDateRange(
              new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
              new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
            )}
          />
        ) : (
          <WeekView
            currentDate={currentDate}
            activities={filterActivitiesByDateRange(
              new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate() - currentDate.getDay() + 1
              ),
              new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate() + (7 - currentDate.getDay())
              )
            )}
          />
        )}
      </div>
    </div>
  );
};
