import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const renderEmail = (firstName: string, reason?: string): string => `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background-color:#1A1A1A;font-family:'Inter',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1A1A1A;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <tr>
          <td style="background-color:#5C5435;padding:32px 40px;">
            <p style="margin:0;font-family:'Arial Black',sans-serif;font-size:28px;font-weight:900;letter-spacing:0.05em;color:#FFC93C;text-transform:uppercase;">KAIZEN</p>
            <p style="margin:4px 0 0 0;font-family:'Inter',sans-serif;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.15em;color:rgba(255,255,255,0.5);">Climbing Coaching</p>
          </td>
        </tr>
        <tr>
          <td style="background-color:#2a2a2a;padding:40px;">
            <p style="margin:0 0 20px 0;font-family:'Inter',sans-serif;font-size:15px;color:rgba(255,255,255,0.85);line-height:1.6;">
              Hey ${firstName},
            </p>
            <p style="margin:0 0 16px 0;font-family:'Inter',sans-serif;font-size:15px;color:rgba(255,255,255,0.85);line-height:1.6;">
              Thanks for applying for the Kaizen Plan — I appreciate you taking the time and being open about your climbing.
            </p>
            ${reason
              ? `<p style="margin:0 0 16px 0;font-family:'Inter',sans-serif;font-size:15px;color:rgba(255,255,255,0.85);line-height:1.6;">${reason}</p>`
              : `<p style="margin:0 0 16px 0;font-family:'Inter',sans-serif;font-size:15px;color:rgba(255,255,255,0.85);line-height:1.6;">
                  After reviewing your application, I don't think we're the right fit at this point in time. I only take on a small number of athletes and I want to make sure every coaching relationship is one I can fully commit to.
                </p>`
            }
            <p style="margin:0 0 16px 0;font-family:'Inter',sans-serif;font-size:15px;color:rgba(255,255,255,0.85);line-height:1.6;">
              That said, I don't want this to be the end of things. If your situation changes — goals, time, training — please don't hesitate to apply again. And in the meantime, the Training Tips section of the site is there for you.
            </p>
            <p style="margin:0;font-family:'Inter',sans-serif;font-size:15px;color:rgba(255,255,255,0.85);line-height:1.6;">
              Keep climbing — Buster
            </p>
          </td>
        </tr>
        <tr>
          <td style="background-color:#5C5435;padding:24px 40px;text-align:center;">
            <a href="https://kaizenclimbing.co.uk/training-tips"
               style="display:inline-block;color:#FFC93C;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;text-decoration:none;">
              BROWSE TRAINING TIPS →
            </a>
          </td>
        </tr>
        <tr>
          <td style="background-color:#4A442B;padding:24px 40px;">
            <p style="margin:0;font-family:'Inter',sans-serif;font-size:12px;color:rgba(255,255,255,0.4);line-height:1.6;">
              Questions? Reply to this email or contact us at <a href="mailto:admin@kaizenclimbing.co.uk" style="color:#FFC93C;text-decoration:none;">admin@kaizenclimbing.co.uk</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

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

    // Send decline email
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Buster @ Kaizen <notify@kaizenclimbing.com>",
        reply_to: "admin@kaizenclimbing.co.uk",
        to: [app.email],
        subject: "Thanks for applying — Kaizen Climbing Coaching",
        html: renderEmail(app.first_name, reason),
        text: `Hey ${app.first_name}, thanks for applying. After reviewing your application, I don't think we're the right fit at this point. Keep climbing — Buster`,
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
