-- Free finger training guide lead capture (modal / inline CTAs)
-- Anon may insert only when marketing consent is explicitly true.

create table public.finger_guide_leads (
  id                 uuid primary key default gen_random_uuid(),
  email              text not null,
  consent_marketing  boolean not null,
  source             text not null,
  created_at         timestamptz not null default now(),
  constraint finger_guide_leads_source_check check (
    source in ('slide_up', 'inline_home', 'inline_training')
  ),
  constraint finger_guide_leads_consent_check check (consent_marketing = true)
);

comment on table public.finger_guide_leads is 'Lead magnet signups for the free finger training guide; consent required for GDPR/marketing.';

alter table public.finger_guide_leads enable row level security;

create policy "Anyone may submit finger guide lead with consent"
  on public.finger_guide_leads
  for insert
  to anon, authenticated
  with check (consent_marketing is true);

create policy "Admins can view finger guide leads"
  on public.finger_guide_leads
  for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));
