import { adminClient } from "@/lib/supabase";
import { json } from "@/lib/http";
import { stripeClient } from "@/lib/stripe";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get("stripe-signature");
  if (!secret || !signature) return json({ error: "Webhook signature missing." }, 400);
  const stripe = stripeClient();
  const payload = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch {
    return json({ error: "Invalid webhook signature." }, 400);
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const businessId = session.metadata?.business_id;
    if (businessId && session.customer && session.subscription) {
      const admin = adminClient();
      await admin.from("subscriptions").upsert({
        business_id: businessId,
        plan: "pro",
        stripe_customer_id: String(session.customer),
        stripe_subscription_id: String(session.subscription),
        status: "active"
      }, { onConflict: "business_id" });
      await admin.from("audit_events").insert({
        business_id: businessId,
        action: "billing",
        detail: "Stripe checkout completed. Pro marked active. Service payments are not collected here."
      });
    }
  }
  return json({ received: true });
}
