
## Context

The user wants to add an RLS policy on `contact_submissions` so their separate CRM Lovable project can read submissions using the anon key + the Supabase URL they copied in.

Currently the only SELECT policy requires the user to be authenticated with the `admin` role. The CRM project using just the URL + anon key will be making requests as an anonymous (unauthenticated) user, so it gets blocked.

## Security note

This is PII data (names, emails, messages). Adding a public anon-readable policy means anyone with the anon key (which is public/embeddable in frontend code) can read all submissions. This is a trade-off the user is consciously making to connect their own CRM project.

## What to add

A single new RLS policy:

```sql
CREATE POLICY "Anon can read contact submissions"
ON public.contact_submissions
FOR SELECT
TO anon
USING (true);
```

This allows the CRM project (using the anon key) to `SELECT` from `contact_submissions`.

## Files affected

- One database migration adding the SELECT policy for the `anon` role on `contact_submissions`
- No code changes needed — the CRM reads directly via the Supabase client

## One caveat to flag

Since the anon key is embedded in frontend code, this effectively makes all submission data readable to anyone who knows the project URL and anon key. It's fine for an internal CRM but worth noting. If the user later wants to lock it down again, they can remove this policy.
