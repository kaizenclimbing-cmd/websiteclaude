
CREATE TABLE public.consultation_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submitted_at timestamp with time zone NOT NULL DEFAULT now(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  location text,
  email text NOT NULL,
  phone text,
  years_climbing text,
  occupation text,
  currently_injured boolean,
  injury_history text,
  climbing_training_history text,
  goals text,
  perceived_strengths text,
  perceived_weaknesses text,
  training_facilities text,
  training_time_per_week text,
  preferred_disciplines text[],
  hardest_sport_redpoint text,
  hardest_sport_in_a_day text,
  hardest_sport_onsight text,
  hardest_boulder_redpoint text,
  hardest_boulder_flash text,
  hardest_boulder_in_a_day text
);

ALTER TABLE public.consultation_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit consultation form"
ON public.consultation_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can view consultation submissions"
ON public.consultation_submissions
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anon can read consultation submissions"
ON public.consultation_submissions
FOR SELECT
TO anon
USING (true);
