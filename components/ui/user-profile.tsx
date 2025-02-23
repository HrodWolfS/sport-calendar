"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export const UserProfile = () => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="p-4 bg-strava-gray-100 rounded-lg">
        <p className="text-strava-gray-600">Non connecté</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-strava-gray-100 rounded-lg flex items-center justify-between">
      <div className="flex items-center gap-4">
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt={session.user.name || ""}
            width={48}
            height={48}
            className="rounded-full"
          />
        )}
        <div>
          <p className="text-lg font-semibold text-strava-gray-800">
            {session.user?.name}
          </p>
          <p className="text-sm text-strava-gray-600">
            Strava ID: {session.user?.stravaId}
          </p>
        </div>
      </div>
      <button
        onClick={() => signOut()}
        className="px-4 py-2 text-sm font-medium text-white bg-strava-orange rounded-md hover:bg-strava-orange/90 transition-colors"
      >
        Se déconnecter
      </button>
    </div>
  );
};
