-- Add plan and stripe_session_id to consultation_submissions
-- plan: which coaching plan was selected (kaizen_plan or six_week_peak)
-- stripe_session_id: used to verify 6-week payments (paid before form is filled)
ALTER TABLE public.consultation_submissions
  ADD COLUMN IF NOT EXISTS plan text,
  ADD COLUMN IF NOT EXISTS stripe_session_id text;
