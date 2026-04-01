import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { getUserByEmail, updateUserLogin, getEffectiveTier } from "./db";

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
    async signIn({ user, profile }) {
      // Save / update user in Cloudflare KV on every sign-in
      if (user.email) {
        try {
          // Ensure user record exists first
          await getUserByEmail(user.email);
          // Then update with Google profile data
          await updateUserLogin(user.email, {
            name: profile?.name ?? user.name,
            image: (profile?.picture as string) ?? user.image,
          });
        } catch {
          // Don't block sign-in if KV is temporarily unavailable
        }
      }
      return true;
    },
    async jwt({ token, trigger }) {
      if (
        token.email &&
        (trigger === "signIn" || trigger === "signUp" || trigger === "update" || !token.tier)
      ) {
        try {
          const dbUser = await getUserByEmail(token.email);
          if (dbUser) {
            token.tier = getEffectiveTier(dbUser);
            token.dbId = dbUser.id;
            token.isAdmin = dbUser.isAdmin ?? false;
          }
        } catch {
          if (!token.tier) token.tier = "free";
          if (token.isAdmin === undefined) token.isAdmin = false;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.tier = (token.tier as "free" | "pro" | "vip") ?? "free";
      session.user.isAdmin = (token.isAdmin as boolean) ?? false;
      if (token.dbId) {
        session.user.id = token.dbId as string;
      }
      return session;
    },
  },
});
