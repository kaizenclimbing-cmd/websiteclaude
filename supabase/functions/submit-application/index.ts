import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ApplicationPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  current_grade: string;
  target_grade: string;
  years_climbing: string;
  preferred_discipline: string;
  goals: string;
  training_history: string;
  currently_injured: boolean;
  injury_details?: string;
  hours_per_week: string;
  budget_confirmed: boolean;
  why_now: string;
}

// Email to applicant: application received
const renderApplicantEmail = (firstName: string): string => `<!DOCTYPE html>
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
          <td style="background-color:#FFC93C;padding:40px;">
            <p style="margin:0 0 4px 0;font-family:'Arial Black',sans-serif;font-size:32px;font-weight:900;letter-spacing:0.03em;color:#1A1A1A;text-transform:uppercase;line-height:1;">APPLICATION</p>
            <p style="margin:0 0 24px 0;font-family:'Arial Black',sans-serif;font-size:32px;font-weight:900;letter-spacing:0.03em;color:#1A1A1A;text-transform:uppercase;line-height:1;">RECEIVED.</p>
            <p style="margin:0 0 16px 0;font-family:'Inter',sans-serif;font-size:15px;color:#1A1A1A;line-height:1.6;">
              Hey ${firstName} — I've received your application for the Kaizen Plan and I'll review it within 48 hours.
            </p>
            <p style="margin:0 0 24px 0;font-family:'Inter',sans-serif;font-size:15px;color:#1A1A1A;line-height:1.6;">
              If I think we're a good fit, I'll be in touch to book a free 30-minute discovery call. If I have any questions about your application first, I'll reach out by email.
            </p>
            <p style="margin:0;font-family:'Inter',sans-serif;font-size:15px;color:#1A1A1A;line-height:1.6;">
              — Buster
            </p>
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

// Email to Buster: new application notification with all details
const renderAdminEmail = (p: ApplicationPayload, id: string): string => `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background-color:#1A1A1A;font-family:'Inter',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1A1A1A;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <tr>
          <td style="background-color:#5C5435;padding:28px 40px;border-bottom:3px solid #FFC93C;">
            <p style="margin:0;font-family:'Arial Black',sans-serif;font-size:11px;font-weight:900;letter-spacing:0.2em;color:#FFC93C;text-transform:uppercase;">KAIZEN CLIMBING COACHING</p>
            <p style="margin:8px 0 0 0;font-family:'Arial Black',sans-serif;font-size:22px;font-weight:900;letter-spacing:0.05em;color:#ffffff;text-transform:uppercase;line-height:1;">NEW APPLICATION</p>
          </td>
        </tr>
        <tr>
          <td style="background-color:#2a2a2a;padding:36px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="padding:0 0 20px 0;">
                <p style="margin:0 0 4px 0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#FFC93C;">Applicant</p>
                <p style="margin:0 0 2px 0;font-family:'Arial Black',sans-serif;font-size:20px;color:#fff;text-transform:uppercase;">${p.first_name} ${p.last_name}</p>
                <a href="mailto:${p.email}" style="color:#FFC93C;text-decoration:none;font-size:14px;">${p.email}</a>
                ${p.phone ? `<br/><span style="color:rgba(255,255,255,0.6);font-size:14px;">${p.phone}</span>` : ""}
              </td></tr>
              <tr><td style="padding:20px 0;border-top:1px solid rgba(255,255,255,0.08);">
                <p style="margin:0 0 10px 0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#FFC93C;">Climbing Background</p>
                <p style="margin:0 0 4px 0;font-size:14px;color:rgba(255,255,255,0.85);">Current grade: <strong style="color:#fff;">${p.current_grade}</strong></p>
                <p style="margin:0 0 4px 0;font-size:14px;color:rgba(255,255,255,0.85);">Target grade: <strong style="color:#fff;">${p.target_grade}</strong></p>
                <p style="margin:0 0 4px 0;font-size:14px;color:rgba(255,255,255,0.85);">Years climbing: <strong style="color:#fff;">${p.years_climbing}</strong></p>
                <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.85);">Discipline: <strong style="color:#fff;">${p.preferred_discipline}</strong></p>
              </td></tr>
              <tr><td style="padding:20px 0;border-top:1px solid rgba(255,255,255,0.08);">
                <p style="margin:0 0 8px 0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#FFC93C;">Goals</p>
                <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.85);line-height:1.6;font-style:italic;">"${p.goals}"</p>
              </td></tr>
              <tr><td style="padding:20px 0;border-top:1px solid rgba(255,255,255,0.08);">
                <p style="margin:0 0 8px 0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#FFC93C;">Training History</p>
                <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.85);line-height:1.6;font-style:italic;">"${p.training_history}"</p>
              </td></tr>
              <tr><td style="padding:20px 0;border-top:1px solid rgba(255,255,255,0.08);">
                <p style="margin:0 0 8px 0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#FFC93C;">Injuries</p>
                <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.85);">${p.currently_injured ? `YES — ${p.injury_details || "no details provided"}` : "None reported"}</p>
              </td></tr>
              <tr><td style="padding:20px 0;border-top:1px solid rgba(255,255,255,0.08);">
                <p style="margin:0 0 8px 0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#FFC93C;">Availability & Budget</p>
                <p style="margin:0 0 4px 0;font-size:14px;color:rgba(255,255,255,0.85);">Hours/week available: <strong style="color:#fff;">${p.hours_per_week}</strong></p>
                <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.85);">Budget confirmed: <strong style="color:${p.budget_confirmed ? "#4ade80" : "#f87171"};">${p.budget_confirmed ? "YES" : "NO"}</strong></p>
              </td></tr>
              <tr><td style="padding:20px 0;border-top:1px solid rgba(255,255,255,0.08);">
                <p style="margin:0 0 8px 0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#FFC93C;">Why Now?</p>
                <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.85);line-height:1.6;font-style:italic;">"${p.why_now}"</p>
              </td></tr>
              <tr><td style="padding-top:24px;border-top:1px solid rgba(255,255,255,0.08);">
                <a href="https://kaizenclimbing.co.uk/admin"
                   style="display:inline-block;background-color:#FFC93C;color:#1A1A1A;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;text-decoration:none;padding:14px 28px;margin-right:12px;">
                  REVIEW IN ADMIN →
                </a>
                <a href="mailto:${p.email}?subject=Re: Your Kaizen Coaching Application"
                   style="display:inline-block;background-color:transparent;color:#FFC93C;border:1px solid #FFC93C;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;text-decoration:none;padding:14px 28px;margin-top:8px;">
                  REPLY TO ${p.first_name.toUpperCase()}
                </a>
              </td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background-color:#4A442B;padding:20px 40px;">
            <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.35);line-height:1.6;">Application ID: ${id}</p>
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

    const payload: ApplicationPayload = await req.json();

    // Validate required fields
    const required = ["first_name", "last_name", "email", "current_grade", "target_grade",
      "years_climbing", "preferred_discipline", "goals", "training_history",
      "hours_per_week", "why_now"] as const;
    for (const field of required) {
      if (!payload[field]) throw new Error(`Missing required field: ${field}`);
    }
    if (!payload.budget_confirmed) throw new Error("Budget must be confirmed");

    // Save to database
    const { data, error } = await supabase
      .from("applications")
      .insert([payload])
      .select("id")
      .single();

    if (error) throw new Error(`DB error: ${error.message}`);
    const applicationId = data.id;

    // Send both emails in parallel
    const sendEmail = (to: string[], subject: string, html: string, text: string, replyTo?: string) =>
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Kaizen Climbing Coaching <notify@kaizenclimbing.com>",
          reply_to: replyTo || "admin@kaizenclimbing.co.uk",
          to, subject, html, text,
        }),
      });

    await Promise.all([
      // Confirmation to applicant
      sendEmail(
        [payload.email],
        "Application received — Kaizen Climbing Coaching",
        renderApplicantEmail(payload.first_name),
        `Hey ${payload.first_name} — I've received your application and will review it within 48 hours. — Buster`,
      ),
      // Notification to Buster
      sendEmail(
        ["admin@kaizenclimbing.co.uk"],
        `New application: ${payload.first_name} ${payload.last_name} (${payload.current_grade} → ${payload.target_grade})`,
        renderAdminEmail(payload, applicationId),
        `New application from ${payload.first_name} ${payload.last_name} — ${payload.email}`,
        payload.email,
      ),
    ]);

    return new Response(JSON.stringify({ success: true, id: applicationId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("submit-application error:", err);
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
