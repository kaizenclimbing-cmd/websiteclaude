import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { fetchTemplate, applyTokens } from "../_shared/email-db.ts";

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

const fallbackHtml = (firstName: string, interests: string[]): string => {
  const interestList = interests.length > 0
    ? `<p style="margin:0 0 8px 0;color:#5C5435;font-family:'Inter',sans-serif;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">You expressed interest in:</p>
       <ul style="margin:0 0 24px 0;padding-left:20px;">
         ${interests.map(i => `<li style="color:#1A1A1A;font-family:'Inter',sans-serif;font-size:14px;margin-bottom:4px;">${i}</li>`).join("")}
       </ul>`
    : "";
  return `<!DOCTYPE html><html><body>Hey ${firstName}, thanks for your enquiry.${interestList}</body></html>`;
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

    const interestsBlock = interests.length > 0
      ? `<p style="margin:0 0 8px 0;color:#5C5435;font-family:'Inter',sans-serif;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">You expressed interest in:</p>
         <ul style="margin:0 0 24px 0;padding-left:20px;">
           ${interests.map(i => `<li style="color:#1A1A1A;font-family:'Inter',sans-serif;font-size:14px;margin-bottom:4px;">${i}</li>`).join("")}
         </ul>`
      : "";

    const tpl = await fetchTemplate("contact-confirmation");
    const html = tpl
      ? applyTokens(tpl.html_body, { firstName, interests_block: interestsBlock })
      : fallbackHtml(firstName, interests);
    const subject = tpl
      ? applyTokens(tpl.subject, { firstName })
      : "We've received your enquiry — Kaizen Climbing Coaching";

    const interestText = interests.length > 0 ? `\nYou expressed interest in: ${interests.join(", ")}\n` : "";
    const text = `Hey ${firstName}, thanks for your enquiry. We've received it and will be in touch shortly.${interestText}\nFill out the form: https://kaizenclimbing.com/consultation\n\nQuestions? Contact us at admin@kaizenclimbing.co.uk`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Kaizen Climbing Coaching <notify@kaizenclimbing.com>",
        reply_to: "admin@kaizenclimbing.co.uk",
        to: [email],
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
    console.error("Error sending contact confirmation email:", err);
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
