export type UserTier = "free" | "pro" | "vip";

export interface User {
  id: string;
  email: string;
  name: string;
  tier: UserTier;
  generationsUsed: number;
  generationsLimit: number;
}

const tierLimits: Record<UserTier, number> = {
  free: 5,
  pro: 100,
  vip: Infinity,
};

// In-memory store for development; replace with a real DB in production
const users = new Map<string, User>();

export async function getUserByEmail(email: string): Promise<User | null> {
  if (users.has(email)) return users.get(email)!;
  // Auto-create user on first lookup
  const user: User = {
    id: crypto.randomUUID(),
    email,
    name: email.split("@")[0],
    tier: "free",
    generationsUsed: 0,
    generationsLimit: tierLimits.free,
  };
  users.set(email, user);
  return user;
}

export async function incrementGenerations(userId: string): Promise<{ allowed: boolean; used: number; limit: number }> {
  for (const user of users.values()) {
    if (user.id === userId) {
      const limit = tierLimits[user.tier];
      if (user.generationsUsed >= limit) {
        return { allowed: false, used: user.generationsUsed, limit };
      }
      user.generationsUsed += 1;
      return { allowed: true, used: user.generationsUsed, limit };
    }
  }
  return { allowed: false, used: 0, limit: 0 };
}
