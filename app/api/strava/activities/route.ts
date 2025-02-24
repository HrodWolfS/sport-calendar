import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session dans l'API activities:", session);

    if (!session?.user?.accessToken) {
      console.log("Pas de token d'accès");
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    console.log(
      "Appel à l'API Strava avec le token:",
      session.user.accessToken
    );

    const response = await fetch(
      "https://www.strava.com/api/v3/athlete/activities",
      {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur Strava:", errorText);
      return NextResponse.json(
        { error: "Erreur Strava" },
        { status: response.status }
      );
    }

    const activities = await response.json();
    console.log("Activités récupérées:", activities.length);
    return NextResponse.json(activities);
  } catch (error) {
    console.error("Erreur lors de la récupération des activités:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
