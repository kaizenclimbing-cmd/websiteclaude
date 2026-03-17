import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

serve(async () => {
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY") ?? "";

  // Create a new price: £200 every 4 weeks (interval=week, interval_count=4)
  const body = new URLSearchParams({
    "currency": "gbp",
    "unit_amount": "20000",
    "product": "prod_UAPivlj1EvHLCP",
    "recurring[interval]": "week",
    "recurring[interval_count]": "4",
  });

  const res = await fetch("https://api.stripe.com/v1/prices", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${stripeKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  const data = await res.json();

  // Archive the old monthly price
  const archiveRes = await fetch("https://api.stripe.com/v1/prices/price_1TC4stRk0BQkOnjH9w8ZcpMJ", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${stripeKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "active=false",
  });

  const archiveData = await archiveRes.json();

  return new Response(JSON.stringify({ new_price: data, archived: archiveData }), {
    headers: { "Content-Type": "application/json" },
  });
});
