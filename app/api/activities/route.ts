import { ActivityService } from "@/lib/services/activity.service";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const isFavorite = searchParams.get("isFavorite");

    const activities = await ActivityService.list({
      userId: session.user.id,
      type: type || undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      isFavorite: isFavorite === "true",
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Erreur lors de la récupération des activités:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const data = await req.json();
    const activity = await ActivityService.create({
      ...data,
      userId: session.user.id,
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de l'activité:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
