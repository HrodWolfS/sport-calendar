"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen flex items-center justify-center bg-strava-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-strava-gray-200 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Erreur d&apos;authentification
          </h1>
          <p className="text-strava-gray-600">
            {error === "OAuthCallback"
              ? "Une erreur est survenue lors de la connexion avec Strava. Veuillez vérifier que vous avez autorisé l'accès à votre compte."
              : "Une erreur inattendue est survenue. Veuillez réessayer."}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Link
            href="/auth/signin"
            className="w-full flex items-center justify-center bg-strava-orange text-white px-4 py-3 rounded-md hover:bg-strava-orange/90 transition-colors"
          >
            Réessayer
          </Link>
          <Link
            href="/"
            className="w-full flex items-center justify-center bg-strava-gray-200 text-strava-gray-700 px-4 py-3 rounded-md hover:bg-strava-gray-300 transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
