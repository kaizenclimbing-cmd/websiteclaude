
## What the user is asking for

Two things:
1. **Client dashboard** (`/consultation/next`) — make it a live, data-driven progress tracker that reads their actual onboarding status from the database. This is the priority.
2. **Admin dashboard** — add a "Kanban-style" pipeline view per consultation client, showing which stage they're at, with controls to move them forward (reviewed → paid → booked). No CRM for now — just simple stage management.

---

## Current state

- `/consultation/next` — fully static, hardcoded `done/next/locked`. No DB reads.
- `consultation_submissions` — no `payment_status` or any stage column. No UPDATE RLS policy.
- Admin dashboard — read-only expandable cards. No stage controls.

---

## Plan

### 1. Database migration
Add two columns to `consultation_submissions`:

```sql
ALTER TABLE consultation_submissions
  ADD COLUMN onboarding_stage text NOT NULL DEFAULT 'submitted';
-- Stages: 'submitted' → 'reviewed' → 'paid' → 'booked'

-- RLS: users can SELECT their own row (already exists), admins can UPDATE
CREATE POLICY "Admins can update consultation submissions"
  ON consultation_submissions FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
```

Single `onboarding_stage` text column drives both the client dashboard and admin pipeline. Stages: `submitted → reviewed → paid → booked`.

---

### 2. Client dashboard — `/consultation/next` (live, auth-aware)

On load:
- Check `supabase.auth.getUser()` — if not logged in, redirect to `/consultation/auth`
- Fetch user's own row from `consultation_submissions` where `user_id = auth.uid()`
- If no row found, redirect to `/consultation/form`
- Derive step statuses from `onboarding_stage`:

```text
Stage        Step 1 (Submitted)   Step 2 (Under Review)   Step 3 (Payment)   Step 4 (Book Call)
submitted    done                 current                 locked             locked
reviewed     done                 done                    current            locked
paid         done                 done                    done               current
booked       done                 done                    done               done
```

Add a 4th step — "UNDER REVIEW" — between Submitted and Payment. This gives the client accurate visibility that it's not just waiting on them to pay immediately.

Show a brief **"How coaching works"** intro above the timeline (2–3 sentences: consultation review → personalised plan → regular check-ins).

Show loading skeleton while fetching. Show user's first name in the greeting.

---

### 3. Admin dashboard — pipeline view for consultations

Add a new section / tab to the admin dashboard: **"Pipeline"** — a horizontal Kanban-style lane view showing consultation clients by stage.

Layout:
```
[ SUBMITTED ]    [ UNDER REVIEW ]    [ PAYMENT ]    [ BOOKED ]
  Jane Smith        Alex Brown          —               —
  Tom Clarke        —                   —               —
```

Each card in the pipeline shows: name, submitted date, and a **"→ Move to next stage"** button (or a simple dropdown for stage). Clicking it does an UPDATE on `onboarding_stage` for that row.

The existing "All Enquiries" list view stays intact — the Pipeline is a second tab alongside it.

---

### Files to change

| File | Change |
|------|--------|
| DB migration | Add `onboarding_stage` column + admin UPDATE RLS policy |
| `src/pages/consultation/Next.tsx` | Rewrite as live auth-aware dashboard, 4 steps, real DB data |
| `src/pages/admin/Dashboard.tsx` | Add Pipeline tab with stage lanes and advance-stage controls |
