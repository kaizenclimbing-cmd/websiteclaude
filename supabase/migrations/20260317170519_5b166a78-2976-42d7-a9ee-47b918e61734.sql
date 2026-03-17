-- Add user_id to consultation_submissions (nullable to preserve existing anonymous rows)
ALTER TABLE public.consultation_submissions 
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add index for user_id lookups
CREATE INDEX idx_consultation_submissions_user_id ON public.consultation_submissions(user_id);

-- Update RLS: authenticated users can read their own submission
CREATE POLICY "Users can view their own consultation" ON public.consultation_submissions
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Create consultation_drafts table for cross-device auto-save
CREATE TABLE public.consultation_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  draft_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.consultation_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own draft" ON public.consultation_drafts
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Trigger to keep updated_at fresh
CREATE OR REPLACE FUNCTION public.update_consultation_draft_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_consultation_drafts_updated_at
BEFORE UPDATE ON public.consultation_drafts
FOR EACH ROW EXECUTE FUNCTION public.update_consultation_draft_timestamp();