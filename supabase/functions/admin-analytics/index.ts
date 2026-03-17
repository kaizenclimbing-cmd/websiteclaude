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

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString();

  // DB queries in parallel
  const [
    { count: enquiriesThisMonth },
    { count: enquiriesLastMonth },
    { count: newClientsThisMonth },
    { count: newClientsLastMonth },
    { data: allConsultations },
  ] = await Promise.all([
    supabase
      .from("contact_submissions")
      .select("*", { count: "exact", head: true })
      .gte("submitted_at", startOfMonth),
    supabase
      .from("contact_submissions")
      .select("*", { count: "exact", head: true })
      .gte("submitted_at", startOfLastMonth)
      .lte("submitted_at", endOfLastMonth),
    supabase
      .from("consultation_submissions")
      .select("*", { count: "exact", head: true })
      .gte("submitted_at", startOfMonth),
    supabase
      .from("consultation_submissions")
      .select("*", { count: "exact", head: true })
      .gte("submitted_at", startOfLastMonth)
      .lte("submitted_at", endOfLastMonth),
    supabase
      .from("consultation_submissions")
      .select("onboarding_stage"),
  ]);

  // Stage breakdown
  const stageBreakdown: Record<string, number> = {};
  for (const row of (allConsultations ?? [])) {
    stageBreakdown[row.onboarding_stage] = (stageBreakdown[row.onboarding_stage] ?? 0) + 1;
  }

  // Stripe revenue
  let revenueThisMonth = 0;
  let revenueLastMonth = 0;
  let activeSubscriptions = 0;
  let predictedMonthlyRevenue = 0;

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", { apiVersion: "2025-08-27.basil" });

    const startOfMonthTs = Math.floor(new Date(now.getFullYear(), now.getMonth(), 1).getTime() / 1000);
    const startOfLastMonthTs = Math.floor(new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime() / 1000);
    const endOfLastMonthTs = Math.floor(new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).getTime() / 1000);

    const [thisMonthPI, lastMonthPI, activeSubs] = await Promise.all([
      stripe.paymentIntents.list({ limit: 100, created: { gte: startOfMonthTs } }),
      stripe.paymentIntents.list({ limit: 100, created: { gte: startOfLastMonthTs, lte: endOfLastMonthTs } }),
      stripe.subscriptions.list({ status: "active", limit: 100 }),
    ]);

    revenueThisMonth = thisMonthPI.data
      .filter((pi) => pi.status === "succeeded")
      .reduce((sum, pi) => sum + pi.amount, 0);

    revenueLastMonth = lastMonthPI.data
      .filter((pi) => pi.status === "succeeded")
      .reduce((sum, pi) => sum + pi.amount, 0);

    activeSubscriptions = activeSubs.data.length;

    // Predicted = sum of active subscription amounts per month
    for (const sub of activeSubs.data) {
      for (const item of sub.items.data) {
        const price = item.price;
        const unitAmount = price.unit_amount ?? 0;
        const interval = price.recurring?.interval;
        const intervalCount = price.recurring?.interval_count ?? 1;
        // Normalise to monthly
        if (interval === "month") predictedMonthlyRevenue += unitAmount / intervalCount;
        else if (interval === "year") predictedMonthlyRevenue += unitAmount / (12 * intervalCount);
        else if (interval === "week") predictedMonthlyRevenue += (unitAmount * 52) / (12 * intervalCount);
        else if (interval === "day") predictedMonthlyRevenue += (unitAmount * 365) / (12 * intervalCount);
      }
    }
  } catch (e) {
    console.error("Stripe error:", e);
  }

  return new Response(
    JSON.stringify({
      enquiries: { thisMonth: enquiriesThisMonth ?? 0, lastMonth: enquiriesLastMonth ?? 0 },
      newClients: { thisMonth: newClientsThisMonth ?? 0, lastMonth: newClientsLastMonth ?? 0 },
      revenue: { thisMonth: revenueThisMonth, lastMonth: revenueLastMonth },
      predictedMonthlyRevenue,
      activeSubscriptions,
      stageBreakdown,
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
