"use client";

import { Activity } from "@prisma/client";
import {
  CircleIcon,
  HeartIcon,
  LightningBoltIcon,
  TargetIcon,
} from "@radix-ui/react-icons";

type ActivityBadgeProps = {
  activity: Activity;
};

const getActivityColor = (type: string) => {
  switch (type) {
    case "RUNNING":
      return "bg-strava-orange text-white";
    case "CYCLING":
      return "bg-blue-500 text-white";
    case "SWIMMING":
      return "bg-cyan-500 text-white";
    default:
      return "bg-green-500 text-white";
  }
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case "RUNNING":
      return <LightningBoltIcon className="w-4 h-4 flex-shrink-0" />;
    case "CYCLING":
      return <CircleIcon className="w-4 h-4 flex-shrink-0" />;
    case "SWIMMING":
      return <HeartIcon className="w-4 h-4 flex-shrink-0" />;
    default:
      return <TargetIcon className="w-4 h-4 flex-shrink-0" />;
  }
};

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours > 0 ? `${hours}h` : ""}${
    remainingMinutes > 0 ? `${remainingMinutes}min` : ""
  }`;
};

export const ActivityBadge = ({ activity }: ActivityBadgeProps) => {
  return (
    <div
      className={`rounded-lg p-2 text-xs shadow-sm hover:shadow-md transition-shadow ${getActivityColor(
        activity.type
      )}`}
    >
      <div className="flex items-center gap-1.5">
        {getActivityIcon(activity.type)}
        <span className="font-medium truncate flex-1">{activity.title}</span>
      </div>
      <div className="mt-1 flex items-center justify-between text-[10px] opacity-90">
        <span>
          {activity.distance ? `${activity.distance.toFixed(1)}km` : "-"}
        </span>
        <span>{formatDuration(activity.duration)}</span>
      </div>
    </div>
  );
};
