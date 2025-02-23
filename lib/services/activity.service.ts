import { prisma } from "@/lib/prisma";
import { Activity, Prisma } from "@prisma/client";

export type CreateActivityInput = Omit<
  Activity,
  "id" | "createdAt" | "updatedAt" | "stravaId"
>;

export type UpdateActivityInput = Partial<
  Omit<Activity, "id" | "createdAt" | "updatedAt" | "userId">
>;

export type ActivityFilters = {
  userId: string;
  type?: string;
  startDate?: Date;
  endDate?: Date;
  isFavorite?: boolean;
};

export class ActivityService {
  static async create(data: CreateActivityInput): Promise<Activity> {
    return prisma.activity.create({
      data,
    });
  }

  static async update(
    id: string,
    userId: string,
    data: UpdateActivityInput
  ): Promise<Activity> {
    return prisma.activity.update({
      where: { id, userId },
      data,
    });
  }

  static async delete(id: string, userId: string): Promise<Activity> {
    return prisma.activity.delete({
      where: { id, userId },
    });
  }

  static async getById(id: string, userId: string): Promise<Activity | null> {
    return prisma.activity.findFirst({
      where: { id, userId },
    });
  }

  static async list(filters: ActivityFilters): Promise<Activity[]> {
    const where: Prisma.ActivityWhereInput = {
      userId: filters.userId,
      ...(filters.type && { type: filters.type }),
      ...(filters.isFavorite && { isFavorite: filters.isFavorite }),
      ...(filters.startDate &&
        filters.endDate && {
          date: {
            gte: filters.startDate,
            lte: filters.endDate,
          },
        }),
    };

    return prisma.activity.findMany({
      where,
      orderBy: { date: "desc" },
    });
  }

  static async getStats(userId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const [monthlyStats, totalStats] = await Promise.all([
      prisma.activity.aggregate({
        where: {
          userId,
          date: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        _sum: {
          duration: true,
          distance: true,
          calories: true,
        },
        _count: true,
      }),
      prisma.activity.aggregate({
        where: {
          userId,
        },
        _sum: {
          duration: true,
          distance: true,
          calories: true,
        },
        _count: true,
      }),
    ]);

    return {
      monthly: {
        totalDuration: monthlyStats._sum.duration || 0,
        totalDistance: monthlyStats._sum.distance || 0,
        totalCalories: monthlyStats._sum.calories || 0,
        activityCount: monthlyStats._count,
      },
      total: {
        totalDuration: totalStats._sum.duration || 0,
        totalDistance: totalStats._sum.distance || 0,
        totalCalories: totalStats._sum.calories || 0,
        activityCount: totalStats._count,
      },
    };
  }
}
