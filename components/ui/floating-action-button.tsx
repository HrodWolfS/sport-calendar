"use client";

type FloatingActionButtonProps = {
  onClick: () => void;
  label: string;
};

export const FloatingActionButton = ({
  onClick,
  label,
}: FloatingActionButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 z-40 flex items-center gap-2 rounded-full bg-strava-orange px-4 py-3 text-sm font-medium text-white shadow-lg transition-transform hover:scale-105 hover:bg-opacity-90 md:bottom-8"
    >
      <span className="text-lg">+</span>
      <span>{label}</span>
    </button>
  );
};
