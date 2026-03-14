CREATE POLICY "Anon can read contact submissions"
ON public.contact_submissions
FOR SELECT
TO anon
USING (true);