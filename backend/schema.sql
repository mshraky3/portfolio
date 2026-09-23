-- Portfolio visitor data. Lives in its own schema `portfolio` on the Supabase
-- database, reached only through the role `portfolio_app`, which can use this
-- schema and nothing else. Anonymous by design: a random visitor id kept in the
-- browser, the country Vercel derives from the request, and coarse device facts.
-- No names, no emails, no IP addresses. Safe to re-run.

create schema if not exists portfolio;

create table if not exists portfolio.visits (
  id bigserial primary key,
  vid uuid not null,
  created_at timestamptz not null default now(),
  source text,          -- instagram, linkedin, google, github, direct, other
  referrer text,        -- referrer host only
  country text,         -- two-letter code from Vercel
  device text,          -- mobile | tablet | desktop
  browser text,         -- chrome, safari, firefox, edge, other
  in_app text,          -- instagram, facebook, linkedin, or null
  lang text,
  screen_w int
);
create index if not exists visits_created_idx on portfolio.visits (created_at);
create index if not exists visits_vid_idx on portfolio.visits (vid);

create table if not exists portfolio.events (
  id bigserial primary key,
  vid uuid not null,
  created_at timestamptz not null default now(),
  kind text not null,   -- section, cv, contact, react, share
  detail text,
  value int
);
create index if not exists events_kind_idx on portfolio.events (kind, created_at);

-- One reaction per visitor: how the site landed (0 to 100 on the emoji
-- slider) and what brought them here. Changing it updates the same row.
create table if not exists portfolio.reactions (
  vid uuid primary key,
  score int check (score between 0 and 100),
  intent text check (intent in ('hiring', 'project', 'looking', 'friend')),
  country text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists reactions_updated_idx on portfolio.reactions (updated_at desc);

-- One-line notes to the owner. Never shown on the site.
create table if not exists portfolio.notes (
  id bigserial primary key,
  vid uuid not null,
  note text not null check (char_length(note) between 1 and 280),
  country text,
  created_at timestamptz not null default now()
);
