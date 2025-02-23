"use client";

import { Activity } from "@prisma/client";
import { useEffect } from "react";
import { ActivityForm } from "@/components/forms/activity-form";

type ActivityModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: Omit<
      Activity,
      "id" | "userId" | "createdAt" | "updatedAt" | "stravaId"
    >
  ) => void;
  activity?: Activity;
  title: string;
};

export const ActivityModal = ({
  isOpen,
  onClose,
  onSubmit,
  activity,
  title,
}: ActivityModalProps) => {
  // Empêcher le défilement du body quand le modal est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-50 w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-strava-gray-800">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-strava-gray-500 hover:text-strava-gray-700"
          >
            ✕
          </button>
        </div>
        <ActivityForm
          activity={activity}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  );
};
