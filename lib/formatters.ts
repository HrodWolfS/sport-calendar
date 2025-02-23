export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}min`;
  }

  return `${hours}h${remainingMinutes.toString().padStart(2, "0")}`;
};

export const formatDistance = (kilometers: number): string => {
  return `${kilometers.toFixed(2)}km`;
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
