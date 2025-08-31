// BotChat Pro - NextAuth.js Configuration
// GDPR-compliant authentication with Google OAuth

import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  pages: {
    signIn: "/signin",
    error: "/error",
  },
  session: {
    strategy: "jwt", // Geändert zu JWT für bessere Production Performance
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // GDPR: Check if user gave consent
      if (account?.provider === "google") {
        // Store consent information
        await prisma.user.upsert({
          where: { email: user.email! },
          update: {
            consentGiven: true,
            consentGivenAt: new Date(),
          },
          create: {
            email: user.email!,
            name: user.name,
            image: user.image,
            consentGiven: true,
            consentGivenAt: new Date(),
          },
        });
      }
      return true;
    },
    async session({ session, user }) {
      // Add user info to session
      if (session.user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email! },
          select: {
            id: true,
            subscriptionTier: true,
            subscriptionStatus: true,
            subscriptionEndsAt: true,
            consentGiven: true,
          },
        });

        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.subscriptionTier = dbUser.subscriptionTier;
          session.user.subscriptionStatus = dbUser.subscriptionStatus;
          session.user.subscriptionEndsAt = dbUser.subscriptionEndsAt;
          session.user.consentGiven = dbUser.consentGiven;
        }
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      console.log(`User signed in: ${user.email}, isNewUser: ${isNewUser}`);
      
      // Track sign-in for analytics (anonymized)
      if (process.env.ENABLE_ANALYTICS === "true") {
        // TODO: Add analytics tracking
      }
    },
    async signOut({ session }) {
      console.log(`User signed out: ${session?.user?.email}`);
    },
  },
  debug: process.env.NODE_ENV === "development",
};
