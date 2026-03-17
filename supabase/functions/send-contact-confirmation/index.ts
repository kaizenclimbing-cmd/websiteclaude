import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
          <tr>
            <td style="background-color:#5C5435;padding:32px 40px;">
              <p style="margin:0;font-family:'Arial Black',sans-serif;font-size:28px;font-weight:900;letter-spacing:0.05em;color:#FFC93C;text-transform:uppercase;">KAIZEN</p>
              <p style="margin:4px 0 0 0;font-family:'Inter',sans-serif;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.15em;color:rgba(255,255,255,0.5);">Climbing Coaching</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#FFC93C;padding:40px;">
              <p style="margin:0 0 4px 0;font-family:'Arial Black',sans-serif;font-size:32px;font-weight:900;letter-spacing:0.03em;color:#1A1A1A;text-transform:uppercase;line-height:1;">MESSAGE</p>
              <p style="margin:0 0 24px 0;font-family:'Arial Black',sans-serif;font-size:32px;font-weight:900;letter-spacing:0.03em;color:#1A1A1A;text-transform:uppercase;line-height:1;">RECEIVED!</p>
              <p style="margin:0 0 20px 0;font-family:'Inter',sans-serif;font-size:15px;color:#1A1A1A;line-height:1.6;">
                Hey ${firstName}, thanks for your enquiry. We've received it and will be in touch shortly.
              </p>
              ${interestList}
              <p style="margin:0 0 28px 0;font-family:'Inter',sans-serif;font-size:15px;color:#1A1A1A;line-height:1.6;">
                In the meantime, if you'd like to start the process, you can fill out a form so I can get to know a little more about you and your climbing — or see more details about the training.
              </p>
              <a href="https://kaizenclimbing.com/consultation"
                 style="display:inline-block;background-color:#5C5435;color:#FFC93C;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;text-decoration:none;padding:14px 28px;margin-right:12px;">
                FILL OUT THE FORM
              </a>
              <a href="https://kaizenclimbing.com/plans"
                 style="display:inline-block;background-color:#1A1A1A;color:#FFC93C;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;text-decoration:none;padding:14px 28px;margin-top:12px;">
                SEE TRAINING DETAILS
              </a>
            </td>
          </tr>
          <tr>
            <td style="background-color:#4A442B;padding:24px 40px;">
              <p style="margin:0;font-family:'Inter',sans-serif;font-size:12px;color:rgba(255,255,255,0.4);line-height:1.6;">
                You're receiving this email because you submitted an enquiry via kaizenclimbing.com.<br />
                Questions? Reply to this email or contact us at <a href="mailto:admin@kaizenclimbing.com" style="color:#FFC93C;text-decoration:none;">admin@kaizenclimbing.com</a>
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
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");

    const payload: ContactConfirmationPayload = await req.json();
    const { firstName, lastName, email, interests = [] } = payload;

    const interestText = interests.length > 0 ? `\nYou expressed interest in: ${interests.join(", ")}\n` : "";
    const text = `Hey ${firstName}, thanks for your enquiry. We've received it and will be in touch shortly.${interestText}\nFill out the form: https://kaizenclimbing.com/consultation\n\nQuestions? Contact us at admin@kaizenclimbing.com`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Kaizen Climbing Coaching <notify@kaizenclimbing.com>",
        reply_to: "admin@kaizenclimbing.com",
        to: [email],
        subject: "We've received your enquiry — Kaizen Climbing Coaching",
        html: renderEmail(firstName, interests),
        text,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(`Resend error [${res.status}]: ${JSON.stringify(data)}`);

    return new Response(JSON.stringify({ success: true, id: data.id }), {
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
