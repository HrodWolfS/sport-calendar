"use client";

import { formatDistance, formatDuration } from "@/lib/formatters";
import { Activity } from "@/types/activity";

type ActivityCardProps = {
  activity: Activity;
  onFavoriteToggle?: (id: string) => void;
  className?: string;
};

export const ActivityCard = ({
  activity,
  onFavoriteToggle,
  className = "",
}: ActivityCardProps) => {
  const handleFavoriteClick = () => {
    onFavoriteToggle?.(activity.id);
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-4 border border-strava-gray-200 ${className}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-strava-gray-800">
            {activity.title}
          </h3>
          <p className="text-sm text-strava-gray-500">{activity.date}</p>
        </div>
        <button
          onClick={handleFavoriteClick}
          className="text-strava-gray-400 hover:text-strava-orange"
        >
          {activity.isFavorite ? "★" : "☆"}
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-strava-gray-500">Durée</p>
          <p className="font-medium">{formatDuration(activity.duration)}</p>
        </div>
        {activity.type === "running" && activity.distance && (
          <div>
            <p className="text-sm text-strava-gray-500">Distance</p>
            <p className="font-medium">{formatDistance(activity.distance)}</p>
          </div>
        )}
        <div>
          <p className="text-sm text-strava-gray-500">Charge</p>
          <p className="font-medium">{activity.trainingLoad}</p>
        </div>
        <div>
          <p className="text-sm text-strava-gray-500">Calories</p>
          <p className="font-medium">{activity.calories} kcal</p>
        </div>
      </div>

      {activity.notes && (
        <p className="mt-3 text-sm text-strava-gray-600">{activity.notes}</p>
      )}
    </div>
  );
};
