
## What the user wants

The dashboard (`/consultation/next`) should be the **home base** — the first thing a logged-in user lands on. From there, they click into the consultation form as step 1. Once submitted, they return to the dashboard and watch the remaining steps unlock.

**New flow:**
```
/consultation/auth  →  /consultation/next  (dashboard, always)
                              ↓
                    Step 1: COMPLETE FORM  → /consultation/form → back to dashboard
                    Step 2: UNDER REVIEW   (admin advances)
                    Step 3: PAYMENT        (Stripe, later)
                    Step 4: BOOK YOUR CALL (/book)
```

**Current (broken) flow:**
```
/consultation/auth  →  /consultation/form  →  /consultation/next
```
The dashboard redirects away to the form if no submission exists — instead it should show the form as step 1 with a CTA to go complete it.

---

## Changes needed

### 1. `src/pages/consultation/Next.tsx` — dashboard logic

**Auth guard**: if not logged in → `/consultation/auth`. That stays.

**No-submission state**: currently redirects to `/consultation/form`. Change this: instead of redirecting, show the dashboard in a **pre-submission state** where step 1 ("Complete Consultation Form") is `current` and steps 2–4 are `locked`.

Add a new first step to the STEPS array:
```
01 — COMPLETE YOUR FORM     current/done    CTA: "START FORM" → /consultation/form
02 — UNDER REVIEW           locked/current
03 — COMPLETE PAYMENT       locked/current
04 — BOOK YOUR CALL         locked/current
```

The `stage` logic needs a new pre-submission state. Options:
- Add `"not_started"` as a virtual stage (not stored in DB — just derived when `data` is null)
- Map it: `not_started → submitted → reviewed → paid → booked`

**Stage-to-step mapping** (5 stages, 4 steps + step 0):

| State | Step 1 (Form) | Step 2 (Review) | Step 3 (Payment) | Step 4 (Book) |
|---|---|---|---|---|
| not_started | current | locked | locked | locked |
| submitted | done | current | locked | locked |
| reviewed | done | done | current | locked |
| paid | done | done | done | current |
| booked | done | done | done | done |

New greeting when `not_started`: use the user's email (since no `first_name` yet) or just "HEY THERE".

### 2. `src/pages/consultation/Form.tsx` — post-submit redirect

Already redirects to `/consultation/next` on submit (line 228) — this stays correct. No change needed.

### 3. `src/App.tsx` — route for `/consultation`

Currently `/consultation` and `/consultation/auth` both point to `ConsultationAuth`. After login, users should land on the dashboard. The auth page already redirects to `/consultation/form` on login success — change that redirect to `/consultation/next`.

**File: `src/pages/consultation/Auth.tsx`** — on successful sign-in, navigate to `/consultation/next` instead of `/consultation/form`.

---

## Files to change

| File | Change |
|---|---|
| `src/pages/consultation/Next.tsx` | Support `not_started` state (no submission row), show form as step 1 with CTA, greeting without first_name |
| `src/pages/consultation/Auth.tsx` | On sign-in success, redirect to `/consultation/next` instead of `/consultation/form` |
