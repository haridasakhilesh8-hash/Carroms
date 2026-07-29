# Carrom Tournament Manager MVP

## Product architecture

The Phase 1 product is organized around four bounded areas:

1. Public discovery: home, tournament directory, tournament detail, player directory, rankings.
2. Organizer operations: dashboard, tournament setup, player management, team management, manual fixture entry, result entry, publish controls.
3. Competition engine: tournament categories, rounds, matches, standings, bracket advancement, and result corrections.
4. Statistics and rankings: player stats, team stats, tournament awards, and transparent ranking points.

## Recommended application architecture

- Frontend: Next.js App Router with server components for read-heavy public pages and client components only for forms, filters, and score entry.
- Styling: Tailwind CSS with a branded design token layer.
- Auth: Supabase Auth for organizer login only in Phase 1.
- Database: PostgreSQL on Supabase with row-level security.
- Data access: typed repository and service layer in `src/lib`.
- Validation: Zod schemas shared across forms and server actions.
- Media: Supabase Storage for tournament logos, player photos, and winner photos.

## Core modules

### Identity and access

- `users`
- organizer-to-tournament ownership checks
- admin-only server actions for writes

### Tournament domain

- tournaments
- tournament categories
- tournament participants
- doubles teams
- tournament rounds
- awards and publish state

### Match domain

- matches
- match games
- bracket advancement metadata
- result corrections with activity logs

### Analytics domain

- player statistics projection
- team statistics projection
- rankings projection
- head-to-head queries for Phase 2

## Page and route structure

### Public routes

- `/`
- `/tournaments`
- `/tournaments/[slug]`
- `/tournaments/[slug]/fixtures`
- `/tournaments/[slug]/results`
- `/tournaments/[slug]/standings`
- `/tournaments/[slug]/bracket`
- `/players`
- `/players/[slug]`
- `/rankings`
- `/about`
- `/contact`

### Organizer routes

- `/login`
- `/signup`
- `/organizer`
- `/organizer/tournaments/new`
- `/organizer/tournaments/[tournamentId]`
- `/organizer/tournaments/[tournamentId]/players`
- `/organizer/tournaments/[tournamentId]/teams`
- `/organizer/tournaments/[tournamentId]/matches`
- `/organizer/tournaments/[tournamentId]/results`
- `/organizer/tournaments/[tournamentId]/publish`
- `/organizer/tournaments/[tournamentId]/settings`

## Main user flows

### Organizer flow

1. Sign up or log in.
2. Create a tournament with one or more categories.
3. Add tournament players.
4. Create doubles teams if doubles is enabled.
5. Add matches manually for Phase 1.
6. Enter results and confirm winners.
7. Review standings, leaders, and pending matches.
8. Publish the tournament page and declare winners after the final.

### Viewer flow

1. Browse tournaments from the home page or directory.
2. Open the public tournament page.
3. Switch between overview, players, teams, fixtures, results, standings, and winners.
4. Open a player profile to inspect recent form and titles.

## MVP implementation sequence

1. Project scaffold, design system, and route shells.
2. Supabase schema, policies, and typed models.
3. Tournament creation and organizer dashboard.
4. Player management and duplicate prevention.
5. Doubles-team management and eligibility rules.
6. Manual match creation for singles and doubles.
7. Result entry, validation, and statistics recalculation hooks.
8. Public tournament pages, player profiles, and rankings.
9. Publish controls, winner declaration, and activity history.

## Edge cases and validation rules

- Tournament slug must be unique.
- A tournament must have at least one category.
- Singles matches require exactly two distinct players.
- Doubles teams require exactly two distinct tournament players.
- A player cannot be assigned to multiple doubles teams in the same tournament category.
- Only registered tournament participants can be used in matches.
- A completed match requires a winner unless the result type is cancelled or abandoned.
- Match winner must be one of the two participating sides.
- Corrected results must trigger statistics recomputation and award recomputation.
- Final winners cannot be declared until the final match is completed.
- Knockout advancement must be idempotent so the same side cannot advance twice.
- Private tournaments should not appear in public directories.
