-- Remove overly permissive anonymous read policies.
-- consultation_submissions: authenticated users already have "Users can view their own consultation"
-- and admins have "Admins can view consultation submissions" — anon read is not needed.
DROP POLICY IF EXISTS "Anon can read consultation submissions" ON public.consultation_submissions;

-- contact_submissions: these should only be readable by admins, not anonymous users.
DROP POLICY IF EXISTS "Anon can read contact submissions" ON public.contact_submissions;

-- Ensure admins can read contact submissions (in case no policy exists yet).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'contact_submissions'
    AND policyname = 'Admins can view contact submissions'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "Admins can view contact submissions"
      ON public.contact_submissions
      FOR SELECT
      TO authenticated
      USING (has_role(auth.uid(), 'admin'::app_role));
    $policy$;
  END IF;
END $$;
