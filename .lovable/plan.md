
## My recommendation and the plan

### Which flow is better?

**Login → Consultation Form → Onboarding Guide → Pay & Book** is the stronger choice. Here's why:

- When someone fills out the consultation form without an account, you lose the ability to link their form to their payment and their booking. If they abandon partway through, you can't follow up reliably.
- Having them log in first means their draft saves to their account (not just their browser), so they can truly pick it up on any device.
- After they submit the form, showing an onboarding guide ("here's how coaching works, here's what's next") is the right moment — they're engaged, they've invested time, and they're ready to be told what to do next.
- The /book page already has the "payment first" notice on it, so the natural end of the funnel is: pay → come back to /book to schedule.

The competing flow (form → login → pay) is worse because an anonymous form submission can't be claimed by a login created afterwards without extra complexity.

---

### The full flow

```
/consultation  →  Sign Up / Log In  →  Form  →  Onboarding Guide  →  Pay  →  /book
                  (wall shown if         (saved to account)   (what to expect,        (unlocked after
                   not logged in)                              next steps, payment     payment confirm)
                                                               link)
```

### What to build

**1. Auth — sign up / log in wall**
- New page: `/consultation/auth` — simple email + password sign-up or log-in form, branded to match the site.
- After auth, redirect to `/consultation/form`.

**2. Consultation form — linked to user account**
- Add a `user_id` column to `consultation_submissions` (nullable, so existing anonymous rows are preserved).
- Update RLS: authenticated users can only read their own submission; insert requires auth.
- On submit, attach `auth.uid()` to the row.
- Draft auto-save moves from localStorage → database (so it works across devices).

**3. Post-submit onboarding guide page** (`/consultation/next`)
- Shown immediately after the form is submitted.
- Branded page with 3 steps shown as a visual timeline:
  1. ✓ Consultation submitted — we'll review within 72 hours
  2. Make payment — link to their payment page
  3. Book your call — /book (greyed out with "complete payment first" note)
- Explains what to expect from the coaching relationship.

**4. Email: confirmation to client**
- Triggered on form submit via edge function (already have email infra on notify.kaizenclimbing.com).
- Contains the onboarding steps summary + payment link.

**5. Email: lead notification to you**
- Already exists for contact form — add the same for consultation submissions if not already wired up.

---

### Database changes

```sql
-- Add user_id to consultation_submissions (nullable — keeps existing anonymous rows)
ALTER TABLE consultation_submissions ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add a draft table for mid-form saves linked to account
CREATE TABLE consultation_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  draft_data jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE consultation_drafts ENABLE ROW LEVEL SECURITY;
-- Users can only see/edit their own draft
CREATE POLICY "Users manage own draft" ON consultation_drafts FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
```

---

### Files to create / modify

| File | Change |
|------|--------|
| `src/pages/Consultation.tsx` | Split into auth gate → form → success |
| `src/pages/consultation/Auth.tsx` | New: sign up / log in page |
| `src/pages/consultation/Form.tsx` | New: form page (auth required, drafts saved to DB) |
| `src/pages/consultation/Next.tsx` | New: onboarding guide / next steps page |
| `src/App.tsx` | Add new routes |
| `supabase/functions/send-consultation-confirmation/index.ts` | New: email to client on submit |
| DB migration | Add `user_id` to `consultation_submissions`, create `consultation_drafts` |

The /book page stays as-is — it's already a clean landing. The onboarding guide just links to it with a "complete payment first" reminder.
