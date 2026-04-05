import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { fetchTemplate, applyTokens } from "../_shared/email-db.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DEFAULT_REASON = `After reviewing your application, I don't think we're the right fit at this point in time. I only take on a small number of athletes and I want to make sure every coaching relationship is one I can fully commit to.`;

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

    const { application_id, reason, admin_notes } = await req.json();
    if (!application_id) throw new Error("application_id required");

    // Fetch application
    const { data: app, error: fetchErr } = await supabase
      .from("applications")
      .select("id, first_name, email, status")
      .eq("id", application_id)
      .single();

    if (fetchErr || !app) throw new Error("Application not found");
    if (app.status !== "pending") throw new Error(`Application already ${app.status}`);

    // Update status
    const { error: updateErr } = await supabase
      .from("applications")
      .update({
        status: "declined",
        reviewed_at: new Date().toISOString(),
        admin_notes: admin_notes || null,
      })
      .eq("id", application_id);

    if (updateErr) throw new Error(`Update error: ${updateErr.message}`);

    const reasonText = reason || DEFAULT_REASON;
    const reasonBlock = `<p style="margin:0 0 16px 0;font-family:'Inter',sans-serif;font-size:15px;color:rgba(255,255,255,0.85);line-height:1.6;">${reasonText}</p>`;

    const tpl = await fetchTemplate("decline-application");
    const html = tpl
      ? applyTokens(tpl.html_body, { firstName: app.first_name, reason_block: reasonBlock })
      : `<p>Hey ${app.first_name}, thanks for applying. ${reasonText} Keep climbing — Buster</p>`;
    const subject = tpl
      ? applyTokens(tpl.subject, { firstName: app.first_name })
      : "Thanks for applying — Kaizen Climbing Coaching";

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Buster @ Kaizen <notify@kaizenclimbing.com>",
        reply_to: "admin@kaizenclimbing.co.uk",
        to: [app.email],
        subject,
        html,
        text: `Hey ${app.first_name}, thanks for applying. ${reasonText}\n\nKeep climbing — Buster`,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(`Resend error: ${JSON.stringify(data)}`);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("decline-application error:", err);
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
