import { StatsChart } from "@/components/ui/stats-chart";

export default function StatisticsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-strava-gray-800 mb-8">
        Statistiques
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Résumé des performances */}
        <section className="bg-white rounded-lg shadow-sm p-6 border border-strava-gray-200">
          <h2 className="text-xl font-semibold text-strava-gray-700 mb-6">
            Résumé du mois
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-strava-gray-50 rounded-lg">
              <p className="text-sm text-strava-gray-500">Distance totale</p>
              <p className="text-2xl font-bold text-strava-gray-800">85.7 km</p>
            </div>
            <div className="p-4 bg-strava-gray-50 rounded-lg">
              <p className="text-sm text-strava-gray-500">Temps total</p>
              <p className="text-2xl font-bold text-strava-gray-800">8h45</p>
            </div>
            <div className="p-4 bg-strava-gray-50 rounded-lg">
              <p className="text-sm text-strava-gray-500">Calories brûlées</p>
              <p className="text-2xl font-bold text-strava-gray-800">4,250</p>
            </div>
            <div className="p-4 bg-strava-gray-50 rounded-lg">
              <p className="text-sm text-strava-gray-500">Activités</p>
              <p className="text-2xl font-bold text-strava-gray-800">12</p>
            </div>
          </div>
        </section>

        {/* Graphique de progression */}
        <section className="bg-white rounded-lg shadow-sm p-6 border border-strava-gray-200">
          <h2 className="text-xl font-semibold text-strava-gray-700 mb-6">
            Progression
          </h2>
          <StatsChart />
        </section>

        {/* Distribution des activités */}
        <section className="bg-white rounded-lg shadow-sm p-6 border border-strava-gray-200">
          <h2 className="text-xl font-semibold text-strava-gray-700 mb-6">
            Distribution des activités
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-strava-gray-600">Course à pied</span>
                <span className="text-strava-gray-800">8 séances</span>
              </div>
              <div className="w-full bg-strava-gray-200 rounded-full h-2">
                <div
                  className="bg-strava-orange h-2 rounded-full"
                  style={{ width: "66.7%" }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-strava-gray-600">Musculation</span>
                <span className="text-strava-gray-800">4 séances</span>
              </div>
              <div className="w-full bg-strava-gray-200 rounded-full h-2">
                <div
                  className="bg-strava-orange h-2 rounded-full"
                  style={{ width: "33.3%" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Records personnels */}
        <section className="bg-white rounded-lg shadow-sm p-6 border border-strava-gray-200">
          <h2 className="text-xl font-semibold text-strava-gray-700 mb-6">
            Records personnels
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-strava-gray-500">
                Plus longue distance
              </p>
              <p className="text-lg font-semibold text-strava-gray-800">
                15.3 km
              </p>
              <p className="text-xs text-strava-gray-500">15 février 2024</p>
            </div>
            <div>
              <p className="text-sm text-strava-gray-500">
                Meilleure allure moyenne
              </p>
              <p className="text-lg font-semibold text-strava-gray-800">
                4:35 min/km
              </p>
              <p className="text-xs text-strava-gray-500">8 février 2024</p>
            </div>
            <div>
              <p className="text-sm text-strava-gray-500">
                Plus longue séance de musculation
              </p>
              <p className="text-lg font-semibold text-strava-gray-800">
                75 minutes
              </p>
              <p className="text-xs text-strava-gray-500">20 février 2024</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
