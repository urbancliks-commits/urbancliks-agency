# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Urbancliks is a Dubai-based social media agency. This repo contains two products in one Next.js codebase:

- **Marketing website** — public-facing site (services, portfolio, contact)
- **Internal dashboard** — agency tooling for content planning, scheduling, and client reporting

## Commands

```bash
npm run dev          # start dev server (Turbopack)
npm run build        # production build
npm run lint         # ESLint
npm run type-check   # TypeScript type checking (no emit)

# Prisma
npx prisma migrate dev --name <name>   # create and apply a migration
npx prisma migrate deploy              # apply migrations in production
npx prisma generate                    # regenerate the Prisma client
npx prisma studio                      # open Prisma Studio GUI
npx prisma db push                     # push schema without migrations (prototyping only)
```

## Architecture

### Route Groups

The `app/` directory uses two route groups to separate concerns:

- `app/(marketing)/` — public pages, no auth required
- `app/(dashboard)/` — internal tools, protected by `proxy.ts`

Each group has its own `layout.tsx` so the two surfaces have completely different navigation shells and styles.

### Auth — Better Auth + Proxy

Authentication is handled by [Better Auth](https://better-auth.com) with the Prisma adapter.

- **Server config**: `lib/auth.ts` — initialises `betterAuth` with the Prisma adapter
- **Client helpers**: `lib/auth-client.ts` — exports `signIn`, `signOut`, `signUp`, `useSession` (Client Components only)
- **API handler**: `app/api/auth/[...all]/route.ts` — catches all Better Auth HTTP routes

Route protection lives in `proxy.ts` (Next.js 16's name for Middleware). It checks for the `better-auth.session_token` cookie and redirects unauthenticated requests to `/login`.

> **Do a full session check inside every Server Function** — `proxy.ts` only does an optimistic cookie presence check, not a cryptographic verification.

### Database — Prisma 7 + PostgreSQL

- **Schema**: `prisma/schema.prisma`
- **Config**: `prisma.config.ts` (Prisma 7 uses a separate TS config file; connection URL is read via `dotenv/config`)
- **Generated client**: `app/generated/prisma/` (non-standard output path set in the generator)
- **Singleton**: `lib/db.ts` — exports `db`, a single `PrismaClient` instance safe for HMR

Domain models in the schema: `Client`, `SocialAccount`, `ContentItem` (with `Platform` and `ContentStatus` enums). Better Auth tables (`User`, `Session`, `Account`, `Verification`) are also defined there.

### Next.js 16 — Key Differences from Earlier Versions

Before writing any Next.js code, read the guides in `node_modules/next/dist/docs/`.

- **Middleware is now called Proxy** — the file is `proxy.ts` (not `middleware.ts`), and the exported function is `proxy` (not `middleware`)
- **Server Actions are now called Server Functions** — use the `'use server'` directive the same way, but the correct terminology is "Server Function"; "Server Action" refers specifically to one used in a form `action` prop
- **params is a Promise** — in dynamic routes, `params` must be awaited: `const { id } = await params`
- **Instant navigation** — if you need instant client-side navigation, export `unstable_instant` from the route (Suspense alone is not enough; read `docs/01-app/02-guides/instant-navigation.mdx`)

### Component Conventions

- All components are Server Components by default
- Add `'use client'` only when you need state, event handlers, lifecycle hooks, or browser APIs
- Pass server-fetched data down as props to Client Components rather than fetching inside them

### Tailwind 4

This project uses Tailwind CSS v4, which has breaking changes from v3. PostCSS config is in `postcss.config.mjs`. There is no `tailwind.config.ts` — configuration is done via CSS `@theme` blocks. See `node_modules/next/dist/docs/01-app/02-guides/tailwind-v3-css.md` for migration notes if adapting v3 patterns.

## Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | 32+ character random secret for signing sessions |
| `BETTER_AUTH_URL` | Canonical base URL of the app (used by Better Auth for redirects) |

Copy `.env` to `.env.local` and fill in real values. Never commit `.env.local`.
