"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Activity } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";

const activitySchema = z.object({
  type: z.string(),
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional().nullable(),
  distance: z.number().min(0, "La distance doit être positive"),
  duration: z.number().min(0, "La durée doit être positive"),
  date: z.string(),
  isFavorite: z.boolean().default(false),
  trainingLoad: z.number().default(0),
  calories: z.number().default(0),
});

type ActivityFormData = z.infer<typeof activitySchema>;

type ActivityFormProps = {
  onSubmit: (
    data: Omit<
      Activity,
      "id" | "userId" | "createdAt" | "updatedAt" | "stravaId"
    >
  ) => void;
  activity?: Activity;
};

export const ActivityForm = ({ onSubmit, activity }: ActivityFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
    defaultValues: activity
      ? {
          ...activity,
          date: new Date(activity.date).toISOString().split("T")[0],
          description: activity.notes || null,
          distance: activity.distance || 0,
        }
      : {
          type: "RUNNING",
          isFavorite: false,
          date: new Date().toISOString().split("T")[0],
          trainingLoad: 0,
          calories: 0,
          distance: 0,
          description: null,
        },
  });

  const handleFormSubmit = (data: ActivityFormData) => {
    onSubmit({
      ...data,
      notes: data.description || null,
      date: new Date(data.date),
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select
          {...register("type")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-strava-orange focus:ring-strava-orange"
        >
          <option value="RUNNING">Course à pied</option>
          <option value="CYCLING">Vélo</option>
          <option value="SWIMMING">Natation</option>
          <option value="OTHER">Autre</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Titre</label>
        <input
          type="text"
          {...register("title")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-strava-orange focus:ring-strava-orange"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          {...register("description")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-strava-orange focus:ring-strava-orange"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Distance (km)
        </label>
        <input
          type="number"
          step="0.1"
          {...register("distance", { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-strava-orange focus:ring-strava-orange"
        />
        {errors.distance && (
          <p className="mt-1 text-sm text-red-600">{errors.distance.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Durée (minutes)
        </label>
        <input
          type="number"
          {...register("duration", { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-strava-orange focus:ring-strava-orange"
        />
        {errors.duration && (
          <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          {...register("date")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-strava-orange focus:ring-strava-orange"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          {...register("isFavorite")}
          className="h-4 w-4 rounded border-gray-300 text-strava-orange focus:ring-strava-orange"
        />
        <label className="ml-2 block text-sm text-gray-700">
          Marquer comme favori
        </label>
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-strava-orange px-4 py-2 text-white hover:bg-strava-orange/90 focus:outline-none focus:ring-2 focus:ring-strava-orange focus:ring-offset-2"
      >
        {activity ? "Modifier" : "Créer"}
      </button>
    </form>
  );
};
