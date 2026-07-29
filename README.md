# Carrom Matchbook

Carrom Matchbook is a mobile-first tournament management MVP for local carrom events. It combines public tournament discovery, organizer operations, singles and doubles match handling, and player statistics in one Next.js codebase.

## Stack

- Next.js App Router with TypeScript
- Tailwind CSS
- Supabase Auth and PostgreSQL
- Typed domain models and validation

## Included in this scaffold

- Public routes for tournaments, player profiles, rankings, about, and contact
- Organizer routes for dashboard, tournament creation, player management, team management, fixtures, result entry, publish flow, and settings
- A Supabase SQL schema for Phase 1
- Zod validation and statistics helpers
- Seeded domain data to keep the routes demonstrable before Supabase wiring is completed

## Local setup

1. Install dependencies with your preferred package manager.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`.
3. Run `npm run dev`.
4. Apply `supabase/schema.sql` to your Supabase project before switching off the seeded data source.

## Architecture notes

- Product and route architecture: [docs/product-architecture.md](/D:/Carroms/docs/product-architecture.md)
- Database schema: [supabase/schema.sql](/D:/Carroms/supabase/schema.sql)
