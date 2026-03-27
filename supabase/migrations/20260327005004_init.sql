-- Site visits
create table if not exists "site_visits" (
  "id" uuid primary key default gen_random_uuid(),
  "visited_at" timestamptz not null default now(),
  "path" text,
  "referrer" text,
  "user_agent" text
);

-- Newsletter signups
-- Using CITEXT is handy for case-insensitive email uniqueness.
create extension if not exists citext with schema extensions;

create table if not exists "newsletter_signups" (
  "id" uuid primary key default gen_random_uuid(),
  "email" extensions.citext not null unique,
  "signed_up_at" timestamptz not null default now()
);


