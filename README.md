# SlotRescue AI — Production migration scaffold
**Sponsored by CREIGNIFICENT LLC.**

This is an **implementation-in-progress**, not a production-ready application. It adds Next.js/TypeScript, Supabase auth and RLS migrations, API endpoints for appointments/waitlists/matching/owner-approved email campaigns, transactional booking RPC, Stripe Checkout/Portal/webhook, and a basic mobile web shell. It is NOT yet a full replacement for the original polished `index.html` command center.

## Local setup
1. `npm install`
2. Copy `.env.example` to `.env.local` and set real keys (never commit secrets).
3. Create a Supabase project and apply `supabase/migrations/001_foundation.sql` through a reviewed migration process.
4. Configure Supabase Auth site URL and email verification.
5. Create an owner user, business and membership in a privileged admin session. Do not expose service-role keys to the browser.
6. Configure Stripe recurring Pro price, webhook endpoint `/api/stripe/webhook`, Resend verified sender, and `NEXT_PUBLIC_APP_URL`.
7. `npm run dev`; `npm run build` before deployment.

## Important gaps before launch
- **Blocker:** no authenticated UI for business provisioning, appointment management, waitlist and owner approval; current pages are an API-first foundation.
- **Blocker:** no integration of Gemini drafting; `/api/match` performs deterministic opt-in/service matching only.
- **Blocker:** no verified end-to-end test, email deliverability test, Stripe sandbox test, or real two-customer concurrency test.
- **Blocker:** implement free-plan quota checks, idempotency for owner-approved sends, retry/outbox email delivery, unsubscribe links, invitation rate limits, and audit of all business changes.
- **Blocker:** harden RLS with role separation, server-side ownership checks for referenced service IDs, and safe business onboarding.
- **Blocker:** `claim_booking` currently uses a privileged service-role call from a public route; apply per-token rate limiting and abuse detection before exposing publicly.
- **Blocker:** add comprehensive integration, security, and E2E tests.
- **Blocker:** preserve/rebuild the original visual dashboard before replacing the existing deployment.

Do not use real customer data or claim production readiness until all blockers are resolved and verified.

## What is in this scaffold
- `index.html` — existing command center. Still the visual product. Also copied to `public/command-center.html`.
- `app/api/appointments` — owner/staff list and create.
- `app/api/waitlist` — opt-in waitlist plus consent row.
- `app/api/match` — deterministic consent and service match. No Gemini.
- `app/api/campaigns` — draft, then owner-only approve-and-send.
- `app/api/book/claim` — calls `claim_booking` via service role. Not safe for public traffic yet.
- `app/api/stripe/checkout|portal|webhook` — Pro subscription only. Does not collect the service payment.
- `supabase/migrations/001_foundation.sql` — tables, RLS, unique confirmed reservation, `claim_booking`.
- `schema.sql` — earlier shape note. The migration file is the one to review.

Service payment stays on the shop's existing system.
