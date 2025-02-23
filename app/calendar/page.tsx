"use client";

import { Calendar } from "@/components/ui/calendar";

export default function CalendarPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-strava-gray-800">Calendrier</h1>
        <button className="bg-strava-orange text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors">
          Ajouter une activité
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-strava-gray-200 p-6">
        <Calendar />
      </div>
    </main>
  );
}
