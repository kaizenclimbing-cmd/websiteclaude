import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { fetchTemplate, applyTokens } from "../_shared/email-db.ts";

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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");

    const payload: AdminNotificationPayload = await req.json();
    const { firstName, lastName, email, message, interests = [] } = payload;

    const interestsBadges = interests.length > 0
      ? interests.map(i => `<span style="display:inline-block;background-color:#FFC93C;color:#1A1A1A;font-family:'Inter',sans-serif;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;padding:4px 10px;margin:0 4px 4px 0;">${i}</span>`).join("")
      : `<span style="font-family:'Inter',sans-serif;font-size:13px;color:rgba(255,255,255,0.4);">None selected</span>`;

    const messageBlock = message
      ? `<tr><td style="padding:0 0 24px 0;"><p style="margin:0 0 6px 0;font-family:'Inter',sans-serif;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#FFC93C;">Message</p><p style="margin:0;font-family:'Inter',sans-serif;font-size:14px;color:rgba(255,255,255,0.85);line-height:1.6;font-style:italic;">"${message}"</p></td></tr>`
      : "";

    const tpl = await fetchTemplate("admin-notification");
    const html = tpl
      ? applyTokens(tpl.html_body, {
          firstName,
          lastName,
          email,
          firstName_upper: firstName.toUpperCase(),
          interests_badges: interestsBadges,
          message_block: messageBlock,
        })
      : `<p>New enquiry from ${firstName} ${lastName} (${email})</p>`;
    const subject = tpl
      ? applyTokens(tpl.subject, { firstName, lastName })
      : `New enquiry from ${firstName} ${lastName}`;

    const interestText = interests.length > 0 ? `Interested in: ${interests.join(", ")}\n` : "";
    const messageText = message ? `Message: "${message}"\n` : "";
    const text = `New enquiry from ${firstName} ${lastName}\nEmail: ${email}\n${interestText}${messageText}`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Kaizen Climbing Coaching <notify@kaizenclimbing.com>",
        reply_to: email,
        to: ["admin@kaizenclimbing.co.uk"],
        subject,
        html,
        text,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(`Resend error [${res.status}]: ${JSON.stringify(data)}`);

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error sending admin notification:", err);
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
