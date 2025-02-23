"use client";

import { ActivityCard } from "@/components/ui/activity-card";
import { Activity } from "@/types/activity";

const mockFavorites: Activity[] = [
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
  {
    id: "2",
    title: "Séance de musculation",
    date: "2024-02-22",
    type: "musculation",
    duration: 60,
    trainingLoad: 180,
    calories: 300,
    isFavorite: true,
    notes: "Focus sur le haut du corps",
  },
];

export default function FavoritesPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-strava-gray-800 mb-8">Favoris</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockFavorites.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>

      {mockFavorites.length === 0 && (
        <div className="text-center py-12">
          <p className="text-strava-gray-500">
            Aucune activité favorite pour le moment
          </p>
          <p className="text-sm text-strava-gray-400 mt-2">
            Marquez vos activités préférées en cliquant sur l'étoile
          </p>
        </div>
      )}
    </main>
  );
}
