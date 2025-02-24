import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

type StravaActivity = {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  start_date: string;
  type: string;
};

type StravaStats = {
  distance: number;
  duration: number;
  count: number;
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Obtenir le premier jour du mois en cours
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Récupérer les activités Strava
    const stravaResponse = await fetch(
      "https://www.strava.com/api/v3/athlete/activities",
      {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      }
    );

    let stravaActivities: StravaActivity[] = [];
    if (stravaResponse.ok) {
      stravaActivities = await stravaResponse.json();
    }

    // Statistiques mensuelles
    const monthlyStats = await prisma.activity.aggregate({
      where: {
        userId: session.user.id,
        date: {
          gte: startOfMonth,
        },
      },
      _sum: {
        distance: true,
        duration: true,
        trainingLoad: true,
        calories: true,
      },
      _count: true,
    });

    // Statistiques globales
    const totalStats = await prisma.activity.aggregate({
      where: {
        userId: session.user.id,
      },
      _sum: {
        distance: true,
        duration: true,
        trainingLoad: true,
        calories: true,
      },
      _count: true,
    });

    // Activités favorites
    const favoriteActivities = await prisma.activity.count({
      where: {
        userId: session.user.id,
        isFavorite: true,
      },
    });

    // Calculer les statistiques Strava du mois
    const monthlyStravaStats = stravaActivities
      .filter((activity) => new Date(activity.start_date) >= startOfMonth)
      .reduce<StravaStats>(
        (acc, activity) => {
          acc.distance += activity.distance / 1000; // Convertir en km
          acc.duration += activity.moving_time / 60; // Convertir en minutes
          acc.count += 1;
          return acc;
        },
        { distance: 0, duration: 0, count: 0 }
      );

    // Calculer les statistiques Strava totales
    const totalStravaStats = stravaActivities.reduce<StravaStats>(
      (acc, activity) => {
        acc.distance += activity.distance / 1000; // Convertir en km
        acc.duration += activity.moving_time / 60; // Convertir en minutes
        acc.count += 1;
        return acc;
      },
      { distance: 0, duration: 0, count: 0 }
    );

    return NextResponse.json({
      monthly: {
        totalDistance:
          (monthlyStats._sum.distance || 0) + monthlyStravaStats.distance,
        totalDuration:
          (monthlyStats._sum.duration || 0) + monthlyStravaStats.duration,
        totalTrainingLoad: monthlyStats._sum.trainingLoad || 0,
        totalCalories: monthlyStats._sum.calories || 0,
        activityCount: monthlyStats._count + monthlyStravaStats.count,
      },
      total: {
        totalDistance:
          (totalStats._sum.distance || 0) + totalStravaStats.distance,
        totalDuration:
          (totalStats._sum.duration || 0) + totalStravaStats.duration,
        totalTrainingLoad: totalStats._sum.trainingLoad || 0,
        totalCalories: totalStats._sum.calories || 0,
        activityCount: totalStats._count + totalStravaStats.count,
      },
      favorites: {
        count: favoriteActivities,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
