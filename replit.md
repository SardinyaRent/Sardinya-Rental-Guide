# Sardinya — Guida al noleggio

Guida informativa multilingue per i clienti Sardinya: sedi, ritiro, utilizzo e riconsegna dell'auto, contatti e assistenza.

## Run & Operate

- Install dependencies with `pnpm install --frozen-lockfile` (Node.js 24, pnpm 10).
- Start the existing managed workflow `artifacts/sardinya-rentals: web` for the website at `/`.
- Start `artifacts/api-server: API Server` for `/api/healthz`.
- The optional `artifacts/mockup-sandbox: Component Preview Server` workflow serves existing design previews at `/__mockup`.
- Start services through their managed workflows: these supply `PORT`, `BASE_PATH`, and preview routing. Do not run a root-level `pnpm dev`.
- `pnpm --filter @workspace/sardinya-rentals run dev` — frontend workflow command
- `pnpm --filter @workspace/api-server run dev` — API workflow command
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- No secrets, database, or external services are needed for the current informational guide or API health endpoint.
- The unused database library requires `DATABASE_URL` only if future features actually use it. Do not push a database schema just to run this guide.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB tooling: PostgreSQL + Drizzle ORM (not used by current application)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/sardinya-rentals/src/App.tsx` — guide screens and routing
- `artifacts/sardinya-rentals/src/i18n.ts` — Italian, English, Spanish, French, German, and Dutch copy
- `artifacts/sardinya-rentals/src/assets/` — logo and guide illustrations
- `artifacts/api-server/src/routes/` — API health endpoint
- `artifacts/mockup-sandbox/` — existing design previews, separate from the customer site
- `lib/` — shared API specification, generated clients/validation, and optional database tooling

## Architecture decisions

Keep the imported structure and stack. The guide is client-side and does not depend on the API or database to display its content.

## Product

Customers choose an office and read departure, rental, and return instructions, with dedicated contact and assistance pages.

## User preferences

This setup is for running the imported project on Replit; do not redesign or migrate it as part of setup.

## Gotchas

- Keep the lockfile in sync with dependency changes. During import setup, the package firewall rejected the old `proxy-addr` dependency; updating Express within major version 5 resolved installation without bypassing the firewall.
- Vite requires workflow-provided `PORT` and `BASE_PATH`; use managed workflows for preview.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
