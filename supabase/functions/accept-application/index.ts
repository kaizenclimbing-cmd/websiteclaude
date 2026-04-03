import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BOOKING_URL = "https://cal.com/kaizen-climbing/consultation-call";

const renderEmail = (firstName: string): string => `<!DOCTYPE html>
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
            <p style="margin:0 0 4px 0;font-family:'Arial Black',sans-serif;font-size:32px;font-weight:900;letter-spacing:0.03em;color:#1A1A1A;text-transform:uppercase;line-height:1;">YOU'RE</p>
            <p style="margin:0 0 24px 0;font-family:'Arial Black',sans-serif;font-size:32px;font-weight:900;letter-spacing:0.03em;color:#1A1A1A;text-transform:uppercase;line-height:1;">ACCEPTED.</p>
            <p style="margin:0 0 16px 0;font-family:'Inter',sans-serif;font-size:15px;color:#1A1A1A;line-height:1.6;">
              Hey ${firstName} — I've reviewed your application and I'd love to work with you.
            </p>
            <p style="margin:0 0 16px 0;font-family:'Inter',sans-serif;font-size:15px;color:#1A1A1A;line-height:1.6;">
              The next step is a free 30-minute consultation call — just us, no pressure. We'll talk through your goals, I'll explain exactly how the coaching works, and we can make sure we're both a good fit before anything else happens.
            </p>
            <p style="margin:0 0 28px 0;font-family:'Inter',sans-serif;font-size:15px;color:#1A1A1A;line-height:1.6;">
              Book a time that works for you below. The calendar is synced to my availability.
            </p>
            <a href="${BOOKING_URL}"
               style="display:inline-block;background-color:#5C5435;color:#FFC93C;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;text-decoration:none;padding:16px 32px;">
              BOOK YOUR DISCOVERY CALL →
            </a>
            <p style="margin:24px 0 0 0;font-family:'Inter',sans-serif;font-size:13px;color:rgba(26,26,26,0.6);line-height:1.6;">
              If none of the times work, reply to this email and we'll sort something out.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background-color:#2a2a2a;padding:24px 40px;">
            <p style="margin:0 0 12px 0;font-family:'Inter',sans-serif;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#FFC93C;">What happens after the call</p>
            <p style="margin:0 0 6px 0;font-family:'Inter',sans-serif;font-size:13px;color:rgba(255,255,255,0.6);line-height:1.6;">
              1. We talk — 30 minutes, free, no commitment
            </p>
            <p style="margin:0 0 6px 0;font-family:'Inter',sans-serif;font-size:13px;color:rgba(255,255,255,0.6);line-height:1.6;">
              2. If we're both in, I'll send you a payment link (£600 full or 3 × £215)
            </p>
            <p style="margin:0 0 6px 0;font-family:'Inter',sans-serif;font-size:13px;color:rgba(255,255,255,0.6);line-height:1.6;">
              3. Once paid, you'll set up your account and complete a detailed intake form
            </p>
            <p style="margin:0;font-family:'Inter',sans-serif;font-size:13px;color:rgba(255,255,255,0.6);line-height:1.6;">
              4. I build your plan — coaching starts
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

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not configured");

    // Verify caller is an authenticated admin
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { application_id } = await req.json();
    if (!application_id) throw new Error("application_id required");

    // Fetch application
    const { data: app, error: fetchErr } = await supabase
      .from("applications")
      .select("id, first_name, last_name, email, status")
      .eq("id", application_id)
      .single();

    if (fetchErr || !app) throw new Error("Application not found");
    if (app.status !== "pending") throw new Error(`Application already ${app.status}`);

    // Update status
    const { error: updateErr } = await supabase
      .from("applications")
      .update({ status: "accepted", reviewed_at: new Date().toISOString() })
      .eq("id", application_id);

    if (updateErr) throw new Error(`Update error: ${updateErr.message}`);

    // Send acceptance email
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Buster @ Kaizen <notify@kaizenclimbing.com>",
        reply_to: "admin@kaizenclimbing.co.uk",
        to: [app.email],
        subject: `You're in — let's book your consultation call`,
        html: renderEmail(app.first_name),
        text: `Hey ${app.first_name} — I've reviewed your application and I'd love to work with you. Book your free consultation call here: ${BOOKING_URL}\n\nAfter the call, if we're both in, I'll send a payment link. — Buster`,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(`Resend error: ${JSON.stringify(data)}`);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("accept-application error:", err);
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
