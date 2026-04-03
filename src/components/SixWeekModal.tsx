import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  open: boolean;
  onClose: () => void;
}

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

export default function SixWeekModal({ open, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "hsl(var(--void-dark))", border: "1px solid hsl(var(--neon-orange) / 0.4)" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6" style={{ borderBottom: "1px solid hsl(var(--neon-orange) / 0.2)" }}>
          <div>
            <p className="font-mono text-xs tracking-[0.25em] mb-1" style={{ color: "hsl(var(--neon-orange))" }}>
              // FIXED-TERM PROGRAMME
            </p>
            <h2 className="font-display text-2xl leading-none" style={{ color: "hsl(var(--chalk-white))" }}>
              6 WEEK PEAK PLAN
            </h2>
          </div>
          <button onClick={onClose} className="ml-4 mt-1 opacity-50 hover:opacity-100 transition-opacity">
            <X size={20} style={{ color: "hsl(var(--chalk-white))" }} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="font-display text-4xl" style={{ color: "hsl(var(--neon-orange))" }}>£200</span>
            <span className="font-mono text-xs tracking-wider opacity-50" style={{ color: "hsl(var(--chalk-white))" }}>ONE-OFF PAYMENT</span>
          </div>

          {/* What you get */}
          <div>
            <p className="font-mono text-xs tracking-[0.2em] mb-4" style={{ color: "hsl(var(--neon-orange))" }}>
              WHAT'S INCLUDED
            </p>
            <ul className="space-y-2.5">
              {WHAT_YOU_GET.map((item, i) => (
                <li key={i} className="flex items-start gap-3 font-mono text-xs" style={{ color: "hsl(var(--chalk-white) / 0.75)" }}>
                  <span style={{ color: "hsl(var(--neon-orange))" }} className="flex-shrink-0">►</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* How it works */}
          <div>
            <p className="font-mono text-xs tracking-[0.2em] mb-4" style={{ color: "hsl(var(--neon-orange))" }}>
              HOW IT WORKS
            </p>
            <ol className="space-y-3">
              {HOW_IT_WORKS.map(({ step, text }) => (
                <li key={step} className="flex items-start gap-4">
                  <span className="font-display text-sm flex-shrink-0" style={{ color: "hsl(var(--neon-orange) / 0.5)" }}>{step}</span>
                  <span className="font-mono text-xs" style={{ color: "hsl(var(--chalk-white) / 0.75)" }}>{text}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Start date note */}
          <p className="font-mono text-xs leading-relaxed" style={{ color: "hsl(var(--chalk-white) / 0.45)" }}>
            We'll aim to get your plan started as soon as possible, but we can't guarantee a specific start date.
          </p>

          {/* CTA */}
          {error && (
            <p className="font-mono text-xs text-red-400">{error}</p>
          )}
          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 font-display text-sm tracking-wider py-4 transition-all duration-150 disabled:opacity-60"
            style={{ backgroundColor: "hsl(var(--neon-orange))", color: "hsl(var(--chalk-white))" }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : "GET YOUR PLAN — £200 →"}
          </button>

          <p className="text-center font-mono text-xs" style={{ color: "hsl(var(--chalk-white) / 0.35)" }}>
            You'll create your account after payment
          </p>
        </div>
      </div>
    </div>
  );
}
