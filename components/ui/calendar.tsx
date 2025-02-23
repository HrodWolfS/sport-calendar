"use client";

import { Activity } from "@/types/activity";
import { useState } from "react";

const mockActivities: Activity[] = [
  {
    id: "1",
    title: "Course matinale",
    date: "2024-02-23",
    type: "running",
    duration: 45,
    distance: 7.5,
    trainingLoad: 150,
    calories: 450,
    isFavorite: true,
    notes: "Bonne sensation, rythme régulier",
  },
  // Ajoutez d'autres activités mock si nécessaire
];

type CalendarViewType = "month" | "week";

export const Calendar = () => {
  const [view, setView] = useState<CalendarViewType>("month");
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleViewChange = (newView: CalendarViewType) => {
    setView(newView);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewChange("month")}
            className={`px-4 py-2 rounded-md ${
              view === "month"
                ? "bg-strava-orange text-white"
                : "bg-strava-gray-100 text-strava-gray-600"
            }`}
          >
            Mois
          </button>
          <button
            onClick={() => handleViewChange("week")}
            className={`px-4 py-2 rounded-md ${
              view === "week"
                ? "bg-strava-orange text-white"
                : "bg-strava-gray-100 text-strava-gray-600"
            }`}
          >
            Semaine
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-strava-gray-600 hover:text-strava-orange">
            ←
          </button>
          <h2 className="text-lg font-medium">
            {currentDate.toLocaleDateString("fr-FR", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <button className="text-strava-gray-600 hover:text-strava-orange">
            →
          </button>
        </div>
      </div>

      {view === "month" ? (
        <MonthView currentDate={currentDate} activities={mockActivities} />
      ) : (
        <WeekView currentDate={currentDate} activities={mockActivities} />
      )}
    </div>
  );
};

const MonthView = ({
  currentDate,
  activities,
}: {
  currentDate: Date;
  activities: Activity[];
}) => {
  // Logique pour générer la grille du mois
  return (
    <div className="grid grid-cols-7 gap-1">
      {/* En-têtes des jours */}
      {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
        <div
          key={day}
          className="p-2 text-center text-sm font-medium text-strava-gray-600"
        >
          {day}
        </div>
      ))}

      {/* Cellules des jours */}
      {Array.from({ length: 35 }).map((_, index) => (
        <div
          key={index}
          className="aspect-square p-2 border border-strava-gray-200 hover:bg-strava-gray-50"
        >
          <div className="text-sm text-strava-gray-600">{index + 1}</div>
          {/* Indicateurs d'activités */}
        </div>
      ))}
    </div>
  );
};

const WeekView = ({
  currentDate,
  activities,
}: {
  currentDate: Date;
  activities: Activity[];
}) => {
  return (
    <div className="grid grid-cols-8 gap-1">
      {/* Colonne des heures */}
      <div className="col-span-1">
        {Array.from({ length: 24 }).map((_, hour) => (
          <div
            key={hour}
            className="h-12 text-right pr-2 text-sm text-strava-gray-500"
          >
            {`${hour}:00`}
          </div>
        ))}
      </div>

      {/* Colonnes des jours */}
      {Array.from({ length: 7 }).map((_, dayIndex) => (
        <div key={dayIndex} className="col-span-1">
          {Array.from({ length: 24 }).map((_, hour) => (
            <div
              key={hour}
              className="h-12 border-t border-l border-strava-gray-200 hover:bg-strava-gray-50"
            />
          ))}
        </div>
      ))}
    </div>
  );
};
