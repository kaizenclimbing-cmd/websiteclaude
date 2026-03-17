
## What you're describing

After payment is confirmed, instead of jumping straight to "BOOK YOUR CALL", show the client a summary screen that:

1. Confirms their payment
2. Displays key information about what they've committed to (plan details, billing cadence, refund window, and the fact that once they book the call and planning starts, refunds are no longer available)
3. Has a "I UNDERSTAND — BOOK MY CALL" button that takes them to `/book`

This is the natural place to surface this — they've paid, they're reading carefully, and you're setting expectations before the point of no return (booking the call).

**No Stripe changes needed.** This is purely a UI update to the `PaymentSuccess.tsx` page.

---

## Changes

**`src/pages/consultation/PaymentSuccess.tsx`** — update the `success` state to show:

- Payment confirmed banner (keep existing)
- A styled info block with two sections:
  - **Your plan**: name, billing amount, billing cadence (or one-off), minimum commitment if applicable
  - **Refund policy**: you have 14 days from today to request a refund — once your call is booked and your programme begins, no refunds are available
- CTA button: `I UNDERSTAND — BOOK MY CALL →` linking to `/book`
- Secondary link: `VIEW FULL TERMS` linking to `/terms` (opens in same tab)

**`src/pages/Terms.tsx`** — update the Refund Policy section body to explicitly state: *"Once your onboarding call has been booked and your training programme has started, no refund is available. Prior to that, you may request a refund within 14 days of payment."*

---

## Layout sketch

```text
[ ✓ PAYMENT CONFIRMED ]

  You're signed up for The Kaizen Plan.

  ┌─────────────────────────────────────────┐
  │  YOUR PLAN                              │
  │  £200 billed every 4 weeks              │
  │  Minimum commitment: 12 weeks           │
  │  Cancel with 2 weeks' notice            │
  ├─────────────────────────────────────────┤
  │  REFUND POLICY                          │
  │  You have 14 days from today to cancel  │
  │  for a refund. Once your onboarding     │
  │  call is booked and your programme      │
  │  begins, no refund is available.        │
  └─────────────────────────────────────────┘

  [ I UNDERSTAND — BOOK MY CALL → ]

  View full terms & conditions
```

---

## Technical details

- Plan details are derived from the `plan` query param already present in the URL (`?plan=kaizen_plan` or `?plan=six_week_peak`)
- The 14-day refund window date is calculated client-side from `new Date()` at render time (approximate — exact date is on their payment receipt from Stripe)
- No database changes or edge function changes required
