import { adminClient } from "@/lib/supabase";
import { json, missing } from "@/lib/http";

// Blocker: service-role call from a public route. Add per-token rate limits before launch.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.token || !body.waitlistId) return missing("token, waitlistId");
  try {
    const admin = adminClient();
    const { data, error } = await admin.rpc("claim_booking", {
      p_token: body.token,
      p_waitlist_id: body.waitlistId
    });
    if (error) return json({ error: error.message }, 400);
    return json(data);
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : "Claim failed." }, 500);
  }
}
