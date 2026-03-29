# ⛏️ Modder AI

**AI-powered Minecraft modding platform.** Create mods, plugins, datapacks, and more with natural language. No coding required.

🌐 **Live:** [modderai.net](https://modderai.net)

## Features

- **20+ AI Tools** — Generate mods, items, quests, minigames, commands, datapacks, and more
- **12+ Loader Support** — Paper, Spigot, Fabric, Forge, NeoForge, Quilt, Purpur, and more
- **MC 1.7.10 → 1.21** — All major Minecraft versions supported
- **Auto-JAR Building** — Generated code compiles to a downloadable .jar file
- **3-Tier Pricing** — Free (1 gen/mo), Pro ($19/mo unlimited), VIP ($59/mo + Claude Opus 4.6)
- **Google OAuth** — One-click sign-in
- **LemonSqueezy Payments** — Subscription management with webhooks

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Styling:** Tailwind CSS v4
- **Auth:** NextAuth.js v5 (Google OAuth)
- **AI:** OpenAI (GPT-4o/4o-mini) + Anthropic (Claude Sonnet 4)
- **Payments:** LemonSqueezy
- **UI:** Framer Motion, Lucide React
- **Database:** File-based JSON (`.data/users.json`)
- **Language:** TypeScript, React 19

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/modder-ai.git
cd modder-ai
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

See [Environment Variables](#environment-variables) below for details on each variable.

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

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `AUTH_SECRET` | Yes | NextAuth secret. Generate with `npx auth secret` or `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Yes | Your app URL (`http://localhost:3000` for dev, `https://modderai.net` for prod) |
| `AUTH_GOOGLE_ID` | Yes | Google OAuth Client ID from [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| `AUTH_GOOGLE_SECRET` | Yes | Google OAuth Client Secret |
| `OPENAI_API_KEY` | Yes | OpenAI API key from [platform.openai.com](https://platform.openai.com/api-keys) |
| `ANTHROPIC_API_KEY` | Yes | Anthropic API key from [console.anthropic.com](https://console.anthropic.com/) |
| `LEMONSQUEEZY_API_KEY` | Yes | LemonSqueezy API key from [app.lemonsqueezy.com/settings/api](https://app.lemonsqueezy.com/settings/api) |
| `LEMONSQUEEZY_STORE_ID` | Yes | Your LemonSqueezy Store ID |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | Yes | Webhook signing secret from LemonSqueezy webhook settings |
| `LEMONSQUEEZY_PRO_VARIANT_ID` | Yes | LemonSqueezy variant ID for the Pro plan product |
| `LEMONSQUEEZY_VIP_VARIANT_ID` | Yes | LemonSqueezy variant ID for the VIP plan product |

### Setting Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new OAuth 2.0 Client ID (Web application)
3. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://modderai.net/api/auth/callback/google` (prod)
4. Copy Client ID and Client Secret to your `.env.local`

### Setting Up LemonSqueezy

1. Create a store at [LemonSqueezy](https://app.lemonsqueezy.com)
2. Create two products: **Pro** ($19/mo) and **VIP** ($59/mo)
3. Copy each product's variant ID
4. Set up a webhook pointing to `https://modderai.net/api/webhooks/lemonsqueezy`
5. Select events: `subscription_created`, `subscription_updated`, `subscription_cancelled`, `subscription_expired`, `subscription_payment_success`

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add all environment variables in Vercel dashboard → Settings → Environment Variables
4. Set `NEXTAUTH_URL` to your production domain
5. Deploy

## Project Structure

```
src/
├── app/
│   ├── api/           # API routes (generate, tools, checkout, webhooks, auth)
│   ├── dashboard/     # User dashboard
│   ├── gallery/       # Community gallery
│   ├── legal/         # Terms, Privacy, Acceptable Use
│   ├── login/         # Google sign-in
│   ├── pricing/       # Subscription plans
│   ├── tools/         # 15+ tool pages (AI Generator, Quest Gen, etc.)
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Landing page
├── components/        # Navbar, Footer, AuthGate, UserMenu, etc.
└── lib/               # AI service, auth config, DB, hooks, tools data
```

## License

Proprietary. All rights reserved.

---

⛏️ Built with AI for the Minecraft community.
