
The user is sharing the content from their previous consultation page — they want that copy (coaching approach, how the process works, what's included, pricing) to be used as the "How Coaching Works" reference section on the `/consultation/next` dashboard page.

## What to change

The current `/consultation/next` page has a very thin intro (2 lines of placeholder text) and a basic "What to Expect" bullet list at the bottom. The user wants to replace/expand this with the richer content from their previous page.

### Layout restructure for `/consultation/next`

The page should be split into two clear sections:

**Section 1 — "How Coaching Works" reference** (above the timeline or expandable)
Pull in the real copy from the user's previous page:
- **Coaching Approach** — the pragmatic/collaborative philosophy paragraph
- **How the Process Works** — the 5-step numbered list (Form → Benchmarking → Payment → Onboarding Call → Start Training)
- **What's Included** — Personalised Plan, WhatsApp support, Weekly check-ins
- **Payment & Commitment** — £600 / 3 months, split payment option

**Section 2 — Your Progress** (the live timeline tracker, stays as-is)
The 4-step tracker (Submitted → Under Review → Payment → Book Call) driven by `onboarding_stage`.

### Approach options

The content is rich — just stacking it all above the timeline would make the page very long. Best approach: put the "How It Works" content **below** the progress tracker in collapsible sections (accordion), or as a clean scrollable section after the tracker. The tracker is the thing they need to action, so it should remain prominent at the top.

**Plan:**
1. Keep the header (Hey, NAME) and the progress tracker at the top — unchanged
2. Replace the thin intro paragraph with 1-2 lines referencing what's below
3. Replace the "What to Expect" box at the bottom with three rich sections using the real copy:
   - **Coaching Approach** (paragraph)
   - **How the Process Works** (numbered list matching the 5 steps from the user's content)
   - **What's Included** (3 items: plan, WhatsApp, weekly check-ins)
   - **Payment** (£600 / 3 months with split option)

No database changes needed — this is purely a copy/content update to `Next.tsx`.

## Files to change

| File | Change |
|------|--------|
| `src/pages/consultation/Next.tsx` | Replace thin intro + "What to Expect" box with full coaching overview copy from the user's previous page — Approach, Process, Included, Payment |
