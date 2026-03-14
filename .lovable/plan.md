
## What we're building

A private admin dashboard at `/admin` where Buster can log in and view all contact form submissions stored in a Supabase database. The contact form will also be wired up to save to that database instead of just logging to the console.

---

## The full picture

```text
Public site                    Admin area
-----------                    ----------
/contact  ──saves to──►  Supabase DB  ◄──reads from──  /admin (login required)
                                                         /admin/login
```

---

## What gets built

### 1. Supabase setup (database + auth)
- **`contact_submissions` table** — columns: `id`, `first_name`, `last_name`, `email`, `message`, `interests` (text array), `submitted_at`
- **RLS policies** — anonymous users can INSERT (submit form), only authenticated admin can SELECT (view submissions)
- **`app_role` enum + `user_roles` table** — stores `admin` role separately from auth users (secure pattern)
- **`has_role()` security definer function** — used in RLS policies to avoid recursion

### 2. New pages
- **`/admin/login`** — email + password login form styled in the site's brand colours
- **`/admin`** — protected dashboard showing all submissions in a table: name, email, interests, date. Includes a logout button.

### 3. Updated contact form (`Contact.tsx`)
- On submit: insert row into `contact_submissions` via Supabase client
- Loading spinner while saving
- Same success message as now, but data is now persisted

### 4. Auth guard
- A `ProtectedRoute` component wraps `/admin` — if not logged in, redirects to `/admin/login`
- Session managed via Supabase `onAuthStateChange`

---

## Files to create / edit

| File | Action |
|------|--------|
| Supabase migration | Create `contact_submissions` table, `user_roles` table, RLS policies, `has_role()` function |
| `src/lib/supabase.ts` | Supabase client setup |
| `src/pages/admin/Login.tsx` | Login page |
| `src/pages/admin/Dashboard.tsx` | Submissions table dashboard |
| `src/components/ProtectedRoute.tsx` | Auth guard wrapper |
| `src/pages/Contact.tsx` | Wire up Supabase insert on submit |
| `src/App.tsx` | Add `/admin` and `/admin/login` routes |

---

## Technical notes
- Buster's admin account gets created manually via the Supabase dashboard (Auth → Users → Invite user) — no public signup flow
- The admin role is assigned by inserting a row into `user_roles` — not stored on the user profile (prevents privilege escalation)
- The `/admin` route is not linked in the main navigation — it's a direct URL only Buster knows
