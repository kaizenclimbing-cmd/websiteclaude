
## Summary of findings

**Email verification redirect** — line 31 in `Auth.tsx`:
```
options: { emailRedirectTo: `${window.location.origin}/consultation/form` },
```
This sends new users to `/consultation/form` after clicking the email link. It needs to point to `/consultation/next` instead.

**CRM question** — There is no CRM webhook or integration in the codebase. What does exist:
- **Contact form** (`/contact`) → fires `send-admin-notification` (email to `Info@kaizenclimbing.co.uk`) + `send-contact-confirmation` (email to user)
- **Consultation form** → fires `send-consultation-confirmation` (email to user + admin notification to `Info@kaizenclimbing.co.uk`)

Both trigger notification emails to you when someone submits — so you do get notified by email about new enquiries and consultations. However, there is **no direct CRM push** (e.g. no webhook to HubSpot, Pipedrive, etc.). The "CRM getting updates" you remember was most likely these notification emails landing in your inbox, which your CRM may pick up from. That setup is still working as-is.

---

## Plan: one change, one clarification

### Change — Fix email verification redirect

**File**: `src/pages/consultation/Auth.tsx`, line 31

```
// Before
options: { emailRedirectTo: `${window.location.origin}/consultation/form` },

// After  
options: { emailRedirectTo: `${window.location.origin}/consultation/next` },
```

That's the only code change needed. After clicking the verification link in their email, new users will land on the dashboard (`/consultation/next`) where step 1 (the form) is waiting for them — exactly as intended.

---

### On the CRM question

The notification emails to `Info@kaizenclimbing.co.uk` are still in place and firing correctly for both the contact form and consultation form. If your CRM was picking those up automatically (e.g. via email parsing or a connected inbox), that is still happening — nothing was removed.

If you want a direct data push to a CRM (e.g. so a new consultation submission creates a contact record automatically without going via email), that would be a separate integration we could add later — but nothing is broken right now.
