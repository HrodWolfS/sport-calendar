"use client";

import { ActivityModal } from "@/components/modals/activity-modal";
import { ActivityList } from "@/components/ui/activity-list";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { UserProfile } from "@/components/ui/user-profile";
import { useActivities } from "@/lib/hooks/useActivities";
import { Activity } from "@prisma/client";
import { useEffect, useState } from "react";

export default function Home() {
  const {
    activities,
    stats,
    loading,
    error,
    fetchActivities,
    fetchStats,
    createActivity,
    updateActivity,
  } = useActivities();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<
    Activity | undefined
  >();

  useEffect(() => {
    fetchActivities();
    fetchStats();
  }, [fetchActivities, fetchStats]);

  const handleCreateActivity = async (
    data: Omit<
      Activity,
      "id" | "userId" | "createdAt" | "updatedAt" | "stravaId"
    >
  ) => {
    await createActivity(data);
    setIsModalOpen(false);
    fetchStats();
  };

  const handleUpdateActivity = async (
    data: Omit<
      Activity,
      "id" | "userId" | "createdAt" | "updatedAt" | "stravaId"
    >
  ) => {
    if (selectedActivity) {
      await updateActivity(selectedActivity.id, data);
      setSelectedActivity(undefined);
      setIsModalOpen(false);
      fetchStats();
    }
  };

  const handleEditActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <UserProfile />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Statistiques rapides */}
          {stats && (
            <section className="bg-white rounded-lg shadow-sm p-6 border border-strava-gray-200">
              <h2 className="text-xl font-semibold text-strava-gray-700 mb-4">
                Ce mois-ci
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-strava-gray-500">
                    Distance totale
                  </p>
                  <p className="text-2xl font-bold text-strava-gray-800">
                    {stats.monthly.totalDistance?.toFixed(1)} km
                  </p>
                </div>
                <div>
                  <p className="text-sm text-strava-gray-500">Temps total</p>
                  <p className="text-2xl font-bold text-strava-gray-800">
                    {Math.floor(stats.monthly.totalDuration / 60)}h
                    {(stats.monthly.totalDuration % 60).toFixed(0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-strava-gray-500">Activités</p>
                  <p className="text-2xl font-bold text-strava-gray-800">
                    {stats.monthly.activityCount}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Objectifs */}
          <section className="bg-white rounded-lg shadow-sm p-6 border border-strava-gray-200">
            <h2 className="text-xl font-semibold text-strava-gray-700 mb-4">
              Objectifs du mois
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-strava-gray-600">Distance</span>
                  <span className="text-strava-gray-800">
                    {stats?.monthly.totalDistance?.toFixed(1)}/100 km
                  </span>
                </div>
                <div className="w-full bg-strava-gray-200 rounded-full h-2">
                  <div
                    className="bg-strava-orange h-2 rounded-full"
                    style={{
                      width: `${Math.min(
                        ((stats?.monthly.totalDistance || 0) / 100) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-strava-gray-600">Activités</span>
                  <span className="text-strava-gray-800">
                    {stats?.monthly.activityCount}/15
                  </span>
                </div>
                <div className="w-full bg-strava-gray-200 rounded-full h-2">
                  <div
                    className="bg-strava-orange h-2 rounded-full"
                    style={{
                      width: `${Math.min(
                        ((stats?.monthly.activityCount || 0) / 15) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        <ActivityList />
      </div>

      <FloatingActionButton
        onClick={() => setIsModalOpen(true)}
        label="Ajouter une activité"
      />

      <ActivityModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedActivity(undefined);
        }}
        onSubmit={
          selectedActivity ? handleUpdateActivity : handleCreateActivity
        }
        activity={selectedActivity}
        title={
          selectedActivity ? "Modifier l'activité" : "Ajouter une activité"
        }
      />
    </main>
  );
}
