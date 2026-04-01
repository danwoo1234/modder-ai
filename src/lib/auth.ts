import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { getUserByEmail } from "./db";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      tier?: "free" | "pro" | "vip";
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    tier?: string;
    dbId?: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  trustHost: true,
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user }) {
      // Ensure user exists in Cloudflare KV on first sign-in
      if (user.email) {
        try {
          await getUserByEmail(user.email);
        } catch {
          // Don't block sign-in if KV is temporarily unavailable
        }
      }
      return true;
    },
    async jwt({ token, trigger }) {
      // On sign-in or when tier is missing, fetch from KV and store in JWT
      if (
        token.email &&
        (trigger === "signIn" || trigger === "signUp" || trigger === "update" || !token.tier)
      ) {
        try {
          const dbUser = await getUserByEmail(token.email);
          if (dbUser) {
            token.tier = dbUser.tier;
            token.dbId = dbUser.id;
          }
        } catch {
          // Fallback: keep existing token values or default to free
          if (!token.tier) token.tier = "free";
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Read from JWT token — no DB call needed on every request
      session.user.tier = (token.tier as "free" | "pro" | "vip") ?? "free";
      if (token.dbId) {
        session.user.id = token.dbId as string;
      }
      return session;
    },
  },
});
