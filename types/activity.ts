export type ActivityType = "running" | "musculation";

export type Activity = {
  id: string;
  date: string;
  type: ActivityType;
  duration: number; // en minutes
  distance?: number; // en km, uniquement pour la course
  trainingLoad: number;
  calories: number;
  isFavorite: boolean;
  stravaId?: string; // pour la synchronisation avec Strava
  notes?: string;
  title: string;
};

export type ActivityFormData = Omit<Activity, "id" | "stravaId">;

export type ActivityFilters = {
  type?: ActivityType;
  startDate?: string;
  endDate?: string;
  isFavorite?: boolean;
};
