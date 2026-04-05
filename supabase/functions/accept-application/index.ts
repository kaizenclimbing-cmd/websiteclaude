import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { fetchTemplate, applyTokens } from "../_shared/email-db.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DASHBOARD_URL = "https://kaizenclimbing.co.uk/consultation/next";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Verify caller is an authenticated admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Unauthorized");
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
    if (authErr || !user) throw new Error("Unauthorized");
    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();
    if (!roleRow) throw new Error("Forbidden: admin only");

    const { application_id } = await req.json();
    if (!application_id) throw new Error("application_id required");

    // Fetch application
    const { data: app, error: fetchErr } = await supabase
      .from("applications")
      .select("id, first_name, last_name, email, status")
      .eq("id", application_id)
      .single();

    if (fetchErr || !app) throw new Error("Application not found");
    if (app.status !== "pending") throw new Error(`Application already ${app.status}`);

    // Update status
    const { error: updateErr } = await supabase
      .from("applications")
      .update({ status: "accepted", reviewed_at: new Date().toISOString() })
      .eq("id", application_id);

    if (updateErr) throw new Error(`Update error: ${updateErr.message}`);

    // Build email from DB template with fallback
    const tpl = await fetchTemplate("accept-application");
    const html = tpl
      ? applyTokens(tpl.html_body, { firstName: app.first_name, dashboardUrl: DASHBOARD_URL })
      : `<p>Hey ${app.first_name} — you're accepted. Log in to your dashboard to complete payment and get started: <a href="${DASHBOARD_URL}">${DASHBOARD_URL}</a></p>`;
    const subject = tpl
      ? applyTokens(tpl.subject, { firstName: app.first_name })
      : `You're accepted — here's what happens next`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Buster @ Kaizen <notify@kaizenclimbing.com>",
        reply_to: "admin@kaizenclimbing.co.uk",
        to: [app.email],
        subject,
        html,
        text: `Hey ${app.first_name} — I've reviewed your application and I'd love to work with you. Log in to your dashboard to complete payment and get started: ${DASHBOARD_URL} — Buster`,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(`Resend error: ${JSON.stringify(data)}`);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("accept-application error:", err);
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
