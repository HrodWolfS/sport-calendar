"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function SignIn() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleSignIn = async () => {
    try {
      await signIn("strava", {
        callbackUrl: "/",
        redirect: true,
      });
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-strava-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-strava-gray-200 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-strava-gray-800 mb-2">
            Bienvenue sur Sport Calendar
          </h1>
          <p className="text-strava-gray-600">
            Connectez-vous avec votre compte Strava pour commencer
          </p>
          {error && (
            <p className="mt-4 text-sm text-red-600">
              Une erreur est survenue lors de la connexion. Veuillez réessayer.
            </p>
          )}
        </div>

        <button
          onClick={handleSignIn}
          className="w-full flex items-center justify-center gap-3 bg-strava-orange text-white px-4 py-3 rounded-md hover:bg-strava-orange/90 transition-colors"
        >
          <Image
            src="/strava-logo.svg"
            alt="Strava"
            width={24}
            height={24}
            className="w-6 h-6"
          />
          <span className="font-medium">Se connecter avec Strava</span>
        </button>
      </div>
    </div>
  );
}
