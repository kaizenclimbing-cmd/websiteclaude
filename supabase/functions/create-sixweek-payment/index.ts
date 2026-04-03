import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "npm:stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SIX_WEEK_PRICE_ID = "price_1TC4tCRk0BQkOnjHJiubrAaA"; // £200 one-off

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const origin = req.headers.get("origin") || "https://kaizenclimbing.co.uk";

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: SIX_WEEK_PRICE_ID, quantity: 1 }],
      mode: "payment",
      // Stripe collects the email at checkout — no account needed upfront
      success_url: `${origin}/plans/6-week/signup?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/plans/6-week`,
      metadata: { plan: "six_week_peak" },
    });

    return new Response(JSON.stringify({ url: session.url }), {
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
