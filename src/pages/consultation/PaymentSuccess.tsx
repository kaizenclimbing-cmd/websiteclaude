import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { addDays, format } from "date-fns";

const PLAN_DETAILS: Record<string, { label: string; billing: string; commitment: string | null; notice: string }> = {
  kaizen_plan: {
    label: "The Kaizen Plan",
    billing: "£200 billed every 4 weeks",
    commitment: "Minimum commitment: 12 weeks",
    notice: "Cancel with 2 weeks' notice",
  },
  six_week_peak: {
    label: "6 Week Peak Plan",
    billing: "£200 one-off payment",
    commitment: null,
    notice: "Cancel with 2 weeks' notice",
  },
};

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const plan = searchParams.get("plan") ?? "";
  const isPreview = searchParams.get("preview") === "1";

  const [status, setStatus] = useState<"verifying" | "success" | "error">(isPreview ? "success" : "verifying");

  const refundDeadline = format(addDays(new Date(), 14), "d MMMM yyyy");
  const planDetails = PLAN_DETAILS[plan] ?? null;

  useEffect(() => {
    if (isPreview) return;
    if (!sessionId) { setStatus("error"); return; }

    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("verify-payment", {
          body: { session_id: sessionId },
        });
        if (error || !data?.paid) throw new Error("Payment not confirmed");
        setStatus("success");
      } catch {
        setStatus("error");
      }
    })();
  }, [sessionId]);

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16" style={{ backgroundColor: "hsl(var(--charcoal))" }}>
      <div className="max-w-lg w-full text-center">
        {status === "verifying" && (
          <>
            <Loader2 size={40} className="animate-spin mx-auto mb-6" style={{ color: "hsl(var(--golden))" }} />
            <p className="font-body text-white/60">Confirming your payment…</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle size={48} className="mx-auto mb-6" style={{ color: "hsl(var(--golden))" }} />
            <h1 className="font-display text-4xl sm:text-5xl leading-none mb-3" style={{ color: "hsl(var(--golden))" }}>
              PAYMENT CONFIRMED
            </h1>
            <div className="w-12 h-0.5 mx-auto mb-4" style={{ backgroundColor: "hsl(var(--golden))" }} />
            <p className="font-body text-white/70 mb-8 leading-relaxed">
              You're signed up for{" "}
              <span className="text-white font-semibold">{planDetails?.label ?? "your plan"}</span>.
            </p>

            {/* Info block */}
            <div
              className="text-left mb-8 overflow-hidden"
              style={{ border: "1px solid hsl(var(--golden) / 0.25)" }}
            >
              {/* Your plan */}
              <div className="p-5" style={{ borderBottom: "1px solid hsl(var(--golden) / 0.15)" }}>
                <p className="font-display text-xs tracking-[0.2em] mb-3" style={{ color: "hsl(var(--golden))" }}>
                  YOUR PLAN
                </p>
                <ul className="space-y-1.5">
                  {planDetails ? (
                    <>
                      <li className="font-body text-sm" style={{ color: "hsl(var(--chalk-white) / 0.8)" }}>
                        {planDetails.billing}
                      </li>
                      {planDetails.commitment && (
                        <li className="font-body text-sm" style={{ color: "hsl(var(--chalk-white) / 0.8)" }}>
                          {planDetails.commitment}
                        </li>
                      )}
                      <li className="font-body text-sm" style={{ color: "hsl(var(--chalk-white) / 0.8)" }}>
                        {planDetails.notice}
                      </li>
                    </>
                  ) : (
                    <li className="font-body text-sm" style={{ color: "hsl(var(--chalk-white) / 0.6)" }}>
                      See your payment receipt for details.
                    </li>
                  )}
                </ul>
              </div>

              {/* Refund policy */}
              <div className="p-5" style={{ backgroundColor: "hsl(var(--golden) / 0.05)" }}>
                <p className="font-display text-xs tracking-[0.2em] mb-3" style={{ color: "hsl(var(--golden))" }}>
                  REFUND POLICY
                </p>
                <p className="font-body text-sm leading-relaxed" style={{ color: "hsl(var(--chalk-white) / 0.8)" }}>
                  You have until{" "}
                  <span className="text-white font-semibold">{refundDeadline}</span> to request a refund.
                </p>
                <p
                  className="font-body text-sm leading-relaxed mt-2 font-semibold"
                  style={{ color: "hsl(var(--golden))" }}
                >
                  Once your onboarding call is booked and your programme begins, no refund is available.
                </p>
              </div>
            </div>

            <Link
              to="/book"
              className="inline-flex items-center gap-2 font-display text-sm tracking-wider px-6 py-3 transition-all duration-150 mb-5"
              style={{ backgroundColor: "hsl(var(--golden))", color: "hsl(var(--charcoal))" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "hsl(var(--golden-dark))"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "hsl(var(--golden))"; }}
            >
              I UNDERSTAND — BOOK MY CALL →
            </Link>

            <div>
              <Link
                to="/terms"
                className="font-body text-xs underline underline-offset-4 hover:opacity-80 transition-opacity"
                style={{ color: "hsl(var(--golden) / 0.5)" }}
              >
                VIEW FULL TERMS &amp; CONDITIONS
              </Link>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle size={48} className="mx-auto mb-6 text-red-400" />
            <h1 className="font-display text-3xl leading-none mb-4 text-white">
              PAYMENT NOT CONFIRMED
            </h1>
            <p className="font-body text-white/60 mb-8 leading-relaxed">
              We couldn't verify your payment. If you completed checkout, please contact us and we'll sort it out.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/consultation/next"
                className="font-display text-sm tracking-wider px-5 py-2.5 transition-all duration-150"
                style={{ border: "1px solid hsl(var(--golden) / 0.4)", color: "hsl(var(--golden))" }}
              >
                BACK TO STEPS
              </Link>
              <a
                href="mailto:Info@kaizenclimbing.co.uk"
                className="font-body text-sm underline pt-2.5"
                style={{ color: "hsl(var(--golden) / 0.6)" }}
              >
                Contact us
              </a>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
