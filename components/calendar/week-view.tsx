"use client";

import { Activity } from "@prisma/client";
import { isSameDay } from "date-fns";
import { ActivityBadge } from "./activity-badge";

type WeekViewProps = {
  days: Date[];
  activities: Activity[];
};

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export const WeekView = ({ days, activities }: WeekViewProps) => {
  return (
    <div className="overflow-x-auto min-w-[800px]">
      <div className="grid grid-cols-[auto_repeat(7,1fr)] gap-1">
        {/* Header */}
        <div className="h-12" /> {/* Empty corner */}
        {DAYS.map((day) => (
          <div
            key={day}
            className="h-12 flex flex-col items-center justify-center text-sm"
          >
            <div className="font-medium">{day}</div>
          </div>
        ))}
        {/* Time grid */}
        {HOURS.map((hour) => (
          <div key={hour} className="contents">
            <div className="py-2 pr-4 text-right text-sm text-muted-foreground">
              {String(hour).padStart(2, "0")}:00
            </div>
            {DAYS.map((day) => {
              const dayActivities = activities.filter(
                (activity) =>
                  isSameDay(new Date(activity.date), day) &&
                  new Date(activity.date).getHours() === hour
              );

              return (
                <div
                  key={`${day}-${hour}`}
                  className="min-h-[4rem] border-t p-1 relative group hover:bg-accent/50 transition-colors"
                >
                  <div className="space-y-1 max-h-full overflow-y-auto">
                    {dayActivities.map((activity) => (
                      <ActivityBadge key={activity.id} activity={activity} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
