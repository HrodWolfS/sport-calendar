"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

type ViewMode = "month" | "week";

type CalendarHeaderProps = {
  currentDate: Date;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onPrevious: () => void;
  onNext: () => void;
};

const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

export const CalendarHeader = ({
  currentDate,
  viewMode,
  onViewModeChange,
  onPrevious,
  onNext,
}: CalendarHeaderProps) => {
  const formatDate = () => {
    if (viewMode === "month") {
      return `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    } else {
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() - currentDate.getDay() + 1);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      if (weekStart.getMonth() === weekEnd.getMonth()) {
        return `${weekStart.getDate()} - ${weekEnd.getDate()} ${
          MONTHS[weekStart.getMonth()]
        } ${weekStart.getFullYear()}`;
      } else if (weekStart.getFullYear() === weekEnd.getFullYear()) {
        return `${weekStart.getDate()} ${
          MONTHS[weekStart.getMonth()]
        } - ${weekEnd.getDate()} ${
          MONTHS[weekEnd.getMonth()]
        } ${weekStart.getFullYear()}`;
      } else {
        return `${weekStart.getDate()} ${
          MONTHS[weekStart.getMonth()]
        } ${weekStart.getFullYear()} - ${weekEnd.getDate()} ${
          MONTHS[weekEnd.getMonth()]
        } ${weekEnd.getFullYear()}`;
      }
    }
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-strava-gray-800">
          {formatDate()}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevious}
            className="p-1 rounded-full hover:bg-strava-gray-100"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button
            onClick={onNext}
            className="p-1 rounded-full hover:bg-strava-gray-100"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-strava-gray-100 p-1 rounded-lg">
        <button
          onClick={() => onViewModeChange("month")}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            viewMode === "month"
              ? "bg-white text-strava-gray-800 shadow-sm"
              : "text-strava-gray-600 hover:text-strava-gray-800"
          }`}
        >
          Mois
        </button>
        <button
          onClick={() => onViewModeChange("week")}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            viewMode === "week"
              ? "bg-white text-strava-gray-800 shadow-sm"
              : "text-strava-gray-600 hover:text-strava-gray-800"
          }`}
        >
          Semaine
        </button>
      </div>
    </div>
  );
};
