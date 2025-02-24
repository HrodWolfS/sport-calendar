import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { DefaultSession, NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import NextAuth from "next-auth/next";
import StravaProvider from "next-auth/providers/strava";

// Types personnalisés
interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  stravaId?: string | null;
  city?: string | null;
  weight?: number | null;
  sex?: string | null;
  premium?: boolean;
}

interface ExtendedSession extends DefaultSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    stravaId?: string | null;
    city?: string | null;
    weight?: number | null;
    sex?: string | null;
    premium?: boolean;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
  };
  error?: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      stravaId?: string | null;
      city?: string | null;
      weight?: number | null;
      sex?: string | null;
      premium?: boolean;
      accessToken?: string;
      refreshToken?: string;
      accessTokenExpires?: number;
    };
    error?: string;
  }
  interface User extends ExtendedUser {}
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
    userId?: string;
  }
}

/**
 * 🔄 Rafraîchit le token Strava si expiré
 */
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        refresh_token: token.refreshToken,
        grant_type: "refresh_token",
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      accessTokenExpires: refreshedTokens.expires_at * 1000,
    };
  } catch (error) {
    console.error("🚨 Erreur lors du rafraîchissement du token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    StravaProvider({
      clientId: process.env.STRAVA_CLIENT_ID as string,
      clientSecret: process.env.STRAVA_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "read,activity:read_all,activity:write",
          response_type: "code",
          approval_prompt: "auto",
        },
      },
      profile(profile) {
        return {
          id: String(profile.id),
          name: `${profile.firstname} ${profile.lastname}`,
          email: "",
          image: profile.profile,
          stravaId: String(profile.id),
          city: profile.city || null,
          weight: profile.weight || null,
          sex: profile.sex || null,
          premium: profile.premium || false,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      // Première connexion
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: account.expires_at! * 1000,
          userId: user.id,
        };
      }

      // Si le token n'a pas expiré, on le retourne tel quel
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Sinon, on rafraîchit le token
      return refreshAccessToken(token);
    },
    async session({ session, token, user }) {
      if (token) {
        session.user = {
          ...session.user,
          id: user?.id || token.userId || "",
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          accessTokenExpires: token.accessTokenExpires,
        };
        session.error = token.error;
      }
      return session;
    },
    async signIn({ account, profile }) {
      if (!account || !profile) return false;

      // Suppression de l'objet athlete
      if (account.provider === "strava" && "athlete" in account) {
        const { athlete, ...accountWithoutAthlete } = account;
        Object.assign(account, accountWithoutAthlete);
      }

      return true;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
