import { useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const WHAT_YOU_GET = [
  "6-week fully customised training plan",
  "Fingerboarding, drills, on-the-wall sessions and more",
  "Tailored to what will improve your climbing most",
  "Once-a-week email support throughout",
  "No mid-plan changes — a focused, structured block",
];

const HOW_IT_WORKS = [
  { step: "01", text: "Pay and create your account" },
  { step: "02", text: "Fill in your consultation form" },
  { step: "03", text: "We review your form — may follow up with questions" },
  { step: "04", text: "We confirm your start date and deliver your plan" },
];

export default function SixWeekPlan() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error: fnError } = await supabase.functions.invoke("create-sixweek-payment");
      if (fnError || !data?.url) throw new Error(fnError?.message || "Could not start checkout");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-24 px-6" style={{ backgroundColor: "hsl(var(--void-dark))" }}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <p className="font-mono text-xs tracking-[0.25em] mb-3" style={{ color: "hsl(var(--neon-orange))" }}>
          // FIXED-TERM PROGRAMME
        </p>
        <h1 className="font-display text-4xl sm:text-5xl leading-none mb-2" style={{ color: "hsl(var(--chalk-white))" }}>
          6 WEEK PEAK PLAN
        </h1>
        <div className="flex items-baseline gap-3 mt-6 mb-12">
          <span className="font-display text-5xl" style={{ color: "hsl(var(--neon-orange))" }}>£200</span>
          <span className="font-mono text-xs tracking-wider opacity-50" style={{ color: "hsl(var(--chalk-white))" }}>ONE-OFF PAYMENT</span>
        </div>

        {/* What's included */}
        <section className="mb-12">
          <p className="font-mono text-xs tracking-[0.2em] mb-6" style={{ color: "hsl(var(--neon-orange))" }}>
            WHAT'S INCLUDED
          </p>
          <ul className="space-y-3">
            {WHAT_YOU_GET.map((item, i) => (
              <li key={i} className="flex items-start gap-3 font-mono text-sm" style={{ color: "hsl(var(--chalk-white) / 0.75)" }}>
                <span style={{ color: "hsl(var(--neon-orange))" }} className="flex-shrink-0">►</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Divider */}
        <div className="mb-12" style={{ borderTop: "1px solid hsl(var(--neon-orange) / 0.15)" }} />

        {/* How it works */}
        <section className="mb-12">
          <p className="font-mono text-xs tracking-[0.2em] mb-6" style={{ color: "hsl(var(--neon-orange))" }}>
            HOW IT WORKS
          </p>
          <ol className="space-y-5">
            {HOW_IT_WORKS.map(({ step, text }) => (
              <li key={step} className="flex items-start gap-5">
                <span className="font-display text-2xl flex-shrink-0" style={{ color: "hsl(var(--neon-orange) / 0.4)" }}>{step}</span>
                <span className="font-mono text-sm pt-1" style={{ color: "hsl(var(--chalk-white) / 0.75)" }}>{text}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Divider */}
        <div className="mb-12" style={{ borderTop: "1px solid hsl(var(--neon-orange) / 0.15)" }} />

        {/* Start date note */}
        <p className="font-mono text-xs leading-relaxed mb-10" style={{ color: "hsl(var(--chalk-white) / 0.4)" }}>
          We'll aim to get your plan started as soon as possible, but we can't guarantee a specific start date.
        </p>

        {/* CTA */}
        {error && <p className="font-mono text-xs text-red-400 mb-4">{error}</p>}
        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 font-display text-sm tracking-wider py-5 transition-all duration-150 disabled:opacity-60"
          style={{ backgroundColor: "hsl(var(--neon-orange))", color: "hsl(var(--chalk-white))" }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : "GET YOUR PLAN — £200 →"}
        </button>
        <p className="text-center font-mono text-xs mt-4" style={{ color: "hsl(var(--chalk-white) / 0.35)" }}>
          You'll create your account after payment
        </p>
      </div>
    </main>
  );
}
