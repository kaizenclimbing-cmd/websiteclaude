import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "npm:stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PLAN_LABELS: Record<string, string> = {
  kaizen_plan: "The Kaizen Plan (£200 every 4 weeks)",
  six_week_peak: "6 Week Peak Plan (£200 one-off)",
};

const renderClientEmail = (firstName: string, planLabel: string): string => `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Payment confirmed — Kaizen Climbing Coaching</title>
</head>
<body style="margin:0;padding:0;background-color:#1A1A1A;font-family:'Inter',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1A1A1A;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
          <tr>
            <td style="background-color:#5C5435;padding:32px 40px;">
              <p style="margin:0;font-family:'Arial Black',sans-serif;font-size:28px;font-weight:900;letter-spacing:0.05em;color:#FFC93C;text-transform:uppercase;">KAIZEN</p>
              <p style="margin:4px 0 0 0;font-family:'Inter',sans-serif;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.15em;color:rgba(255,255,255,0.5);">Climbing Coaching</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#FFC93C;padding:40px;">
              <p style="margin:0 0 4px 0;font-family:'Arial Black',sans-serif;font-size:32px;font-weight:900;letter-spacing:0.03em;color:#1A1A1A;text-transform:uppercase;line-height:1;">PAYMENT</p>
              <p style="margin:0 0 24px 0;font-family:'Arial Black',sans-serif;font-size:32px;font-weight:900;letter-spacing:0.03em;color:#1A1A1A;text-transform:uppercase;line-height:1;">CONFIRMED!</p>
              <p style="margin:0 0 20px 0;font-family:'Inter',sans-serif;font-size:15px;color:#1A1A1A;line-height:1.6;">
                Hey ${firstName}, your payment for <strong>${planLabel}</strong> has been confirmed. You're all set — time to book your onboarding call.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid rgba(0,0,0,0.1);">
                    <p style="margin:0;font-family:'Inter',sans-serif;font-size:13px;color:#1A1A1A;">
                      <strong style="font-family:'Arial Black',sans-serif;color:#5C5435;">01 &nbsp;</strong>
                      Consultation form ✓ complete
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid rgba(0,0,0,0.1);">
                    <p style="margin:0;font-family:'Inter',sans-serif;font-size:13px;color:#1A1A1A;">
                      <strong style="font-family:'Arial Black',sans-serif;color:#5C5435;">02 &nbsp;</strong>
                      Payment ✓ confirmed
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;">
                    <p style="margin:0;font-family:'Inter',sans-serif;font-size:13px;color:#1A1A1A;">
                      <strong style="font-family:'Arial Black',sans-serif;color:#5C5435;">03 &nbsp;</strong>
                      Book your onboarding call — use the link below
                    </p>
                  </td>
                </tr>
              </table>
              <a href="https://kaizen-climb-coach.lovable.app/book"
                 style="display:inline-block;background-color:#1A1A1A;color:#FFC93C;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;text-decoration:none;padding:14px 28px;">
                BOOK YOUR CALL →
              </a>
            </td>
          </tr>
          <tr>
            <td style="background-color:#4A442B;padding:24px 40px;">
              <p style="margin:0;font-family:'Inter',sans-serif;font-size:12px;color:rgba(255,255,255,0.4);line-height:1.6;">
                You're receiving this because you signed up for coaching at kaizenclimbing.com.<br />
                Questions? Contact us at <a href="mailto:admin@kaizenclimbing.co.uk" style="color:#FFC93C;text-decoration:none;">admin@kaizenclimbing.co.uk</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

const renderAdminEmail = (firstName: string, lastName: string, email: string, planLabel: string): string => `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><title>Payment confirmed — ${firstName} ${lastName}</title></head>
<body style="margin:0;padding:0;background-color:#1A1A1A;font-family:'Inter',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1A1A1A;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
          <tr>
            <td style="background-color:#5C5435;padding:28px 40px;">
              <p style="margin:0;font-family:'Arial Black',sans-serif;font-size:20px;font-weight:900;color:#FFC93C;text-transform:uppercase;">NEW PAYMENT RECEIVED</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#FFC93C;padding:32px 40px;">
              <p style="margin:0 0 12px 0;font-family:'Inter',sans-serif;font-size:16px;color:#1A1A1A;">
                <strong>${firstName} ${lastName}</strong> has completed payment.
              </p>
              <p style="margin:0 0 8px 0;font-family:'Inter',sans-serif;font-size:14px;color:#1A1A1A;">
                Plan: <strong>${planLabel}</strong>
              </p>
              <p style="margin:0 0 20px 0;font-family:'Inter',sans-serif;font-size:14px;color:#1A1A1A;">
                Email: <a href="mailto:${email}" style="color:#5C5435;">${email}</a>
              </p>
              <a href="https://kaizen-climb-coach.lovable.app/admin"
                 style="display:inline-block;background-color:#5C5435;color:#FFC93C;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;text-decoration:none;padding:12px 24px;">
                VIEW IN DASHBOARD
              </a>
            </td>
          </tr>
          <tr>
            <td style="background-color:#4A442B;padding:20px 40px;">
              <p style="margin:0;font-family:'Inter',sans-serif;font-size:12px;color:rgba(255,255,255,0.4);">
                Kaizen Climbing Coaching admin notification
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Not authenticated");
    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabaseClient.auth.getUser(token);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    const { session_id } = await req.json() as { session_id: string };
    if (!session_id) throw new Error("session_id required");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const session = await stripe.checkout.sessions.retrieve(session_id);

    const paid =
      session.payment_status === "paid" ||
      (session.mode === "subscription" && session.status === "complete");

    if (paid) {
      // Update the user's latest consultation submission to 'paid'
      const { data: updatedRows } = await supabaseAdmin
        .from("consultation_submissions")
        .update({ onboarding_stage: "paid" })
        .eq("user_id", user.id)
        .eq("onboarding_stage", "submitted")
        .select("first_name, last_name, email")
        .limit(1);

      // Send confirmation emails
      const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
      const planKey = (session.metadata?.plan ?? "") as string;
      const planLabel = PLAN_LABELS[planKey] ?? "your coaching plan";

      if (RESEND_API_KEY && updatedRows && updatedRows.length > 0) {
        const { first_name, last_name, email } = updatedRows[0];

        // Client confirmation
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Kaizen Climbing Coaching <notify@kaizenclimbing.com>",
            reply_to: "admin@kaizenclimbing.co.uk",
            to: [email],
            subject: "Payment confirmed — Kaizen Climbing Coaching",
            html: renderClientEmail(first_name, planLabel),
            text: `Hey ${first_name}, your payment for ${planLabel} has been confirmed. Book your onboarding call at: https://kaizen-climb-coach.lovable.app/book\n\nQuestions? admin@kaizenclimbing.co.uk`,
          }),
        }).catch(console.error);

        // Admin notification
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Kaizen Climbing Coaching <notify@kaizenclimbing.com>",
            reply_to: email,
            to: ["admin@kaizenclimbing.co.uk"],
            subject: `Payment received: ${first_name} ${last_name} — ${planLabel}`,
            html: renderAdminEmail(first_name, last_name, email, planLabel),
            text: `${first_name} ${last_name} (${email}) has completed payment for ${planLabel}.\n\nView in dashboard: https://kaizen-climb-coach.lovable.app/admin`,
          }),
        }).catch(console.error);
      }
    }

    return new Response(JSON.stringify({ paid, mode: session.mode }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
