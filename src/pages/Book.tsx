import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
import { Globe, CreditCard } from "lucide-react";

export default function BookPage() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "training-consultations-2025" });
      cal("ui", {
        theme: "dark",
        cssVarsPerTheme: {
          light: { "cal-brand": "#E0B755" },
          dark: { "cal-brand": "#E0B755" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <main
      className="min-h-screen w-full"
      style={{ backgroundColor: "hsl(var(--void-black))" }}
    >
      {/* ── Branding Header ── */}
      <div
        className="w-full px-6 py-10 flex flex-col items-center text-center"
        style={{
          backgroundColor: "hsl(var(--void-dark))",
          borderBottom: "2px solid hsl(var(--neon-green))",
        }}
      >
        {/* Eyebrow */}
        <p
          className="font-mono text-xs tracking-[0.3em] mb-3"
          style={{ color: "hsl(var(--neon-orange))" }}
        >
          // KAIZEN CLIMBING COACHING
        </p>

        {/* Title */}
        <h1
          className="font-display text-4xl sm:text-5xl leading-none mb-4"
          style={{ color: "hsl(var(--chalk-white))" }}
        >
          BOOK YOUR CALL
        </h1>

        {/* Divider */}
        <div
          className="w-12 h-0.5 mb-6"
          style={{ backgroundColor: "hsl(var(--neon-green))" }}
        />

        {/* Description */}
        <p
          className="font-mono text-sm leading-relaxed max-w-lg mb-8"
          style={{ color: "hsl(var(--chalk-white) / 0.65)" }}
        >
          Select a time that works for you below. Times are shown in your local time zone
          and will automatically sync with mine — no mental maths required.
        </p>

        {/* Info notices */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xl">
          {/* Payment notice */}
          <div
            className="flex items-start gap-3 px-4 py-3 flex-1 text-left"
            style={{
              backgroundColor: "hsl(var(--void-black))",
              borderLeft: "3px solid hsl(var(--neon-orange))",
              border: "1px solid hsl(var(--neon-orange) / 0.3)",
              borderLeftWidth: "3px",
            }}
          >
            <CreditCard
              size={15}
              className="mt-0.5 flex-shrink-0"
              style={{ color: "hsl(var(--neon-orange))" }}
            />
            <p
              className="font-mono text-xs leading-relaxed"
              style={{ color: "hsl(var(--chalk-white) / 0.6)" }}
            >
              <span style={{ color: "hsl(var(--neon-orange))" }} className="font-semibold">
                Payment first.{" "}
              </span>
              Please ensure you have completed payment before booking your call.
            </p>
          </div>

          {/* Timezone notice */}
          <div
            className="flex items-start gap-3 px-4 py-3 flex-1 text-left"
            style={{
              backgroundColor: "hsl(var(--void-black))",
              border: "1px solid hsl(var(--neon-green) / 0.3)",
              borderLeftWidth: "3px",
              borderLeftColor: "hsl(var(--neon-green))",
              borderLeftStyle: "solid",
            }}
          >
            <Globe
              size={15}
              className="mt-0.5 flex-shrink-0"
              style={{ color: "hsl(var(--neon-green))" }}
            />
            <p
              className="font-mono text-xs leading-relaxed"
              style={{ color: "hsl(var(--chalk-white) / 0.6)" }}
            >
              <span style={{ color: "hsl(var(--neon-green))" }} className="font-semibold">
                Your time zone.{" "}
              </span>
              Select your time zone in the calendar — all slots will sync automatically.
            </p>
          </div>
        </div>
      </div>

      {/* ── Cal.com Embed ── */}
      <Cal
        namespace="training-consultations-2025"
        calLink="kaizenclimbing/training-consultations-2025"
        style={{ width: "100%", minHeight: "100vh", overflow: "scroll" }}
        config={{
          layout: "month_view",
          useSlotsViewOnSmallScreen: "true",
          theme: "dark",
        }}
      />
    </main>
  );
}
