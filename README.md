# ⛏️ Modder AI

**AI-powered Minecraft modding platform.** Create mods, plugins, datapacks, and more with natural language. No coding required.

🌐 **Live:** [modderai.net](https://modderai.net)

## Features

- **20+ AI Tools** — Generate mods, items, quests, minigames, commands, datapacks, and more
- **12+ Loader Support** — Paper, Spigot, Fabric, Forge, NeoForge, Purpur, and more
- **MC 1.7.10 → 1.21** — All major Minecraft versions supported
- **Auto-JAR Building** — Generated code compiles to a downloadable .jar file
- **3-Tier Pricing** — Free (5 gen/mo), Pro ($12/mo, 100 gen), VIP ($59/mo, unlimited)
- **Google OAuth** — One-click sign-in
- **Cloudflare KV Database** — Fast, globally distributed user storage
- **LemonSqueezy Payments** — Subscription management

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Styling:** Tailwind CSS v4
- **Auth:** NextAuth.js v5 (Google OAuth)
- **AI:** OpenAI (GPT-4o/4o-mini) + Anthropic (Claude Sonnet 4 / Haiku)
- **Database:** Cloudflare KV (REST API)
- **Payments:** LemonSqueezy
- **UI:** Framer Motion, Lucide React
- **Language:** TypeScript, React 19

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/danwoo1234/modder-ai.git
cd modder-ai
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Fill in the values (see below).

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Build for Production

```bash
npm run build
npm start
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXTAUTH_URL` | Yes | App URL (`http://localhost:3000` for dev) |
| `NEXTAUTH_SECRET` | Yes | Random secret. Generate: `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth Client Secret |
| `ANTHROPIC_API_KEY` | One of these | Anthropic API key |
| `OPENAI_API_KEY` | One of these | OpenAI API key |
| `CLOUDFLARE_ACCOUNT_ID` | Yes | Cloudflare account ID |
| `CLOUDFLARE_KV_NAMESPACE` | Yes | KV namespace ID |
| `CLOUDFLARE_API_TOKEN` | Yes | API token with KV permissions |

---

## Setting Up Cloudflare KV (Step by Step)

Cloudflare KV is used as the user database. Follow these steps exactly:

### Step 1: Get Your Account ID

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Sign up or log in
3. Your **Account ID** is on the right sidebar of the main dashboard page
4. Copy it → paste as `CLOUDFLARE_ACCOUNT_ID` in `.env`

### Step 2: Create a KV Namespace

1. In Cloudflare dashboard, go to **Workers & Pages** → **KV**
2. Click **Create a namespace**
3. Name it `modderai-users` (or any name you want)
4. Click **Add**
5. After creation, you'll see a **Namespace ID** (a long hex string like `a1b2c3d4...`)
6. Copy it → paste as `CLOUDFLARE_KV_NAMESPACE` in `.env`

### Step 3: Create an API Token

1. Go to [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click **Create Token**
3. Click **Create Custom Token**
4. Configure:
   - **Token name:** `modderai-kv`
   - **Permissions:** `Account` → `Workers KV Storage` → `Edit`
   - **Account Resources:** Select your account
5. Click **Continue to summary** → **Create Token**
6. **Copy the token immediately** (it's shown only once!)
7. Paste as `CLOUDFLARE_API_TOKEN` in `.env`

### Verify It Works

After filling in all three values, you can test the connection:

```bash
curl -X GET "https://api.cloudflare.com/client/v4/accounts/YOUR_ACCOUNT_ID/storage/kv/namespaces/YOUR_NAMESPACE_ID/keys" \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

You should get a response with `"success": true`.

---

## Setting Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing
3. Go to **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
4. Application type: **Web application**
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
6. Copy **Client ID** → `GOOGLE_CLIENT_ID`
7. Copy **Client Secret** → `GOOGLE_CLIENT_SECRET`

---

## Setting Up AI (Choose One or Both)

### Anthropic (recommended)
1. Go to [console.anthropic.com](https://console.anthropic.com/settings/keys)
2. Create an API key
3. Paste as `ANTHROPIC_API_KEY`

### OpenAI
1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Paste as `OPENAI_API_KEY`

You need at least one. If both are set, Anthropic is used by default.

---

## Project Structure

```
src/
├── app/
│   ├── api/tools/     # AI generation API route
│   ├── dashboard/     # User dashboard
│   ├── gallery/       # Community gallery
│   ├── pricing/       # Subscription plans
│   ├── privacy/       # Privacy Policy
│   ├── terms/         # Terms of Service
│   ├── tools/         # 17 tool pages
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Landing page
├── components/        # Navbar, AuthGate, AuthProvider, AdBanner
└── lib/               # ai.ts, auth.ts, db.ts (Cloudflare KV), tools.ts
```

## License

Proprietary. All rights reserved.

---

⛏️ Built with AI for the Minecraft community.
