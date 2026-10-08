import { requireMember } from "@/lib/auth";
import { json, missing } from "@/lib/http";

type Person = {
  id: string;
  name: string;
  email: string;
  service_interest: string;
  time_window: string;
  priority: number;
};

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.businessId || !body.appointmentId) return missing("businessId, appointmentId");
  const gate = await requireMember(req, body.businessId);
  if ("error" in gate) return json({ error: gate.error }, gate.status);

  const appt = await gate.supabase
    .from("appointments")
    .select("id, starts_at, status, price_cents, staff_name, service_id")
    .eq("id", body.appointmentId)
    .eq("business_id", body.businessId)
    .single();
  if (appt.error || !appt.data) return json({ error: "Appointment not found." }, 404);
  if (appt.data.status !== "open") return json({ error: "Appointment is not an open cancellation." }, 409);

  const service = await gate.supabase
    .from("services")
    .select("name")
    .eq("id", appt.data.service_id)
    .eq("business_id", body.businessId)
    .single();
  if (service.error || !service.data) return json({ error: "Service not found for this business." }, 404);

  const people = await gate.supabase
    .from("waitlist_entries")
    .select("id, name, email, service_interest, time_window, priority")
    .eq("business_id", body.businessId)
    .eq("active", true)
    .eq("service_interest", service.data.name);
  if (people.error) return json({ error: people.error.message }, 400);

  const consent = await gate.supabase
    .from("consent_records")
    .select("waitlist_id")
    .eq("business_id", body.businessId)
    .is("unsubscribed_at", null);
  const allowed = new Set((consent.data || []).map((row) => row.waitlist_id));
  const hour = new Date(appt.data.starts_at).getUTCHours();
  const afternoon = hour >= 12;

  const matches = ((people.data || []) as Person[])
    .filter((person) => allowed.has(person.id))
    .map((person) => {
      let score = 50 + person.priority * 10;
      if (person.time_window === "Anytime") score += 15;
      else if (afternoon && person.time_window === "Afternoon") score += 25;
      else if (!afternoon && person.time_window === "Morning") score += 25;
      else score -= 10;
      return { id: person.id, name: person.name, email: person.email, score, reason: "consent on, same service" };
    })
    .sort((a, b) => b.score - a.score);

  return json({
    appointmentId: appt.data.id,
    service: service.data.name,
    priceCents: appt.data.price_cents,
    matches,
    draft: "Gemini is not connected. Draft from verified fields only after owner review."
  });
}
