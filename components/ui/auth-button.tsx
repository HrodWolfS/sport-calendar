"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export const AuthButton = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <button
        onClick={() => signOut()}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-strava-orange rounded-md hover:bg-strava-orange/90"
      >
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt={session.user.name || ""}
            width={24}
            height={24}
            className="w-6 h-6 rounded-full"
          />
        )}
        <span>Déconnexion</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => signIn("strava")}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-strava-orange rounded-md hover:bg-strava-orange/90"
    >
      <Image
        src="/strava-logo.svg"
        alt="Strava"
        width={24}
        height={24}
        className="w-6 h-6"
      />
      <span>Se connecter avec Strava</span>
    </button>
  );
};
