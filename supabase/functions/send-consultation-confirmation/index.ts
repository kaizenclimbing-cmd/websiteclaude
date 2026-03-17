import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ConsultationConfirmationPayload {
  firstName: string;
  lastName: string;
  email: string;
}

const renderClientEmail = (firstName: string): string => `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Consultation received — Kaizen Climbing Coaching</title>
</head>
<body style="margin:0;padding:0;background-color:#1A1A1A;font-family:'Inter',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1A1A1A;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background-color:#5C5435;padding:32px 40px;">
              <p style="margin:0;font-family:'Arial Black',sans-serif;font-size:28px;font-weight:900;letter-spacing:0.05em;color:#FFC93C;text-transform:uppercase;">KAIZEN</p>
              <p style="margin:4px 0 0 0;font-family:'Inter',sans-serif;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.15em;color:rgba(255,255,255,0.5);">Climbing Coaching</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:#FFC93C;padding:40px;">
              <p style="margin:0 0 4px 0;font-family:'Arial Black',sans-serif;font-size:32px;font-weight:900;letter-spacing:0.03em;color:#1A1A1A;text-transform:uppercase;line-height:1;">CONSULTATION</p>
              <p style="margin:0 0 24px 0;font-family:'Arial Black',sans-serif;font-size:32px;font-weight:900;letter-spacing:0.03em;color:#1A1A1A;text-transform:uppercase;line-height:1;">RECEIVED!</p>

              <p style="margin:0 0 20px 0;font-family:'Inter',sans-serif;font-size:15px;color:#1A1A1A;line-height:1.6;">
                Hey ${firstName}, thanks for completing your consultation form. We'll review everything and be in touch with you <strong>within 72 hours</strong>.
              </p>

              <p style="margin:0 0 16px 0;font-family:'Inter',sans-serif;font-size:14px;color:#1A1A1A;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">
                Here's what happens next:
              </p>

              <!-- Steps -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid rgba(0,0,0,0.1);">
                    <p style="margin:0;font-family:'Inter',sans-serif;font-size:13px;color:#1A1A1A;">
                      <strong style="font-family:'Arial Black',sans-serif;color:#5C5435;">01 &nbsp;</strong>
                      Consultation reviewed — we'll reply within 72 hours
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid rgba(0,0,0,0.1);">
                    <p style="margin:0;font-family:'Inter',sans-serif;font-size:13px;color:#1A1A1A;">
                      <strong style="font-family:'Arial Black',sans-serif;color:#5C5435;">02 &nbsp;</strong>
                      Complete payment — a payment link will be sent to you
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;">
                    <p style="margin:0;font-family:'Inter',sans-serif;font-size:13px;color:#1A1A1A;">
                      <strong style="font-family:'Arial Black',sans-serif;color:#5C5435;">03 &nbsp;</strong>
                      Book your onboarding call — link sent after payment confirmed
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 28px 0;font-family:'Inter',sans-serif;font-size:14px;color:#1A1A1A;line-height:1.6;">
                In the meantime, feel free to reach out with any questions.
              </p>

              <a href="mailto:Info@kaizenclimbing.co.uk"
                 style="display:inline-block;background-color:#5C5435;color:#FFC93C;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;text-decoration:none;padding:14px 28px;">
                GET IN TOUCH
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#4A442B;padding:24px 40px;">
              <p style="margin:0;font-family:'Inter',sans-serif;font-size:12px;color:rgba(255,255,255,0.4);line-height:1.6;">
                You're receiving this email because you submitted a consultation via kaizenclimbing.co.uk.<br />
                Questions? Reply to this email or contact us at <a href="mailto:Info@kaizenclimbing.co.uk" style="color:#FFC93C;text-decoration:none;">Info@kaizenclimbing.co.uk</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

const renderAdminEmail = (firstName: string, lastName: string, email: string): string => `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><title>New consultation — ${firstName} ${lastName}</title></head>
<body style="margin:0;padding:0;background-color:#1A1A1A;font-family:'Inter',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1A1A1A;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
          <tr>
            <td style="background-color:#5C5435;padding:28px 40px;">
              <p style="margin:0;font-family:'Arial Black',sans-serif;font-size:20px;font-weight:900;color:#FFC93C;text-transform:uppercase;">NEW CONSULTATION SUBMISSION</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#FFC93C;padding:32px 40px;">
              <p style="margin:0 0 16px 0;font-family:'Inter',sans-serif;font-size:16px;color:#1A1A1A;">
                <strong>${firstName} ${lastName}</strong> has submitted a consultation form.
              </p>
              <p style="margin:0 0 8px 0;font-family:'Inter',sans-serif;font-size:14px;color:#1A1A1A;">
                Email: <a href="mailto:${email}" style="color:#5C5435;">${email}</a>
              </p>
              <a href="https://kaizen-climb-coach.lovable.app/admin"
                 style="display:inline-block;margin-top:20px;background-color:#5C5435;color:#FFC93C;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;text-decoration:none;padding:12px 24px;">
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

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload: ConsultationConfirmationPayload = await req.json();
    const { firstName, lastName, email } = payload;

    // Send confirmation to client
    const clientMsgId = `consultation-confirm-${crypto.randomUUID()}`;
    const { error: clientError } = await supabase.rpc("enqueue_email", {
      queue_name: "transactional_emails",
      payload: {
        run_id: clientMsgId,
        message_id: clientMsgId,
        label: "consultation-confirmation",
        from: "Kaizen Climbing Coaching <notify@kaizenclimbing.com>",
        reply_to: "admin@kaizenclimbing.com",
        to: email,
        subject: "Consultation received — Kaizen Climbing Coaching",
        html: renderClientEmail(firstName),
        text: `Hey ${firstName}, thanks for completing your consultation form. We'll review everything and be in touch within 72 hours.\n\nWhat happens next:\n01 — Consultation reviewed, we'll reply within 72 hours\n02 — Complete payment, a payment link will be sent to you\n03 — Book your onboarding call, link sent after payment confirmed\n\nIn the meantime, feel free to reach out: Info@kaizenclimbing.co.uk`,
        purpose: "transactional",
        queued_at: new Date().toISOString(),
      },
    });

    if (clientError) throw clientError;

    // Send lead notification to admin
    const { error: adminError } = await supabase.rpc("enqueue_email", {
      queue_name: "transactional_emails",
      payload: {
        message_id: `consultation-admin-${crypto.randomUUID()}`,
        label: "consultation-admin-notification",
        from: "Kaizen Climbing Coaching <notify@kaizenclimbing.com>",
        reply_to: email,
        to: "admin@kaizenclimbing.com",
        subject: `New consultation: ${firstName} ${lastName}`,
        html: renderAdminEmail(firstName, lastName, email),
        text: `New consultation submission from ${firstName} ${lastName} (${email}).\n\nView in dashboard: https://kaizen-climb-coach.lovable.app/admin`,
        purpose: "transactional",
        queued_at: new Date().toISOString(),
      },
    });

    if (adminError) throw adminError;

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error sending consultation confirmation:", err);
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
