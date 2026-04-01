export type UserTier = "free" | "pro" | "vip";

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  tier: UserTier;
  isAdmin: boolean;
  generationsUsed: number;
  generationsLimit: number;
  createdAt: string;
  lastLoginAt: string;
}

const tierLimits: Record<UserTier, number> = {
  free: 5,
  pro: 100,
  vip: 999999,
};

// ---------------------------------------------------------------------------
// Cloudflare KV REST API
// ---------------------------------------------------------------------------
// Required env vars:
//   CLOUDFLARE_ACCOUNT_ID   — your Cloudflare account ID
//   CLOUDFLARE_KV_NAMESPACE — the KV namespace ID
//   CLOUDFLARE_API_TOKEN    — API token with Workers KV Storage:Edit permission
// ---------------------------------------------------------------------------

function kvConfig() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const namespaceId = process.env.CLOUDFLARE_KV_NAMESPACE;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (accountId && namespaceId && apiToken) {
    return { accountId, namespaceId, apiToken };
  }
  return null;
}

const KV_BASE = (acct: string, ns: string) =>
  `https://api.cloudflare.com/client/v4/accounts/${acct}/storage/kv/namespaces/${ns}`;

async function kvGet(key: string): Promise<string | null> {
  const cfg = kvConfig();
  if (!cfg) return null;
  const res = await fetch(
    `${KV_BASE(cfg.accountId, cfg.namespaceId)}/values/${encodeURIComponent(key)}`,
    { headers: { Authorization: `Bearer ${cfg.apiToken}` } }
  );
  if (!res.ok) return null;
  return res.text();
}

async function kvPut(key: string, value: string): Promise<void> {
  const cfg = kvConfig();
  if (!cfg) return;
  await fetch(
    `${KV_BASE(cfg.accountId, cfg.namespaceId)}/values/${encodeURIComponent(key)}`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${cfg.apiToken}` },
      body: value,
    }
  );
}

// ---------------------------------------------------------------------------
// KV key scheme:
//   user:email:<email>  → User JSON        (primary lookup)
//   user:id:<id>        → email string      (reverse lookup by ID)
// ---------------------------------------------------------------------------

// In-memory fallback for local dev / build (when no KV env vars set)
const memoryStore = new Map<string, User>();

export async function getUserByEmail(email: string): Promise<User | null> {
  const cfg = kvConfig();

  if (cfg) {
    const raw = await kvGet(`user:email:${email}`);
    if (raw) {
      const data = JSON.parse(raw) as User;
      data.generationsLimit = tierLimits[data.tier];
      return data;
    }

    // Auto-create on first lookup
    const user: User = {
      id: crypto.randomUUID(),
      email,
      name: email.split("@")[0],
      tier: "free",
      isAdmin: false,
      generationsUsed: 0,
      generationsLimit: tierLimits.free,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    await kvPut(`user:email:${email}`, JSON.stringify(user));
    await kvPut(`user:id:${user.id}`, email);
    return user;
  }

  // Fallback: in-memory
  if (memoryStore.has(email)) return memoryStore.get(email)!;
  const user: User = {
    id: crypto.randomUUID(),
    email,
    name: email.split("@")[0],
    tier: "free",
    isAdmin: false,
    generationsUsed: 0,
    generationsLimit: tierLimits.free,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };
  memoryStore.set(email, user);
  return user;
}

export async function incrementGenerations(userId: string): Promise<{ allowed: boolean; used: number; limit: number }> {
  const cfg = kvConfig();

  if (cfg) {
    // Reverse lookup: id → email → user
    const email = await kvGet(`user:id:${userId}`);
    if (!email) return { allowed: false, used: 0, limit: 0 };

    const raw = await kvGet(`user:email:${email}`);
    if (!raw) return { allowed: false, used: 0, limit: 0 };

    const user = JSON.parse(raw) as User;
    const limit = tierLimits[user.tier];
    if (user.generationsUsed >= limit) {
      return { allowed: false, used: user.generationsUsed, limit };
    }

    user.generationsUsed += 1;
    await kvPut(`user:email:${email}`, JSON.stringify(user));
    return { allowed: true, used: user.generationsUsed, limit };
  }

  // Fallback: in-memory
  for (const user of memoryStore.values()) {
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

export async function updateUserTier(email: string, tier: UserTier): Promise<boolean> {
  const cfg = kvConfig();

  if (cfg) {
    const raw = await kvGet(`user:email:${email}`);
    if (!raw) return false;
    const user = JSON.parse(raw) as User;
    user.tier = tier;
    user.generationsLimit = tierLimits[tier];
    await kvPut(`user:email:${email}`, JSON.stringify(user));
    return true;
  }

  // Fallback: in-memory
  const user = memoryStore.get(email);
  if (!user) return false;
  user.tier = tier;
  user.generationsLimit = tierLimits[tier];
  return true;
}

/**
 * Update user profile on login (name, image, lastLoginAt).
 * Preserves existing fields like tier and isAdmin.
 */
export async function updateUserLogin(
  email: string,
  profile: { name?: string | null; image?: string | null }
): Promise<void> {
  const cfg = kvConfig();

  if (cfg) {
    const raw = await kvGet(`user:email:${email}`);
    if (!raw) return;
    const user = JSON.parse(raw) as User;
    if (profile.name) user.name = profile.name;
    if (profile.image) user.image = profile.image;
    user.lastLoginAt = new Date().toISOString();
    // Ensure isAdmin field exists for older records
    if (user.isAdmin === undefined) user.isAdmin = false;
    await kvPut(`user:email:${email}`, JSON.stringify(user));
    return;
  }

  // Fallback: in-memory
  const user = memoryStore.get(email);
  if (!user) return;
  if (profile.name) user.name = profile.name;
  if (profile.image) user.image = profile.image;
  user.lastLoginAt = new Date().toISOString();
}
