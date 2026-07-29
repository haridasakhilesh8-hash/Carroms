create extension if not exists pgcrypto;

create type app_role as enum ('organizer', 'admin');
create type tournament_visibility as enum ('public', 'private');
create type tournament_status as enum ('draft', 'registration_open', 'upcoming', 'ongoing', 'completed', 'cancelled');
create type category_type as enum ('singles', 'doubles');
create type competition_format as enum ('knockout', 'round_robin', 'group_knockout');
create type participant_status as enum ('registered', 'confirmed', 'withdrawn', 'eliminated', 'winner', 'runner_up');
create type skill_level as enum ('beginner', 'intermediate', 'advanced', 'professional');
create type match_status as enum ('scheduled', 'live', 'completed', 'postponed', 'cancelled', 'abandoned');
create type result_type as enum ('normal', 'walkover', 'player_withdrawal', 'team_withdrawal', 'disqualification', 'cancelled', 'abandoned');
create type award_type as enum ('winner', 'runner_up', 'semifinalist', 'best_performer', 'most_competitive_match');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  role app_role not null default 'organizer',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.tournaments (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  slug text not null unique,
  logo_url text,
  description text not null default '',
  organizer_name text not null,
  location text not null,
  start_date date not null,
  end_date date not null,
  registration_closes_on date,
  format competition_format not null,
  best_of smallint not null default 1,
  visibility tournament_visibility not null default 'public',
  status tournament_status not null default 'draft',
  is_published boolean not null default false,
  rules text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint tournaments_dates_check check (end_date >= start_date),
  constraint tournaments_best_of_check check (best_of > 0)
);

create table public.tournament_categories (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  type category_type not null,
  label text not null,
  format competition_format not null,
  participant_limit integer,
  best_of smallint not null default 1,
  ranking_points_win integer not null default 3,
  ranking_bonus_winner integer not null default 10,
  ranking_bonus_runner_up integer not null default 6,
  ranking_bonus_semifinal integer not null default 3,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tournament_id, type)
);

create table public.players (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  full_name text not null,
  display_name text not null,
  mobile text,
  email text,
  image_url text,
  city text,
  organization text,
  skill_level skill_level not null default 'beginner',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.tournament_players (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  status participant_status not null default 'registered',
  seeded_position integer,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tournament_id, player_id)
);

create table public.doubles_teams (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  category_id uuid not null references public.tournament_categories(id) on delete cascade,
  name text not null,
  slug text not null,
  logo_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (category_id, slug)
);

