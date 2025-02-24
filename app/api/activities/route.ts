import { prisma } from "@/lib/prisma";
import { ActivityService } from "@/lib/services/activity.service";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const activities = await prisma.activity.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        date: "desc",
      },
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
