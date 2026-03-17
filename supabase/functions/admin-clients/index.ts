import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  // Verify admin
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
  }
  const token = authHeader.replace("Bearer ", "");
  const anonClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );
  const { data: { user } } = await anonClient.auth.getUser(token);
  if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });

  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();
  if (!roleData || roleData.role !== "admin") {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", { apiVersion: "2025-08-27.basil" });

    // Fetch all active subscriptions with full customer + price expansion
    const subscriptions = await stripe.subscriptions.list({
      status: "active",
      limit: 100,
      expand: ["data.customer", "data.items.data.price"],
    });

    const clients = await Promise.all(
      subscriptions.data.map(async (sub) => {
        const customer = sub.customer as Stripe.Customer;
        const item = sub.items.data[0];
        const price = item?.price;

        // Plan interval info
        const interval = price?.recurring?.interval ?? "month";
        const intervalCount = price?.recurring?.interval_count ?? 1;
        const cycleDays =
          interval === "day" ? intervalCount :
          interval === "week" ? intervalCount * 7 :
          interval === "month" ? intervalCount * 30 :
          intervalCount * 365;

        // Key dates from Stripe
        const planStartTs = sub.start_date; // Unix timestamp — subscription start
        const currentPeriodStartTs = sub.current_period_start;
        const currentPeriodEndTs = sub.current_period_end;

        // First payment = first invoice paid
        let firstPaymentDate: string | null = null;
        try {
          const invoices = await stripe.invoices.list({
            subscription: sub.id,
            limit: 100,
          });
          // Sort ascending to find the earliest paid invoice
          const paid = invoices.data
            .filter((inv) => inv.status === "paid" && inv.amount_paid > 0)
            .sort((a, b) => (a.created ?? 0) - (b.created ?? 0));
          if (paid.length > 0) {
            firstPaymentDate = new Date((paid[0].created ?? 0) * 1000).toISOString();
          }
        } catch (_) {
          // ignore
        }

        // Kaizen plan: 12-week (3-month) minimum from plan start
        // 12 weeks = 84 days
        const minimumCommitmentDays = 84;
        const commitmentEndTs = planStartTs + minimumCommitmentDays * 86400;

        // Notice deadline: 2 weeks (14 days) before the NEXT billing date
        // to avoid being charged for the following cycle
        const noticeDeadlineTs = currentPeriodEndTs - 14 * 86400;

        // Upcoming payment dates: next 3 cycles from current period end
        const upcomingPayments: string[] = [];
        let nextTs = currentPeriodEndTs;
        for (let i = 0; i < 3; i++) {
          upcomingPayments.push(new Date(nextTs * 1000).toISOString());
          nextTs += cycleDays * 86400;
        }

        const amountPence = price?.unit_amount ?? 0;
        const productId = typeof price?.product === "string" ? price.product : (price?.product as Stripe.Product)?.id ?? "";

        // Try to get product name
        let planName = "Unknown Plan";
        try {
          if (productId) {
            const product = await stripe.products.retrieve(productId);
            planName = product.name;
          }
        } catch (_) {
          // ignore
        }

        return {
          subscriptionId: sub.id,
          customerId: customer.id,
          customerName: customer.name ?? "",
          customerEmail: customer.email ?? "",
          planName,
          amountPence,
          intervalLabel: intervalCount > 1 ? `Every ${intervalCount} ${interval}s` : `Monthly`,
          cycleDays,
          planStartDate: new Date(planStartTs * 1000).toISOString(),
          currentPeriodStart: new Date(currentPeriodStartTs * 1000).toISOString(),
          currentPeriodEnd: new Date(currentPeriodEndTs * 1000).toISOString(),
          firstPaymentDate,
          commitmentEndDate: new Date(commitmentEndTs * 1000).toISOString(),
          noticeDeadlineDate: new Date(noticeDeadlineTs * 1000).toISOString(),
          upcomingPayments,
          status: sub.status,
          cancelAtPeriodEnd: sub.cancel_at_period_end,
        };
      })
    );

    return new Response(JSON.stringify({ clients }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("admin-clients error:", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
