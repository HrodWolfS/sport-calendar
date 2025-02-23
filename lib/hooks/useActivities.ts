import { Activity } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useCallback, useState } from "react";

type ActivityFilters = {
  type?: string;
  startDate?: string;
  endDate?: string;
  isFavorite?: boolean;
};

type Stats = {
  monthly: {
    totalDuration: number;
    totalDistance: number;
    totalCalories: number;
    activityCount: number;
  };
  total: {
    totalDuration: number;
    totalDistance: number;
    totalCalories: number;
    activityCount: number;
  };
};

export const useActivities = () => {
  const { data: session } = useSession();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(
    async (filters?: ActivityFilters) => {
      if (!session?.user) return;

      setLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams();
        if (filters?.type) queryParams.set("type", filters.type);
        if (filters?.startDate) queryParams.set("startDate", filters.startDate);
        if (filters?.endDate) queryParams.set("endDate", filters.endDate);
        if (filters?.isFavorite !== undefined)
          queryParams.set("isFavorite", String(filters.isFavorite));

        const response = await fetch(
          `/api/activities?${queryParams.toString()}`
        );
        if (!response.ok)
          throw new Error("Erreur lors de la récupération des activités");

        const data = await response.json();
        setActivities(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      } finally {
        setLoading(false);
      }
    },
    [session]
  );

  const fetchStats = useCallback(async () => {
    if (!session?.user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/activities/stats");
      if (!response.ok)
        throw new Error("Erreur lors de la récupération des statistiques");

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }, [session]);

  const createActivity = useCallback(
    async (
      data: Omit<Activity, "id" | "userId" | "createdAt" | "updatedAt">
    ) => {
      if (!session?.user) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/activities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok)
          throw new Error("Erreur lors de la création de l'activité");

        const newActivity = await response.json();
        setActivities((prev) => [newActivity, ...prev]);
        return newActivity;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [session]
  );

  const updateActivity = useCallback(
    async (
      id: string,
      data: Partial<Omit<Activity, "id" | "userId" | "createdAt" | "updatedAt">>
    ) => {
      if (!session?.user) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/activities/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok)
          throw new Error("Erreur lors de la mise à jour de l'activité");

        const updatedActivity = await response.json();
        setActivities((prev) =>
          prev.map((activity) =>
            activity.id === id ? updatedActivity : activity
          )
        );
        return updatedActivity;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [session]
  );

  const deleteActivity = useCallback(
    async (id: string) => {
      if (!session?.user) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/activities/${id}`, {
          method: "DELETE",
        });

        if (!response.ok)
          throw new Error("Erreur lors de la suppression de l'activité");

        setActivities((prev) => prev.filter((activity) => activity.id !== id));
        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    [session]
  );

  return {
    activities,
    stats,
    loading,
    error,
    fetchActivities,
    fetchStats,
    createActivity,
    updateActivity,
    deleteActivity,
  };
};
