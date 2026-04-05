import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { fetchTemplate, applyTokens } from "../_shared/email-db.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ConsultationConfirmationPayload {
  firstName: string;
  lastName: string;
  email: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");

    const payload: ConsultationConfirmationPayload = await req.json();
    const { firstName, lastName, email } = payload;

    const [clientTpl, adminTpl] = await Promise.all([
      fetchTemplate("consultation-client"),
      fetchTemplate("consultation-admin"),
    ]);

    const tokens = { firstName, lastName, email };

    const clientHtml = clientTpl
      ? applyTokens(clientTpl.html_body, tokens)
      : `<p>Hey ${firstName}, thanks for completing your consultation form. We'll be in touch within 72 hours.</p>`;
    const clientSubject = clientTpl
      ? applyTokens(clientTpl.subject, tokens)
      : "Consultation received — Kaizen Climbing Coaching";

    const adminHtml = adminTpl
      ? applyTokens(adminTpl.html_body, tokens)
      : `<p>${firstName} ${lastName} submitted a consultation form. Email: ${email}</p>`;
    const adminSubject = adminTpl
      ? applyTokens(adminTpl.subject, tokens)
      : `New consultation: ${firstName} ${lastName}`;

    const clientRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Kaizen Climbing Coaching <notify@kaizenclimbing.com>",
        reply_to: "admin@kaizenclimbing.co.uk",
        to: [email],
        subject: clientSubject,
        html: clientHtml,
        text: `Hey ${firstName}, thanks for completing your consultation form. We'll review everything and be in touch within 72 hours.\n\nWhat happens next:\n01 — Consultation reviewed, we'll reply within 72 hours\n02 — Complete payment, a payment link will be sent to you\n03 — Book your onboarding call, link sent after payment confirmed\n\nIn the meantime, feel free to reach out: admin@kaizenclimbing.co.uk`,
      }),
    });

    const clientData = await clientRes.json();
    if (!clientRes.ok) throw new Error(`Resend client email error [${clientRes.status}]: ${JSON.stringify(clientData)}`);

    const adminRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Kaizen Climbing Coaching <notify@kaizenclimbing.com>",
        reply_to: email,
        to: ["admin@kaizenclimbing.co.uk"],
        subject: adminSubject,
        html: adminHtml,
        text: `New consultation submission from ${firstName} ${lastName} (${email}).\n\nView in dashboard: https://kaizenclimbing.com/admin`,
      }),
    });

    const adminData = await adminRes.json();
    if (!adminRes.ok) throw new Error(`Resend admin email error [${adminRes.status}]: ${JSON.stringify(adminData)}`);

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
