import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    console.log("[calcom-webhook] received event:", payload?.triggerEvent, JSON.stringify(payload).slice(0, 500));

    // Only process booking confirmations
    if (payload?.triggerEvent !== "BOOKING_CREATED" && payload?.triggerEvent !== "BOOKING_RESCHEDULED") {
      return new Response(JSON.stringify({ ok: true, skipped: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Extract attendee email and start time
    const attendeeEmail: string | undefined =
      payload?.payload?.attendees?.[0]?.email ??
      payload?.payload?.responses?.email?.value;

    const startTime: string | undefined =
      payload?.payload?.startTime ??
      payload?.payload?.responses?.start_time?.value;

    if (!attendeeEmail || !startTime) {
      console.warn("[calcom-webhook] missing email or startTime", { attendeeEmail, startTime });
      return new Response(JSON.stringify({ ok: false, error: "Missing email or startTime" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Update the most recent consultation submission for this email
    const { error } = await supabase
      .from("consultation_submissions")
      .update({ call_scheduled_at: startTime })
      .eq("email", attendeeEmail.toLowerCase())
      .order("submitted_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("[calcom-webhook] db update error:", error.message);
      return new Response(JSON.stringify({ ok: false, error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("[calcom-webhook] updated call_scheduled_at for", attendeeEmail, "→", startTime);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[calcom-webhook] unhandled error:", msg);
    return new Response(JSON.stringify({ ok: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
