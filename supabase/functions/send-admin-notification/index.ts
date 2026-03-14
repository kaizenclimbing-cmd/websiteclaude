import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AdminNotificationPayload {
  firstName: string;
  lastName: string;
  email: string;
  message?: string;
  interests?: string[];
}

const renderEmail = (payload: AdminNotificationPayload): string => {
  const { firstName, lastName, email, message, interests = [] } = payload;

  const interestBadges = interests.length > 0
    ? interests.map(i => `<span style="display:inline-block;background-color:#FFC93C;color:#1A1A1A;font-family:'Inter',sans-serif;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;padding:4px 10px;margin:0 4px 4px 0;">${i}</span>`).join("")
    : `<span style="font-family:'Inter',sans-serif;font-size:13px;color:rgba(255,255,255,0.4);">None selected</span>`;

  const messageBlock = message
    ? `<tr>
        <td style="padding:0 0 24px 0;">
          <p style="margin:0 0 6px 0;font-family:'Inter',sans-serif;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#FFC93C;">Message</p>
          <p style="margin:0;font-family:'Inter',sans-serif;font-size:14px;color:rgba(255,255,255,0.85);line-height:1.6;font-style:italic;">"${message}"</p>
        </td>
      </tr>`
    : "";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Enquiry — Kaizen Climbing Coaching</title>
</head>
<body style="margin:0;padding:0;background-color:#1A1A1A;font-family:'Inter',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1A1A1A;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background-color:#5C5435;padding:28px 40px;border-bottom:3px solid #FFC93C;">
              <p style="margin:0;font-family:'Arial Black',sans-serif;font-size:11px;font-weight:900;letter-spacing:0.2em;color:#FFC93C;text-transform:uppercase;">KAIZEN CLIMBING COACHING</p>
              <p style="margin:8px 0 0 0;font-family:'Arial Black',sans-serif;font-size:22px;font-weight:900;letter-spacing:0.05em;color:#ffffff;text-transform:uppercase;line-height:1;">NEW ENQUIRY</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:#2a2a2a;padding:36px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">

                <!-- Name + Email -->
                <tr>
                  <td style="padding:0 0 24px 0;">
                    <p style="margin:0 0 6px 0;font-family:'Inter',sans-serif;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#FFC93C;">From</p>
                    <p style="margin:0 0 2px 0;font-family:'Arial Black',sans-serif;font-size:20px;font-weight:900;color:#ffffff;text-transform:uppercase;letter-spacing:0.03em;">${firstName} ${lastName}</p>
                    <a href="mailto:${email}" style="font-family:'Inter',sans-serif;font-size:14px;color:#FFC93C;text-decoration:none;">${email}</a>
                  </td>
                </tr>

                <!-- Interests -->
                <tr>
                  <td style="padding:0 0 24px 0;border-top:1px solid rgba(255,255,255,0.08);padding-top:24px;">
                    <p style="margin:0 0 10px 0;font-family:'Inter',sans-serif;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#FFC93C;">Interested In</p>
                    <div>${interestBadges}</div>
                  </td>
                </tr>

                <!-- Message -->
                ${messageBlock}

                <!-- CTA -->
                <tr>
                  <td style="padding-top:8px;border-top:1px solid rgba(255,255,255,0.08);">
                    <a href="mailto:${email}?subject=Re: Your Kaizen Climbing Coaching Enquiry"
                       style="display:inline-block;background-color:#FFC93C;color:#1A1A1A;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;text-decoration:none;padding:14px 28px;margin-right:12px;">
                      REPLY TO ${firstName.toUpperCase()}
                    </a>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#4A442B;padding:20px 40px;">
              <p style="margin:0;font-family:'Inter',sans-serif;font-size:11px;color:rgba(255,255,255,0.35);line-height:1.6;">
                This notification was sent because someone submitted the contact form at kaizenclimbing.co.uk.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminEmail = Deno.env.get("ADMIN_NOTIFICATION_EMAIL") ?? "Info@kaizenclimbing.co.uk";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload: AdminNotificationPayload = await req.json();
    const { firstName, lastName, email, message, interests = [] } = payload;

    const messageId = `admin-notify-${crypto.randomUUID()}`;
    const html = renderEmail(payload);

    const runId = crypto.randomUUID();
    const { error } = await supabase.rpc("enqueue_email", {
      queue_name: "transactional_emails",
      payload: {
        run_id: runId,
        message_id: messageId,
        label: "admin-contact-notification",
        to: adminEmail,
        subject: `New enquiry from ${firstName} ${lastName}`,
        html,
        purpose: "transactional",
        queued_at: new Date().toISOString(),
      },
    });

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, messageId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error sending admin notification email:", err);
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
