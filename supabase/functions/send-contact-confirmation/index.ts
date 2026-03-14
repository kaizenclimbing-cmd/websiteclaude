import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactConfirmationPayload {
  firstName: string;
  lastName: string;
  email: string;
  interests?: string[];
}

const renderEmail = (firstName: string, interests: string[]): string => {
  const interestList = interests.length > 0
    ? `<p style="margin:0 0 8px 0;color:#5C5435;font-family:'Inter',sans-serif;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">You expressed interest in:</p>
       <ul style="margin:0 0 24px 0;padding-left:20px;">
         ${interests.map(i => `<li style="color:#1A1A1A;font-family:'Inter',sans-serif;font-size:14px;margin-bottom:4px;">${i}</li>`).join("")}
       </ul>`
    : "";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Thanks for reaching out — Kaizen Climbing Coaching</title>
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
              <p style="margin:0 0 4px 0;font-family:'Arial Black',sans-serif;font-size:32px;font-weight:900;letter-spacing:0.03em;color:#1A1A1A;text-transform:uppercase;line-height:1;">MESSAGE</p>
              <p style="margin:0 0 24px 0;font-family:'Arial Black',sans-serif;font-size:32px;font-weight:900;letter-spacing:0.03em;color:#1A1A1A;text-transform:uppercase;line-height:1;">RECEIVED!</p>

              <p style="margin:0 0 20px 0;font-family:'Inter',sans-serif;font-size:15px;color:#1A1A1A;line-height:1.6;">
                Hey ${firstName}, thanks for getting in touch. We've received your enquiry and will be back in touch with you <strong>within a week</strong>.
              </p>

              ${interestList}

              <p style="margin:0 0 32px 0;font-family:'Inter',sans-serif;font-size:15px;color:#1A1A1A;line-height:1.6;">
                In the meantime, feel free to follow us on Instagram for training tips and coaching updates.
              </p>

              <a href="https://instagram.com/kaizenclimbingcoaching"
                 style="display:inline-block;background-color:#5C5435;color:#FFC93C;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;text-decoration:none;padding:14px 28px;">
                @KAIZENCLIMBINGCOACHING
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#4A442B;padding:24px 40px;">
              <p style="margin:0;font-family:'Inter',sans-serif;font-size:12px;color:rgba(255,255,255,0.4);line-height:1.6;">
                You're receiving this email because you submitted an enquiry via kaizenclimbing.co.uk.<br />
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
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload: ContactConfirmationPayload = await req.json();
    const { firstName, lastName, email, interests = [] } = payload;

    const messageId = `contact-confirm-${crypto.randomUUID()}`;
    const html = renderEmail(firstName, interests);

    const { error } = await supabase.rpc("enqueue_email", {
      p_message_id: messageId,
      p_template_name: "contact-confirmation",
      p_recipient_email: email,
      p_recipient_name: `${firstName} ${lastName}`,
      p_subject: "We've received your enquiry — Kaizen Climbing Coaching",
      p_html_body: html,
      p_metadata: { interests },
    });

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, messageId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error sending contact confirmation email:", err);
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
