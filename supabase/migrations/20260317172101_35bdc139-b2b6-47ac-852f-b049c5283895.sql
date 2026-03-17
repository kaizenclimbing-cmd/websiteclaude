ALTER TABLE consultation_submissions
  ADD COLUMN onboarding_stage text NOT NULL DEFAULT 'submitted';

CREATE POLICY "Admins can update consultation submissions"
  ON consultation_submissions FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));