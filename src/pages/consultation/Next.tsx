import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CreditCard, CalendarDays, FileText, ArrowRight, Loader2, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Stage = "not_started" | "submitted" | "paid" | "booked";
type StepStatus = "done" | "current" | "locked";
type Plan = "kaizen_plan" | "six_week_peak";

interface Submission {
  first_name: string;
  onboarding_stage: string;
}

function getStepStatus(stepIndex: number, stage: Stage): StepStatus {
  const stageToCurrentStep: Record<Stage, number> = {
    not_started: 0,
    submitted: 1,
    paid: 2,
    booked: 3,
  };
  const currentStep = stageToCurrentStep[stage] ?? 0;
  if (stepIndex < currentStep) return "done";
  if (stepIndex === currentStep) return "current";
  return "locked";
}

const PLAN_OPTIONS: { id: Plan; name: string; price: string; description: string; notice?: string }[] = [
  {
    id: "kaizen_plan",
    name: "THE KAIZEN PLAN",
    price: "£200 / 4 weeks",
    description: "Full ongoing remote coaching — personalised programme, day-by-day sessions, instant messaging support.",
    notice: "Minimum commitment: 12 weeks (3 billing cycles). To cancel, please give at least 2 weeks' notice before your next billing date — otherwise your next plan will be written and payment will be due.",
  },
  {
    id: "six_week_peak",
    name: "6 WEEK PEAK PLAN",
    price: "£200 one-off",
    description: "A fixed 6-week programme to peak for a trip or test our coaching before committing long-term.",
  },
];

const STEPS = [
  {
    icon: FileText,
    number: "01",
    title: "COMPLETE YOUR FORM",
    description: "Fill out the consultation form so we can understand your climbing background, goals, and experience.",
    cta: { label: "START FORM", href: "/consultation/form" },
  },
  {
    icon: CreditCard,
    number: "02",
    title: "COMPLETE PAYMENT",
    description: "Choose your coaching plan and secure your spot. You'll receive instant confirmation and your onboarding call link.",
    cta: null, // handled inline with plan picker
  },
  {
    icon: CalendarDays,
    number: "03",
    title: "BOOK YOUR CALL",
    description: "Pick a time that works for you. Your onboarding call is where we map out your training plan together.",
    cta: { label: "BOOK YOUR CALL", href: "/book" },
  },
];

