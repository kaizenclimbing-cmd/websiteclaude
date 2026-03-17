ALTER TABLE public.consultation_submissions
ADD COLUMN IF NOT EXISTS call_scheduled_at timestamp with time zone;