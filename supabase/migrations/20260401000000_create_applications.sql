-- Applications table for Kaizen Plan sign-up flow
-- Applicants submit this BEFORE creating an account or paying.
-- Buster reviews and accepts/declines from the admin dashboard.

create type public.application_status as enum ('pending', 'accepted', 'declined');

create table public.applications (
  id                    uuid primary key default gen_random_uuid(),
  -- Contact
  first_name            text not null,
  last_name             text not null,
  email                 text not null,
  phone                 text,
  -- Climbing background
  current_grade         text not null,
  target_grade          text not null,
  years_climbing        text not null,
  preferred_discipline  text not null,  -- 'sport', 'bouldering', 'both'
  -- Goals & history
  goals                 text not null,
  training_history      text not null,
  currently_injured     boolean not null default false,
  injury_details        text,
  -- Logistics
  hours_per_week        text not null,
  budget_confirmed      boolean not null default false,
  why_now               text not null,
  -- Admin
  status                public.application_status not null default 'pending',
  admin_notes           text,
  submitted_at          timestamptz not null default now(),
  reviewed_at           timestamptz
);

alter table public.applications enable row level security;

-- Anyone (anon) can submit an application — no account needed
create policy "Anyone can submit application"
  on public.applications
  for insert
  to anon, authenticated
  with check (true);

-- Only admins can read/update applications
create policy "Admins can view applications"
  on public.applications
  for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update applications"
  on public.applications
  for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));
