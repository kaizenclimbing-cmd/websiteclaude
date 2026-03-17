import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  CreditCard,
  CalendarDays,
  FileText,
  ArrowRight,
  Loader2,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  LogOut,
  RefreshCw,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Stage = "not_started" | "submitted" | "paid" | "booked";
type StepStatus = "done" | "current" | "locked";
type Plan = "kaizen_plan" | "six_week_peak";

interface Submission {
  first_name: string;
  onboarding_stage: string;
}

type BillingData = {
  subscriptionId: string;
  planName: string;
  amountPence: number;
  intervalLabel: string;
  cycleDays: number;
  planStartDate: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  firstPaymentDate: string | null;
  commitmentEndDate: string;
  noticeDeadlineDate: string;
  upcomingPayments: string[];
  cancelAtPeriodEnd: boolean;
};

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
    cta: null,
  },
  {
    icon: CalendarDays,
    number: "03",
    title: "BOOK YOUR CALL",
    description: "Pick a time that works for you. Your onboarding call is where we map out your training plan together.",
    cta: { label: "BOOK YOUR CALL", href: "/book" },
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const fmtAmount = (pence: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(pence / 100);

// ── Billing portal ────────────────────────────────────────────────────────────

function BillingPortal({ billing, loading, onRefresh, firstName, onLogout }: {
  billing: BillingData | null;
  loading: boolean;
  onRefresh: () => void;
  firstName: string;
  onLogout: () => void;
}) {
  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 size={28} className="animate-spin" style={{ color: "hsl(var(--golden))" }} />
      </div>
    );
  }

  if (!billing) {
    return (
      <div
        className="p-6 text-center border"
        style={{ borderColor: "hsl(var(--golden) / 0.2)", backgroundColor: "hsl(var(--golden) / 0.04)" }}
      >
        <p className="font-body text-sm text-white/60 mb-4">
          No active subscription found. If you've recently paid, it may take a moment to update.
        </p>
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-wider px-4 py-2"
          style={{ border: "1px solid hsl(var(--golden) / 0.4)", color: "hsl(var(--golden))" }}
        >
          <RefreshCw size={12} />
          Refresh
        </button>
      </div>
    );
  }

  const today = new Date();
  const noticeDeadline = new Date(billing.noticeDeadlineDate);
  const commitmentEnd = new Date(billing.commitmentEndDate);
  const daysUntilNotice = Math.ceil((noticeDeadline.getTime() - today.getTime()) / 86400000);
  const daysUntilCommitment = Math.ceil((commitmentEnd.getTime() - today.getTime()) / 86400000);
  const pastCommitment = daysUntilCommitment <= 0;
  const noticeUrgent = daysUntilNotice >= 0 && daysUntilNotice <= 7;
  const noticePast = daysUntilNotice < 0;

  return (
    <div className="space-y-5">

      {/* Plan header card */}
      <div
        className="p-6 border"
        style={{ backgroundColor: "hsl(var(--golden) / 0.06)", borderColor: "hsl(var(--golden) / 0.25)" }}
      >
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <p className="font-mono text-xs tracking-[0.25em] mb-1" style={{ color: "hsl(var(--golden) / 0.5)" }}>
              YOUR PLAN
            </p>
            <p className="font-display text-3xl leading-none" style={{ color: "hsl(var(--golden))" }}>
              {billing.planName.toUpperCase()}
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-3xl leading-none" style={{ color: "hsl(var(--golden))" }}>
              {fmtAmount(billing.amountPence)}
            </p>
            <p className="font-body text-xs text-white/40 mt-0.5">{billing.intervalLabel}</p>
          </div>
        </div>
        {billing.cancelAtPeriodEnd && (
          <div
            className="px-3 py-2 text-sm font-body"
            style={{ backgroundColor: "hsl(0 70% 55% / 0.12)", border: "1px solid hsl(0 70% 55% / 0.35)", color: "hsl(0 70% 70%)" }}
          >
            ⚠ Cancellation pending — active until {fmtDate(billing.currentPeriodEnd)}
          </div>
        )}
      </div>

      {/* Timeline grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* First payment */}
        <BillingTile
          icon={<CreditCard size={15} />}
          label="First Payment"
          value={billing.firstPaymentDate ? fmtDate(billing.firstPaymentDate) : "—"}
          sub="When your plan began"
        />

        {/* Current cycle */}
        <BillingTile
          icon={<CalendarDays size={15} />}
          label="Current Cycle"
          value={`${fmtDate(billing.currentPeriodStart)} → ${fmtDate(billing.currentPeriodEnd)}`}
          sub={`Next charge: ${fmtDate(billing.currentPeriodEnd)}`}
        />

        {/* 12-week commitment */}
        <BillingTile
          icon={<CheckCircle2 size={15} />}
          label="12-Week Commitment"
          value={fmtDate(billing.commitmentEndDate)}
          sub={pastCommitment ? "✓ Minimum commitment met" : `${daysUntilCommitment} day${daysUntilCommitment !== 1 ? "s" : ""} remaining`}
          accent={pastCommitment ? "green" : undefined}
        />

        {/* Notice deadline */}
        <BillingTile
          icon={<AlertTriangle size={15} />}
          label="Cancellation Notice Deadline"
          value={fmtDate(billing.noticeDeadlineDate)}
          sub={
            noticePast
              ? "Window passed — next cycle will bill"
              : daysUntilNotice === 0
              ? "Today is the last day to cancel"
              : `${daysUntilNotice} day${daysUntilNotice !== 1 ? "s" : ""} to give notice`
          }
          accent={noticeUrgent ? "amber" : noticePast ? "red" : undefined}
        />
      </div>

      {/* Upcoming payments */}
      <div
        className="p-5 border"
        style={{ backgroundColor: "hsl(var(--golden) / 0.04)", borderColor: "hsl(var(--golden) / 0.15)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Clock size={14} style={{ color: "hsl(var(--golden))" }} />
          <p className="font-body text-xs font-semibold uppercase tracking-wider text-white/40">
            Upcoming Payment Dates
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {billing.upcomingPayments.map((date, i) => (
            <span
              key={date}
              className="font-body text-sm px-3 py-1.5 border"
              style={{
                backgroundColor: i === 0 ? "hsl(var(--golden) / 0.12)" : "transparent",
                borderColor: i === 0 ? "hsl(var(--golden) / 0.5)" : "hsl(var(--golden) / 0.15)",
                color: i === 0 ? "hsl(var(--golden))" : "rgba(255,255,255,0.45)",
              }}
            >
              {i === 0 ? "Next: " : ""}{fmtDate(date)}
            </span>
          ))}
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <a
          href="mailto:Info@kaizenclimbing.co.uk"
          className="font-body text-xs underline underline-offset-4 transition-opacity hover:opacity-70"
          style={{ color: "hsl(var(--golden) / 0.5)" }}
        >
          Questions? Info@kaizenclimbing.co.uk
        </a>
        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 font-body text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            <RefreshCw size={11} />
            Refresh
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 font-body text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            <LogOut size={11} />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

function BillingTile({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent?: "green" | "amber" | "red";
}) {
  const accentColour =
    accent === "green" ? "hsl(142 60% 65%)" :
    accent === "amber" ? "hsl(38 95% 65%)" :
    accent === "red"   ? "hsl(0 70% 65%)" :
    "hsl(var(--golden))";

  const accentBg =
    accent === "green" ? "hsl(142 60% 40% / 0.12)" :
    accent === "amber" ? "hsl(38 95% 55% / 0.1)" :
    accent === "red"   ? "hsl(0 70% 55% / 0.1)" :
    "hsl(var(--golden) / 0.06)";

  return (
    <div
      className="p-5 border flex items-start gap-3"
      style={{ backgroundColor: accentBg, borderColor: accent ? `${accentColour}40` : "hsl(var(--golden) / 0.15)" }}
    >
      <div className="mt-0.5 p-1.5 rounded-sm flex-shrink-0" style={{ backgroundColor: `${accentColour}15` }}>
        <span style={{ color: accentColour }}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="font-body text-xs font-semibold uppercase tracking-wider text-white/40 mb-1">{label}</p>
        <p className="font-body text-sm text-white leading-snug break-words">{value}</p>
        {sub && (
          <p className="font-body text-xs mt-0.5" style={{ color: accent ? accentColour : "rgba(255,255,255,0.3)" }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ConsultationNext() {
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<Submission | null | "loading">("loading");
  const [userEmail, setUserEmail] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<Plan>("kaizen_plan");
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState("");
  const [billing, setBilling] = useState<BillingData | null>(null);
  const [billingLoading, setBillingLoading] = useState(false);

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

  const fetchBilling = async () => {
    setBillingLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const resp = await supabase.functions.invoke("client-billing", {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (resp.data?.subscription) setBilling(resp.data.subscription as BillingData);
      else setBilling(null);
    } catch (e) {
      console.error(e);
    }
    setBillingLoading(false);
  };

  const stage: Stage = submission === "loading" || !submission
    ? "not_started"
    : (submission as Submission).onboarding_stage as Stage;

  // Fetch billing once we know client is booked
  useEffect(() => {
    if (stage === "booked" && !billing && !billingLoading) {
      fetchBilling();
    }
  }, [stage]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/consultation/auth");
  };

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
  const firstName = hasSubmission ? (submission as Submission).first_name : null;
  const greeting = firstName
    ? firstName.toUpperCase()
    : userEmail
    ? userEmail.split("@")[0].toUpperCase()
    : "THERE";

  const isBooked = stage === "booked";

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
          {isBooked
            ? "Your coaching is active. Here's your plan overview and billing timeline."
            : "Complete each step below to get started with your coaching journey."}
        </p>

        {/* ── CLIENT PORTAL (booked state) ── */}
        {isBooked ? (
          <BillingPortal
            billing={billing}
            loading={billingLoading}
            onRefresh={fetchBilling}
            firstName={greeting}
            onLogout={handleLogout}
          />
        ) : (
          /* ── ONBOARDING STEPS ── */
          <>
            <div className="space-y-0">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                const status: StepStatus = getStepStatus(i, stage);
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
          </>
        )}
      </div>
    </main>
  );
}
