# SlotRescue AI
Sponsored by Creignificent LLC.

Turn a canceled appointment into a filled slot. The owner stays in control.

## What this build is

V1 operational command center. It runs in the browser with local persistence so a service business can practice the revenue-recovery path at $0.

Sample shop data is labeled sample. It is not a live customer book.

These are not connected until you add keys:

- Google Gemini (offer copy only; never invents slots, prices, or availability)
- Resend (email delivery)
- Supabase Auth + Postgres (multi-user isolation)
- Stripe Checkout (Pro subscription only — SlotRescue does not collect the service payment)

The booking lock is real inside this app: the first valid reservation confirms, the second is rejected.

## Open it

Open `index.html`. On a phone, use the command center after the landing page.

Primary action: **FIND A REPLACEMENT CUSTOMER**

## Path

Cancellation → availability check → waitlist match → grounded offer → human approval → customer claim → atomic confirm → revenue record → audit

Kill switch in Settings stops new sends. Export and delete are on the same screen.

## Production schema

`schema.sql` is the Supabase shape: businesses, memberships, services, appointments, waitlist, consent, campaigns, reservations, deliveries, subscriptions, audit. Every query in a hosted build must filter by `business_id`.

## Stack when you add keys

Next.js + TypeScript + Tailwind on Vercel. Gemini for drafts. Supabase for auth and data. Resend for email. Stripe for the $29 Pro plan. Service payment stays on the shop's existing system.
