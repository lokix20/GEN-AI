# Haritha Sahayak (v2)

Phase 1 rebuild of the Haritha Sahayak agriculture platform on a production-grade stack: **foundation + auth + onboarding + dashboard shell + AI Assistant + Crop Disease Detection**. Everything else in the full product spec (weather, market prices, schemes, irrigation, marketplace, community, expert consultation, admin panel, etc.) is scaffolded as "Coming soon" nav destinations for a later phase — see `PLAN` in the conversation history for the full rationale.

The previous prototype at `../haritha-sahayak` is untouched and kept as reference.

## Stack

- **Frontend** (`apps/web`): React 18 + TypeScript + Vite + Tailwind + shadcn/ui-style components + Zustand + TanStack Query + React Hook Form + Zod + react-i18next + PWA.
- **Backend** (`apps/api`): Node + Express + TypeScript + Prisma + PostgreSQL + JWT auth + Redis (optional, degrades gracefully) + Socket.IO (installed, ready for future real-time features).
- **Shared** (`packages/shared-types`): Zod schemas shared by both apps for types + runtime validation.
- **AI/Vision/Storage/Notifications**: all built behind provider interfaces with a working **mock/local fallback** — the whole app runs and demos end-to-end with **zero external API keys**. Drop in `OPENAI_API_KEY`/`GEMINI_API_KEY`/`SUPABASE_*`/`TWILIO_*`/`SENDGRID_*` in `apps/api/.env` to switch to real integrations with no code changes.

## Getting started

### 1. Start Postgres + Redis

```bash
docker compose up -d postgres redis
```

(No Docker? Point `DATABASE_URL` in `apps/api/.env` at any Postgres 14+ instance; Redis is optional — the app falls back to in-memory caching/rate-limiting if it's unreachable.)

### 2. Install dependencies (from the repo root)

```bash
npm install
```

### 3. Set up the database

```bash
cd apps/api
npx prisma migrate dev
npx prisma db seed
```

Seeds a demo farmer account: **demo.farmer@harithasahayak.in / password123** (already onboarded, in Kerala, growing Rice & Coconut) and an admin account (**admin@harithasahayak.in / password123**).

### 4. Run both apps

```bash
# from the repo root, in two terminals
npm run dev:api    # http://localhost:4000
npm run dev:web    # http://localhost:5173
```

Or with Docker for a production-like build:

```bash
docker compose up --build
```
Web → http://localhost:8080, API → http://localhost:4000.

## What's real vs. mocked

| Feature | Behavior without API keys | Behavior with API keys |
|---|---|---|
| AI Assistant chat | Streams a templated, profile-grounded reply | Streams real answers from OpenAI or Gemini |
| Crop Disease Detection | Deterministic result from a seeded reference dataset (not a trained model) | Real vision analysis via GPT-4o or Gemini |
| File uploads | Saved to local disk, served from `/uploads` | Uploaded to Supabase Storage |
| OTP / password reset codes | Logged to the API console | Sent via Twilio SMS / SendGrid email |
| Google login | Button hidden | Button renders once `VITE_GOOGLE_CLIENT_ID` (web) and `GOOGLE_CLIENT_ID` (api) are set |

## Project layout

```
apps/web/src/
  app/          router, providers, nav metadata
  pages/        route-level screens
  features/     feature logic (api calls, hooks, feature-specific components)
  components/   ui/ (shadcn-style primitives), layout/, shared/
  store/        zustand stores (auth, ui/theme)
apps/api/src/
  modules/      auth, users, chat, disease-detection, uploads (routes/controller/service/repository)
  providers/    ai/, vision/, storage/, notification/ — interface + real + mock implementations + factory
  middleware/   auth, error handling, rate limiting, uploads
  prisma/       schema, migrations, seed
```
