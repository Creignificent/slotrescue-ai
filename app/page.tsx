const blockers = [
  "No authenticated UI for provisioning, appointments, waitlist, or owner approval.",
  "No Gemini drafting. Match is consent plus service only.",
  "No verified end-to-end, email, Stripe sandbox, or concurrency test.",
  "Free-plan quota, send idempotency, outbox retry, unsubscribe, and rate limits are not built.",
  "RLS still needs role separation and service ownership checks.",
  "claim_booking is called with the service role from a public route.",
  "No integration, security, or E2E tests.",
  "The polished command center is not replaced. Use index.html."
];

export default function Page() {
  return (
    <main style={{ maxWidth: 480, margin: "0 auto", padding: 20 }}>
      <p style={{ letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 12, color: "#9c978e" }}>
        Creignificent LLC
      </p>
      <h1 style={{ fontSize: 36, lineHeight: 1, margin: "12px 0" }}>SlotRescue scaffold</h1>
      <p style={{ color: "#9c978e", lineHeight: 1.45 }}>
        Implementation in progress. Not production-ready. Do not load real customer data.
      </p>
      <a href="/command-center.html" style={{ color: "#e0b15a" }}>Open the existing command center</a>
      <h2 style={{ fontSize: 22 }}>Blockers</h2>
      <ul style={{ color: "#9c978e", paddingLeft: 18 }}>
        {blockers.map((item) => <li key={item} style={{ margin: "8px 0" }}>{item}</li>)}
      </ul>
    </main>
  );
}
