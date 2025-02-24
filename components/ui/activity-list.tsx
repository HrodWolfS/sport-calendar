"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type StravaActivity = {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  type: string;
  start_date: string;
};

export const ActivityList = () => {
  const { data: session, status } = useSession();
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!session?.user?.accessToken) {
        console.log("Pas de token d'accès");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/strava/activities");
        if (!response.ok) {
          if (response.status === 401) {
            // Token expiré ou invalide
            signIn("strava");
            return;
          }
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Erreur lors de la récupération des activités"
          );
        }

        const data = await response.json();
        setActivities(data);
      } catch (err) {
        console.error("Erreur lors du fetch:", err);
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchActivities();
    }
  }, [session, status]);

  if (status === "loading") {
    return (
      <div className="p-4">
        <p className="text-strava-gray-600">Chargement de la session...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="p-4 bg-strava-gray-100 rounded-lg">
        <p className="text-strava-gray-600">
          Connecte-toi pour voir tes activités
        </p>
        <button
          onClick={() => signIn("strava")}
          className="mt-4 px-4 py-2 bg-strava-orange text-white rounded-md hover:bg-strava-orange/90"
        >
          Se connecter avec Strava
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4">
        <p className="text-strava-gray-600">Chargement des activités...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => signIn("strava")}
          className="mt-4 px-4 py-2 bg-strava-orange text-white rounded-md hover:bg-strava-orange/90"
        >
          Reconnecter avec Strava
        </button>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="p-4 bg-strava-gray-100 rounded-lg">
        <p className="text-strava-gray-600">Aucune activité trouvée</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-strava-gray-800">Mes Activités</h2>
      <div className="space-y-2">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="p-4 bg-white rounded-lg shadow-sm border border-strava-gray-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-strava-gray-800">
                  {activity.name}
                </h3>
                <p className="text-sm text-strava-gray-500">
                  {new Date(activity.start_date).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <span className="text-sm font-medium text-strava-gray-600 bg-strava-gray-100 px-2 py-1 rounded">
                {activity.type}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-strava-gray-500">Distance</p>
                <p className="font-medium">
                  {(activity.distance / 1000).toFixed(1)} km
                </p>
              </div>
              <div>
                <p className="text-sm text-strava-gray-500">Durée</p>
                <p className="font-medium">
                  {Math.round(activity.moving_time / 60)} min
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
