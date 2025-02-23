import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { NextAuthOptions } from "next-auth";
import StravaProvider from "next-auth/providers/strava";

/**
 * 🔄 Rafraîchit le token Strava si expiré
 */
async function refreshAccessToken(token) {
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

    if (!response.ok) throw refreshedTokens;

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      accessTokenExpires: refreshedTokens.expires_at * 1000,
    };
  } catch (error) {
    console.error("Erreur lors du rafraîchissement du token", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  debug: true,
  session: { strategy: "jwt" },
  providers: [
    StravaProvider({
      clientId: process.env.STRAVA_CLIENT_ID!,
      clientSecret: process.env.STRAVA_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "read,activity:read_all,activity:write",
          approval_prompt: "auto",
        },
      },
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: `${profile.firstname} ${profile.lastname}`,
          email: null,
          image: profile.profile,
        };
      },
    }),
  ],
  callbacks: {
    /**
     * 🏃 Gestion de l'inscription et connexion utilisateur
     */
    async signIn({ user, account, profile }) {
      if (process.env.NODE_ENV === "development") {
        console.log("=== SignIn callback ===", { user, account, profile });
      }

      try {
        const existingUser = await prisma.user.findUnique({
          where: { id: account.providerAccountId },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              id: account.providerAccountId,
              name: user.name,
              email: user.email,
              image: user.image,
            },
          });
        }

        return true;
      } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur:", error);
        return false;
      }
    },

    /**
     * 🔑 Gestion du token JWT pour stocker les tokens OAuth
     */
    async jwt({ token, account }) {
      if (process.env.NODE_ENV === "development") {
        console.log("=== JWT callback ===", { token, account });
      }

      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at * 1000;
        token.stravaId = account.providerAccountId;
      }

      // Vérifier si le token est expiré et le rafraîchir
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      return await refreshAccessToken(token);
    },

    /**
     * 🏠 Gestion de la session pour stocker les infos utilisateur
     */
    async session({ session, token }) {
      session.user.id = token.sub;
      session.user.stravaId = token.stravaId;
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.accessTokenExpires = token.accessTokenExpires;

      if (process.env.NODE_ENV === "development") {
        console.log("=== Session callback ===", { session });
      }

      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
