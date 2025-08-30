// BotChat Pro - NextAuth.js Type Extensions
// Extend default session and user types with custom properties

import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      subscriptionTier: string;
      subscriptionStatus?: string | null;
      subscriptionEndsAt?: Date | null;
      consentGiven: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    subscriptionTier: string;
    subscriptionStatus?: string | null;
    subscriptionEndsAt?: Date | null;
    consentGiven: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    subscriptionTier: string;
    subscriptionStatus?: string | null;
    subscriptionEndsAt?: Date | null;
    consentGiven: boolean;
  }
}
