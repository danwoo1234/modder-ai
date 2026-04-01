import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      tier?: "free" | "pro" | "vip";
      isAdmin?: boolean;
    };
  }

  interface JWT {
    tier?: string;
    dbId?: string;
    isAdmin?: boolean;
  }
}
