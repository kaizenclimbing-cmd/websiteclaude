import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
  }

  const anonClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );
  const token = authHeader.replace("Bearer ", "");
  const { data: { user } } = await anonClient.auth.getUser(token);
  if (!user?.email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", { apiVersion: "2025-08-27.basil" });

    // Find Stripe customer by email
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    if (customers.data.length === 0) {
      return new Response(JSON.stringify({ subscription: null }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const customerId = customers.data[0].id;

    // Get active subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
      expand: ["data.items.data.price"],
    });

    if (subscriptions.data.length === 0) {
      return new Response(JSON.stringify({ subscription: null }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const sub = subscriptions.data[0];
    const item = sub.items.data[0];
    const price = item?.price;

    const interval = price?.recurring?.interval ?? "month";
    const intervalCount = price?.recurring?.interval_count ?? 1;
    const cycleDays =
      interval === "day" ? intervalCount :
      interval === "week" ? intervalCount * 7 :
      interval === "month" ? intervalCount * 30 :
      intervalCount * 365;

    const planStartTs = sub.start_date;
    const currentPeriodStartTs = sub.current_period_start;
    const currentPeriodEndTs = sub.current_period_end;

    // First paid invoice
    let firstPaymentDate: string | null = null;
    const invoices = await stripe.invoices.list({ subscription: sub.id, limit: 100 });
    const paid = invoices.data
      .filter((inv) => inv.status === "paid" && inv.amount_paid > 0)
      .sort((a, b) => (a.created ?? 0) - (b.created ?? 0));
    if (paid.length > 0) {
      firstPaymentDate = new Date((paid[0].created ?? 0) * 1000).toISOString();
    }

    // 12-week (84 day) minimum commitment
    const commitmentEndTs = planStartTs + 84 * 86400;
    // Notice deadline: 14 days before next billing
    const noticeDeadlineTs = currentPeriodEndTs - 14 * 86400;

    // Next 4 upcoming payment dates
    const upcomingPayments: string[] = [];
    let nextTs = currentPeriodEndTs;
    for (let i = 0; i < 4; i++) {
      upcomingPayments.push(new Date(nextTs * 1000).toISOString());
      nextTs += cycleDays * 86400;
    }

    // Plan name
    let planName = "Kaizen Plan";
    try {
      const productId = typeof price?.product === "string" ? price.product : (price?.product as Stripe.Product)?.id ?? "";
      if (productId) {
        const product = await stripe.products.retrieve(productId);
        planName = product.name;
      }
    } catch (_) { /* ignore */ }

    const intervalLabel = intervalCount === 1 ? "Monthly" : `Every ${intervalCount} ${interval}s`;

    return new Response(
      JSON.stringify({
        subscription: {
          subscriptionId: sub.id,
          planName,
          amountPence: price?.unit_amount ?? 0,
          intervalLabel,
          cycleDays,
          planStartDate: new Date(planStartTs * 1000).toISOString(),
          currentPeriodStart: new Date(currentPeriodStartTs * 1000).toISOString(),
          currentPeriodEnd: new Date(currentPeriodEndTs * 1000).toISOString(),
          firstPaymentDate,
          commitmentEndDate: new Date(commitmentEndTs * 1000).toISOString(),
          noticeDeadlineDate: new Date(noticeDeadlineTs * 1000).toISOString(),
          upcomingPayments,
          cancelAtPeriodEnd: sub.cancel_at_period_end,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("client-billing error:", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