export default function ConsultationNext() {
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<Submission | null | "loading">("loading");
  const [userEmail, setUserEmail] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<Plan>("kaizen_plan");
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState("");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/consultation/auth"); return; }
      setUserEmail(user.email ?? "");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase as any)
        .from("consultation_submissions")
        .select("first_name, onboarding_stage")
        .eq("user_id", user.id)
        .order("submitted_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      setSubmission(data ?? null);
    })();
  }, [navigate]);

  const handlePay = async () => {
    setPayError("");
    setPayLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: { plan: selectedPlan },
      });
      if (error || !data?.url) throw new Error(error?.message ?? "Could not start checkout");
      window.location.href = data.url;
    } catch (err) {
      setPayError(err instanceof Error ? err.message : "Something went wrong");
      setPayLoading(false);
    }
  };

  if (submission === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "hsl(var(--charcoal))" }}>
        <Loader2 size={28} className="animate-spin" style={{ color: "hsl(var(--golden))" }} />
      </main>
    );
  }

  const hasSubmission = submission !== null;
  const stage: Stage = hasSubmission ? ((submission as Submission).onboarding_stage as Stage) : "not_started";
  const firstName = hasSubmission ? (submission as Submission).first_name : null;
  const greeting = firstName
    ? firstName.toUpperCase()
    : userEmail
    ? userEmail.split("@")[0].toUpperCase()
    : "THERE";

  const allDone = stage === "booked";

  return (
    <main className="min-h-screen px-6 py-16" style={{ backgroundColor: "hsl(var(--charcoal))" }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <p className="font-mono text-xs tracking-[0.3em] text-center mb-4" style={{ color: "hsl(var(--golden) / 0.5)" }}>
          // KAIZEN CLIMBING COACHING
        </p>
        <h1 className="font-display text-5xl sm:text-6xl leading-none mb-2 text-center" style={{ color: "hsl(var(--golden))" }}>
          HEY, {greeting}
        </h1>
        <div className="w-16 h-0.5 mx-auto mt-4 mb-4" style={{ backgroundColor: "hsl(var(--golden))" }} />
        <p className="font-body text-sm text-center text-white/50 mb-14 leading-relaxed max-w-md mx-auto">
          {allDone
            ? "You're all set. We'll be in touch before your call."
            : "Complete each step below to get started with your coaching journey."}
        </p>

        {/* Timeline */}
        <div className="space-y-0">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const status: StepStatus = allDone ? "done" : getStepStatus(i, stage);
            const isDone = status === "done";
            const isCurrent = status === "current";
            const isLocked = status === "locked";
            const isPaymentStep = i === 1;

            return (
              <div key={step.number} className="relative flex gap-6">
                {i < STEPS.length - 1 && (
                  <div
                    className="absolute left-5 top-12 bottom-0 w-px"
                    style={{ backgroundColor: isDone ? "hsl(var(--golden) / 0.4)" : "hsl(var(--golden) / 0.15)" }}
                  />
                )}

                {/* Icon bubble */}
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mt-1"
                  style={{
                    backgroundColor: isDone ? "hsl(var(--golden))" : isCurrent ? "hsl(var(--golden) / 0.15)" : "hsl(var(--golden) / 0.06)",
                    border: `1.5px solid ${isDone ? "hsl(var(--golden))" : isCurrent ? "hsl(var(--golden) / 0.5)" : "hsl(var(--golden) / 0.2)"}`,
                  }}
                >
                  <Icon
                    size={16}
                    style={{
                      color: isDone ? "hsl(var(--charcoal))" : isCurrent ? "hsl(var(--golden))" : "hsl(var(--golden) / 0.3)",
                    }}
                  />
                </div>

                {/* Content */}
                <div className="pb-12 flex-1">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span
                      className="font-mono text-xs"
                      style={{ color: isDone ? "hsl(var(--golden))" : isCurrent ? "hsl(var(--golden) / 0.7)" : "hsl(var(--golden) / 0.25)" }}
                    >
                      {step.number}
                    </span>
                    <h3
                      className="font-display text-xl leading-none"
                      style={{ color: isDone ? "hsl(var(--golden))" : isCurrent ? "white" : "hsl(255 255 255 / 0.3)" }}
                    >
                      {step.title}
                      {isDone && (
                        <span className="ml-3 font-mono text-xs normal-case tracking-normal" style={{ color: "hsl(var(--golden) / 0.6)" }}>
                          ✓ complete
                        </span>
                      )}
                    </h3>
                  </div>

                  <p
                    className="font-body text-sm leading-relaxed mb-4"
                    style={{ color: isLocked ? "hsl(255 255 255 / 0.25)" : "hsl(255 255 255 / 0.55)" }}
                  >
                    {step.description}
                  </p>

                  {/* Payment step — plan picker */}
                  {isPaymentStep && isCurrent && (
                    <div className="space-y-3">
                      {PLAN_OPTIONS.map((plan) => {
                        const active = selectedPlan === plan.id;
                        return (
                          <button
                            key={plan.id}
                            type="button"
                            onClick={() => setSelectedPlan(plan.id)}
                            className="w-full text-left p-4 transition-all duration-150"
                            style={{
                              backgroundColor: active ? "hsl(var(--golden) / 0.08)" : "hsl(var(--golden) / 0.03)",
                              border: `1.5px solid ${active ? "hsl(var(--golden) / 0.6)" : "hsl(var(--golden) / 0.15)"}`,
                            }}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3">
                                <div
                                  className="w-3.5 h-3.5 rounded-full flex-shrink-0 mt-0.5 border-2 flex items-center justify-center"
                                  style={{ borderColor: active ? "hsl(var(--golden))" : "hsl(var(--golden) / 0.3)" }}
                                >
                                  {active && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "hsl(var(--golden))" }} />}
                                </div>
                                <div>
                                  <p className="font-display text-sm leading-none mb-1" style={{ color: active ? "hsl(var(--golden))" : "hsl(255 255 255 / 0.7)" }}>
                                    {plan.name}
                                  </p>
                                  <p className="font-body text-xs leading-relaxed" style={{ color: "hsl(255 255 255 / 0.45)" }}>
                                    {plan.description}
                                  </p>
                                  {plan.notice && (
                                    <p className="font-body text-xs leading-relaxed mt-2 pt-2" style={{ color: "hsl(var(--golden) / 0.55)", borderTop: "1px solid hsl(var(--golden) / 0.12)" }}>
                                      {plan.notice}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <span className="font-mono text-xs flex-shrink-0 pt-0.5" style={{ color: active ? "hsl(var(--golden))" : "hsl(255 255 255 / 0.4)" }}>
                                {plan.price}
                              </span>
                            </div>
                          </button>
                        );
                      })}

                      {payError && <p className="font-body text-xs text-red-400">{payError}</p>}

                      <button
                        onClick={handlePay}
                        disabled={payLoading}
                        className="inline-flex items-center gap-2 font-display text-sm tracking-wider px-5 py-2.5 transition-all duration-150 disabled:opacity-60"
                        style={{ backgroundColor: "hsl(var(--golden))", color: "hsl(var(--charcoal))" }}
                        onMouseEnter={(e) => { if (!payLoading) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "hsl(var(--golden-dark))"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "hsl(var(--golden))"; }}
                      >
                        {payLoading ? <Loader2 size={14} className="animate-spin" /> : <ChevronRight size={14} />}
                        {payLoading ? "REDIRECTING…" : "PAY NOW"}
                      </button>
                    </div>
                  )}

                  {/* Non-payment step CTAs */}
                  {!isPaymentStep && step.cta && isCurrent && (
                    <Link
                      to={step.cta.href}
                      className="inline-flex items-center gap-2 font-display text-sm tracking-wider px-5 py-2.5 transition-all duration-150"
                      style={{ backgroundColor: "hsl(var(--golden))", color: "hsl(var(--charcoal))" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "hsl(var(--golden-dark))"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "hsl(var(--golden))"; }}
                    >
                      {step.cta.label}
                      <ArrowRight size={14} />
                    </Link>
                  )}

                  {/* Locked CTA */}
                  {step.cta && isLocked && (
                    <div
                      className="inline-flex items-center gap-2 font-display text-sm tracking-wider px-5 py-2.5 cursor-not-allowed select-none"
                      style={{ backgroundColor: "hsl(var(--golden) / 0.06)", color: "hsl(var(--golden) / 0.2)", border: "1px solid hsl(var(--golden) / 0.12)" }}
                    >
                      {step.cta.label}
                      <ArrowRight size={14} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p className="font-body text-xs text-center text-white/30 mt-4">
          Questions?{" "}
          <a href="mailto:Info@kaizenclimbing.co.uk" className="underline" style={{ color: "hsl(var(--golden) / 0.5)" }}>
            Info@kaizenclimbing.co.uk
          </a>
        </p>
      </div>
    </main>
  );
}