create table public.doubles_team_players (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.doubles_teams(id) on delete cascade,
  tournament_player_id uuid not null references public.tournament_players(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  unique (team_id, tournament_player_id),
  unique (tournament_player_id)
);

create table public.tournament_rounds (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.tournament_categories(id) on delete cascade,
  name text not null,
  sort_order integer not null,
  stage_group text,
  created_at timestamptz not null default timezone('utc', now()),
  unique (category_id, sort_order)
);

create table public.matches (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  category_id uuid not null references public.tournament_categories(id) on delete cascade,
  round_id uuid references public.tournament_rounds(id) on delete set null,
  round_label text not null,
  match_number integer not null,
  side_a_player_id uuid references public.players(id) on delete set null,
  side_b_player_id uuid references public.players(id) on delete set null,
  side_a_team_id uuid references public.doubles_teams(id) on delete set null,
  side_b_team_id uuid references public.doubles_teams(id) on delete set null,
  scheduled_at timestamptz,
  board_number text,
  status match_status not null default 'scheduled',
  result_type result_type,
  best_of smallint not null default 1,
  winner_player_id uuid references public.players(id) on delete set null,
  winner_team_id uuid references public.doubles_teams(id) on delete set null,
  walkover_side text,
  notes text,
  entered_by uuid references public.profiles(id) on delete set null,
  completed_at timestamptz,
  previous_match_a_id uuid references public.matches(id) on delete set null,
  previous_match_b_id uuid references public.matches(id) on delete set null,
  next_match_id uuid references public.matches(id) on delete set null,
  next_match_slot text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (category_id, match_number),
  constraint matches_best_of_check check (best_of > 0),
  constraint matches_side_shape_check check (
    (
      side_a_player_id is not null and side_b_player_id is not null
      and side_a_team_id is null and side_b_team_id is null
    ) or (
      side_a_player_id is null and side_b_player_id is null
      and side_a_team_id is not null and side_b_team_id is not null
    )
  )
);

create table public.match_games (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  game_number integer not null,
  side_a_score integer not null,
  side_b_score integer not null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (match_id, game_number),
  constraint match_games_score_check check (side_a_score >= 0 and side_b_score >= 0)
);

create table public.round_robin_standings (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.tournament_categories(id) on delete cascade,
  player_id uuid references public.players(id) on delete cascade,
  team_id uuid references public.doubles_teams(id) on delete cascade,
  matches_played integer not null default 0,
  wins integer not null default 0,
  losses integer not null default 0,
  games_won integer not null default 0,
  games_lost integer not null default 0,
  points_scored integer not null default 0,
  points_conceded integer not null default 0,
  standing_points integer not null default 0,
  qualification_status text,
  tie_break_note text,
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.player_statistics (
  player_id uuid primary key references public.players(id) on delete cascade,
  tournaments_played integer not null default 0,
  singles_tournaments_played integer not null default 0,
  doubles_tournaments_played integer not null default 0,
  matches_played integer not null default 0,
  matches_won integer not null default 0,
  matches_lost integer not null default 0,
  games_won integer not null default 0,
  games_lost integer not null default 0,
  points_scored integer not null default 0,
  points_conceded integer not null default 0,
  titles integer not null default 0,
  runner_up_finishes integer not null default 0,
  semifinal_appearances integer not null default 0,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  recent_form text[] not null default '{}',
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.team_statistics (
  team_id uuid primary key references public.doubles_teams(id) on delete cascade,
  matches_played integer not null default 0,
  matches_won integer not null default 0,
  matches_lost integer not null default 0,
  games_won integer not null default 0,
  games_lost integer not null default 0,
  points_scored integer not null default 0,
  points_conceded integer not null default 0,
  titles integer not null default 0,
  runner_up_finishes integer not null default 0,
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.player_rankings (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  ranking_type category_type,
  points integer not null default 0,
  wins integer not null default 0,
  titles integer not null default 0,
  updated_at timestamptz not null default timezone('utc', now()),
  unique (player_id, ranking_type)
);

create table public.tournament_awards (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  category_id uuid references public.tournament_categories(id) on delete cascade,
  player_id uuid references public.players(id) on delete set null,
  team_id uuid references public.doubles_teams(id) on delete set null,
  award_type award_type not null,
  title text not null,
  image_url text,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid references public.tournaments(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index tournaments_owner_idx on public.tournaments(owner_id);
create index tournament_categories_tournament_idx on public.tournament_categories(tournament_id);
create index tournament_players_tournament_idx on public.tournament_players(tournament_id);
create index matches_tournament_idx on public.matches(tournament_id);
create index matches_category_status_idx on public.matches(category_id, status);
create index standings_category_idx on public.round_robin_standings(category_id);
create index awards_tournament_idx on public.tournament_awards(tournament_id);
create index activity_logs_tournament_idx on public.activity_logs(tournament_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.tournaments enable row level security;
alter table public.tournament_categories enable row level security;
alter table public.players enable row level security;
alter table public.tournament_players enable row level security;
alter table public.doubles_teams enable row level security;
alter table public.doubles_team_players enable row level security;
alter table public.tournament_rounds enable row level security;
alter table public.matches enable row level security;
alter table public.match_games enable row level security;
alter table public.round_robin_standings enable row level security;
alter table public.player_statistics enable row level security;
alter table public.team_statistics enable row level security;
alter table public.player_rankings enable row level security;
alter table public.tournament_awards enable row level security;
alter table public.activity_logs enable row level security;

create policy "public read published tournaments"
on public.tournaments
for select
using (visibility = 'public' and is_published = true);

create policy "organizers manage own tournaments"
on public.tournaments
for all
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);
