
-- Create app_role enum
create type public.app_role as enum ('admin');

-- Create user_roles table (roles stored separately — no privilege escalation risk)
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- Security definer function to check roles (avoids RLS recursion)
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- Only admins can manage user_roles
create policy "Admins can select user_roles"
  on public.user_roles
  for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can insert user_roles"
  on public.user_roles
  for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update user_roles"
  on public.user_roles
  for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete user_roles"
  on public.user_roles
  for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Create contact_submissions table
create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  message text,
  interests text[],
  submitted_at timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;

-- Anonymous and authenticated users can INSERT (public contact form)
create policy "Anyone can submit contact form"
  on public.contact_submissions
  for insert
  to anon, authenticated
  with check (true);

-- Only admins can SELECT submissions
create policy "Admins can view all submissions"
  on public.contact_submissions
  for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));
