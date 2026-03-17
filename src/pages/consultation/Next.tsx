import { useEffect, useState, useCallback } from "react";
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
  Settings,
  ClipboardList,
  LayoutDashboard,
  ListChecks,
  Save,
  Mail,
  Globe,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// ── Types ─────────────────────────────────────────────────────────────────────

type Stage = "not_started" | "submitted" | "paid" | "booked";
type StepStatus = "done" | "current" | "locked";
type Plan = "kaizen_plan" | "six_week_peak";
type PortalTab = "plan" | "steps" | "form" | "settings";

interface Submission {
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  location: string | null;
  occupation: string | null;
  years_climbing: string | null;
  currently_injured: boolean | null;
  injury_history: string | null;
  climbing_training_history: string | null;
  goals: string | null;
  perceived_strengths: string | null;
  perceived_weaknesses: string | null;
  training_facilities: string | null;
  training_time_per_week: string | null;
  preferred_disciplines: string[] | null;
  hardest_sport_redpoint: string | null;
  hardest_sport_in_a_day: string | null;
  hardest_sport_onsight: string | null;
  hardest_boulder_redpoint: string | null;
  hardest_boulder_flash: string | null;
  hardest_boulder_in_a_day: string | null;
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

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const fmtAmount = (pence: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(pence / 100);

function FormField({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div>
      <p className="font-body text-xs font-semibold uppercase tracking-wider text-white/40 mb-1">{label}</p>
      <p className="font-body text-sm text-white/80 leading-relaxed">{value}</p>
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
    accent === "red" ? "hsl(0 70% 65%)" :
    "hsl(var(--golden))";
  const accentBg =
    accent === "green" ? "hsl(142 60% 40% / 0.12)" :
    accent === "amber" ? "hsl(38 95% 55% / 0.1)" :
    accent === "red" ? "hsl(0 70% 55% / 0.1)" :
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

// ── Plan constants ────────────────────────────────────────────────────────────

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
    description: "Choose your coaching plan and secure your spot.",
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

// ── TIMEZONES ─────────────────────────────────────────────────────────────────

const COMMON_TIMEZONES = [
  "Europe/London",
  "Europe/Dublin",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Madrid",
  "Europe/Rome",
  "Europe/Amsterdam",
  "Europe/Zurich",
  "Europe/Stockholm",
  "Europe/Oslo",
  "Europe/Helsinki",
  "Europe/Warsaw",
  "Europe/Prague",
  "Europe/Lisbon",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Vancouver",
  "America/Toronto",
  "America/Halifax",
  "America/Anchorage",
  "America/Honolulu",
  "America/Sao_Paulo",
  "America/Buenos_Aires",
  "America/Mexico_City",
  "Asia/Dubai",
  "Asia/Karachi",
  "Asia/Kolkata",
  "Asia/Dhaka",
  "Asia/Bangkok",
  "Asia/Singapore",
  "Asia/Hong_Kong",
  "Asia/Tokyo",
  "Asia/Seoul",
  "Asia/Shanghai",
  "Australia/Sydney",
  "Australia/Melbourne",
  "Australia/Perth",
  "Pacific/Auckland",
  "Pacific/Fiji",
  "Africa/Johannesburg",
  "Africa/Cairo",
  "Africa/Lagos",
];

// ── Main component ────────────────────────────────────────────────────────────

export default function ConsultationNext() {
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<Submission | null | "loading">("loading");
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [activeTab, setActiveTab] = useState<PortalTab>("steps");

  // Onboarding step state
  const [selectedPlan, setSelectedPlan] = useState<Plan>("kaizen_plan");
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState("");

  // Billing state
  const [billing, setBilling] = useState<BillingData | null>(null);
  const [billingLoading, setBillingLoading] = useState(false);

  // Settings state
  const [timezone, setTimezone] = useState("Europe/London");
  const [newEmail, setNewEmail] = useState("");
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailMsg, setEmailMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [tzSaving, setTzSaving] = useState(false);
  const [tzMsg, setTzMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // ── Initial load ──────────────────────────────────────────────────────────

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/consultation/auth"); return; }
      setUserEmail(user.email ?? "");
      setUserId(user.id);
      setNewEmail(user.email ?? "");

      // Load submission
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: sub } = await (supabase as any)
        .from("consultation_submissions")
        .select("*")
        .eq("user_id", user.id)
        .order("submitted_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      setSubmission(sub ?? null);

      // Load preferences
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: prefs } = await (supabase as any)
        .from("user_preferences")
        .select("timezone")
        .eq("user_id", user.id)
        .maybeSingle();
      if (prefs?.timezone) setTimezone(prefs.timezone);
    })();
  }, [navigate]);

  const stage: Stage = submission === "loading" || !submission
    ? "not_started"
    : (submission as Submission).onboarding_stage as Stage;

  const isBooked = stage === "booked";

  // Default to "plan" tab for booked clients, "steps" otherwise
  useEffect(() => {
    if (submission !== "loading") {
      setActiveTab(isBooked ? "plan" : "steps");
    }
  }, [isBooked, submission]);

  // ── Billing fetch ─────────────────────────────────────────────────────────

  const fetchBilling = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    if (activeTab === "plan" && !billing) fetchBilling();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, billing]);

  // ── Settings handlers ─────────────────────────────────────────────────────

  const handleEmailChange = async () => {
    if (!newEmail || newEmail === userEmail) return;
    setEmailSaving(true);
    setEmailMsg(null);
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) {
      setEmailMsg({ type: "err", text: error.message });
    } else {
      setEmailMsg({ type: "ok", text: "Confirmation sent to both addresses. Check your inbox." });
    }
    setEmailSaving(false);
  };

  const handleTimezoneChange = async () => {
    setTzSaving(true);
    setTzMsg(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from("user_preferences")
        .upsert({ user_id: userId, timezone }, { onConflict: "user_id" });
      if (error) throw error;
      setTzMsg({ type: "ok", text: "Timezone saved." });
    } catch (e: unknown) {
      setTzMsg({ type: "err", text: e instanceof Error ? e.message : "Failed to save." });
    }
    setTzSaving(false);
  };

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

  // ── Loading state ─────────────────────────────────────────────────────────

  if (submission === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "hsl(var(--charcoal))" }}>
        <Loader2 size={28} className="animate-spin" style={{ color: "hsl(var(--golden))" }} />
      </main>
    );
  }

  const firstName = submission ? (submission as Submission).first_name : null;
  const greeting = firstName
    ? firstName.toUpperCase()
    : userEmail ? userEmail.split("@")[0].toUpperCase() : "THERE";

  const hasSubmission = submission !== null;

  // ── Tabs config ───────────────────────────────────────────────────────────

  const TABS: { id: PortalTab; label: string; icon: React.ReactNode }[] = [
    ...(isBooked ? [{ id: "plan" as PortalTab, label: "My Plan", icon: <CreditCard size={13} /> }] : []),
    { id: "steps", label: "Onboarding", icon: <ListChecks size={13} /> },
    ...(hasSubmission ? [{ id: "form" as PortalTab, label: "My Form", icon: <ClipboardList size={13} /> }] : []),
    { id: "settings", label: "Settings", icon: <Settings size={13} /> },
  ];

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen" style={{ backgroundColor: "hsl(var(--charcoal))" }}>

      {/* Top bar */}
      <header
        className="sticky top-0 z-10 border-b px-6 py-4 flex items-center justify-between"
        style={{ backgroundColor: "hsl(var(--golden-dark))", borderColor: "hsl(var(--golden-deep))" }}
      >
        <div className="flex items-center gap-3">
          <span className="font-display text-xl tracking-wider" style={{ color: "hsl(var(--golden))" }}>KAIZEN</span>
          <span className="font-body text-xs text-white/40 uppercase tracking-widest hidden sm:block">Portal</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-body text-xs text-white/40 hidden sm:block">{userEmail}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 font-body text-xs font-semibold uppercase tracking-wider transition-colors"
            style={{ color: "hsl(var(--golden))" }}
          >
            <LogOut size={13} />
            Sign out
          </button>
        </div>
      </header>

      {/* Greeting */}
      <div className="px-6 pt-10 pb-0 max-w-2xl mx-auto text-center">
        <h1 className="font-display text-5xl sm:text-6xl leading-none mb-3" style={{ color: "hsl(var(--golden))" }}>
          HEY, {greeting}
        </h1>
        <div className="w-16 h-0.5 mx-auto mt-4" style={{ backgroundColor: "hsl(var(--golden))" }} />
      </div>

      {/* Tab bar */}
      <div
        className="sticky top-[65px] z-10 border-b mt-6"
        style={{ backgroundColor: "hsl(var(--golden-dark))", borderColor: "hsl(var(--golden-deep))" }}
      >
        <div className="max-w-2xl mx-auto px-6 flex gap-0 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-widest px-5 py-4 transition-colors duration-150 border-b-2 whitespace-nowrap"
              style={{
                color: activeTab === tab.id ? "hsl(var(--golden))" : "rgba(255,255,255,0.4)",
                borderColor: activeTab === tab.id ? "hsl(var(--golden))" : "transparent",
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* ── MY PLAN TAB ── */}
        {activeTab === "plan" && (
          <PlanTab
            billing={billing}
            loading={billingLoading}
            onRefresh={fetchBilling}
          />
        )}

        {/* ── ONBOARDING STEPS TAB ── */}
        {activeTab === "steps" && (
          <StepsTab
            stage={stage}
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
            payLoading={payLoading}
            payError={payError}
            handlePay={handlePay}
            planStartDate={billing?.planStartDate ?? null}
          />
        )}

        {/* ── MY FORM TAB ── */}
        {activeTab === "form" && hasSubmission && (
          <FormTab submission={submission as Submission} />
        )}

        {/* ── SETTINGS TAB ── */}
        {activeTab === "settings" && (
          <SettingsTab
            userEmail={userEmail}
            newEmail={newEmail}
            setNewEmail={setNewEmail}
            emailSaving={emailSaving}
            emailMsg={emailMsg}
            handleEmailChange={handleEmailChange}
            timezone={timezone}
            setTimezone={setTimezone}
            tzSaving={tzSaving}
            tzMsg={tzMsg}
            handleTimezoneChange={handleTimezoneChange}
          />
        )}
      </div>
    </main>
  );
}

// ── MY PLAN tab ───────────────────────────────────────────────────────────────

function PlanTab({
  billing,
  loading,
  onRefresh,
}: {
  billing: BillingData | null;
  loading: boolean;
  onRefresh: () => void;
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
      <div className="text-center py-16">
        <p className="font-body text-sm text-white/50 mb-4">
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
      {/* Plan header */}
      <div
        className="p-6 border"
        style={{ backgroundColor: "hsl(var(--golden) / 0.06)", borderColor: "hsl(var(--golden) / 0.25)" }}
      >
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div>
            <p className="font-mono text-xs tracking-[0.25em] mb-1" style={{ color: "hsl(var(--golden) / 0.5)" }}>YOUR PLAN</p>
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
            className="px-3 py-2 text-sm font-body mt-2"
            style={{ backgroundColor: "hsl(0 70% 55% / 0.12)", border: "1px solid hsl(0 70% 55% / 0.35)", color: "hsl(0 70% 70%)" }}
          >
            ⚠ Cancellation pending — active until {fmtDate(billing.currentPeriodEnd)}
          </div>
        )}
      </div>

      {/* Timeline grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BillingTile
          icon={<CreditCard size={15} />}
          label="First Payment"
          value={billing.firstPaymentDate ? fmtDate(billing.firstPaymentDate) : "—"}
          sub="When your plan began"
        />
        <BillingTile
          icon={<CalendarDays size={15} />}
          label="Current Cycle"
          value={`${fmtDate(billing.currentPeriodStart)} → ${fmtDate(billing.currentPeriodEnd)}`}
          sub={`Next charge: ${fmtDate(billing.currentPeriodEnd)}`}
        />
        <BillingTile
          icon={<CheckCircle2 size={15} />}
          label="12-Week Commitment"
          value={fmtDate(billing.commitmentEndDate)}
          sub={pastCommitment ? "✓ Minimum commitment met" : `${daysUntilCommitment} day${daysUntilCommitment !== 1 ? "s" : ""} remaining`}
          accent={pastCommitment ? "green" : undefined}
        />
        <BillingTile
          icon={<AlertTriangle size={15} />}
          label="Cancellation Notice Deadline"
          value={fmtDate(billing.noticeDeadlineDate)}
          sub={
            noticePast ? "Window passed — next cycle will bill" :
            daysUntilNotice === 0 ? "Today is the last day to cancel" :
            `${daysUntilNotice} day${daysUntilNotice !== 1 ? "s" : ""} to give notice`
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
          <p className="font-body text-xs font-semibold uppercase tracking-wider text-white/40">Upcoming Payment Dates</p>
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

      <div className="flex justify-end">
        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 font-body text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          <RefreshCw size={11} />
          Refresh billing data
        </button>
      </div>
    </div>
  );
}

// ── ONBOARDING STEPS tab ──────────────────────────────────────────────────────

function StepsTab({
  stage,
  selectedPlan,
  setSelectedPlan,
  payLoading,
  payError,
  handlePay,
  planStartDate,
}: {
  stage: Stage;
  selectedPlan: Plan;
  setSelectedPlan: (p: Plan) => void;
  payLoading: boolean;
  payError: string;
  handlePay: () => void;
  planStartDate: string | null;
}) {
  const allDone = stage === "booked";

  return (
    <div>
      {allDone && (
        <div
          className="p-5 mb-8 border"
          style={{ backgroundColor: "hsl(var(--golden) / 0.06)", borderColor: "hsl(var(--golden) / 0.3)" }}
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" style={{ color: "hsl(142 60% 65%)" }} />
            <div>
              <p className="font-display text-lg leading-none mb-2" style={{ color: "hsl(var(--golden))" }}>
                ONBOARDING COMPLETE
              </p>
              <p className="font-body text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                All steps are done — you're now waiting for your introductory call with Mackenzie.
                {planStartDate && (
                  <span> Your coaching officially began on <span style={{ color: "hsl(var(--golden))" }}>{fmtDate(planStartDate)}</span>.</span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

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
              <div
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mt-1"
                style={{
                  backgroundColor: isDone ? "hsl(var(--golden))" : isCurrent ? "hsl(var(--golden) / 0.15)" : "hsl(var(--golden) / 0.06)",
                  border: `1.5px solid ${isDone ? "hsl(var(--golden))" : isCurrent ? "hsl(var(--golden) / 0.5)" : "hsl(var(--golden) / 0.2)"}`,
                }}
              >
                <Icon size={16} style={{ color: isDone ? "hsl(var(--charcoal))" : isCurrent ? "hsl(var(--golden))" : "hsl(var(--golden) / 0.3)" }} />
              </div>
              <div className="pb-12 flex-1">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="font-mono text-xs" style={{ color: isDone ? "hsl(var(--golden))" : isCurrent ? "hsl(var(--golden) / 0.7)" : "hsl(var(--golden) / 0.25)" }}>
                    {step.number}
                  </span>
                  <h3 className="font-display text-xl leading-none" style={{ color: isDone ? "hsl(var(--golden))" : isCurrent ? "white" : "hsl(255 255 255 / 0.3)" }}>
                    {step.title}
                    {isDone && <span className="ml-3 font-mono text-xs normal-case tracking-normal" style={{ color: "hsl(var(--golden) / 0.6)" }}>✓ complete</span>}
                  </h3>
                </div>
                <p className="font-body text-sm leading-relaxed mb-4" style={{ color: isLocked ? "hsl(255 255 255 / 0.25)" : "hsl(255 255 255 / 0.55)" }}>
                  {step.description}
                </p>

                {isPaymentStep && isCurrent && (
                  <div className="space-y-3">
                    {PLAN_OPTIONS.map((plan) => {
                      const active = selectedPlan === plan.id;
                      return (
                        <button key={plan.id} type="button" onClick={() => setSelectedPlan(plan.id)}
                          className="w-full text-left p-4 transition-all duration-150"
                          style={{ backgroundColor: active ? "hsl(var(--golden) / 0.08)" : "hsl(var(--golden) / 0.03)", border: `1.5px solid ${active ? "hsl(var(--golden) / 0.6)" : "hsl(var(--golden) / 0.15)"}` }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <div className="w-3.5 h-3.5 rounded-full flex-shrink-0 mt-0.5 border-2 flex items-center justify-center" style={{ borderColor: active ? "hsl(var(--golden))" : "hsl(var(--golden) / 0.3)" }}>
                                {active && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "hsl(var(--golden))" }} />}
                              </div>
                              <div>
                                <p className="font-display text-sm leading-none mb-1" style={{ color: active ? "hsl(var(--golden))" : "hsl(255 255 255 / 0.7)" }}>{plan.name}</p>
                                <p className="font-body text-xs leading-relaxed" style={{ color: "hsl(255 255 255 / 0.45)" }}>{plan.description}</p>
                                {plan.notice && <p className="font-body text-xs leading-relaxed mt-2 pt-2" style={{ color: "hsl(var(--golden) / 0.55)", borderTop: "1px solid hsl(var(--golden) / 0.12)" }}>{plan.notice}</p>}
                              </div>
                            </div>
                            <span className="font-mono text-xs flex-shrink-0 pt-0.5" style={{ color: active ? "hsl(var(--golden))" : "hsl(255 255 255 / 0.4)" }}>{plan.price}</span>
                          </div>
                        </button>
                      );
                    })}
                    {payError && <p className="font-body text-xs text-red-400">{payError}</p>}
                    <button onClick={handlePay} disabled={payLoading}
                      className="inline-flex items-center gap-2 font-display text-sm tracking-wider px-5 py-2.5 transition-all duration-150 disabled:opacity-60"
                      style={{ backgroundColor: "hsl(var(--golden))", color: "hsl(var(--charcoal))" }}
                    >
                      {payLoading ? <Loader2 size={14} className="animate-spin" /> : <ChevronRight size={14} />}
                      {payLoading ? "REDIRECTING…" : "PAY NOW"}
                    </button>
                  </div>
                )}

                {!isPaymentStep && step.cta && isCurrent && (
                  <Link to={step.cta.href}
                    className="inline-flex items-center gap-2 font-display text-sm tracking-wider px-5 py-2.5 transition-all duration-150"
                    style={{ backgroundColor: "hsl(var(--golden))", color: "hsl(var(--charcoal))" }}
                  >
                    {step.cta.label}
                    <ArrowRight size={14} />
                  </Link>
                )}

                {step.cta && isLocked && (
                  <div className="inline-flex items-center gap-2 font-display text-sm tracking-wider px-5 py-2.5 cursor-not-allowed select-none"
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
    </div>
  );
}

// ── MY FORM tab ───────────────────────────────────────────────────────────────

function FormTab({ submission }: { submission: Submission }) {
  const groups = [
    {
      heading: "Personal Details",
      fields: [
        { label: "Name", value: `${submission.first_name} ${submission.last_name}` },
        { label: "Email", value: submission.email },
        { label: "Phone", value: submission.phone },
        { label: "Location", value: submission.location },
        { label: "Occupation", value: submission.occupation },
      ],
    },
    {
      heading: "Climbing Background",
      fields: [
        { label: "Years Climbing", value: submission.years_climbing },
        { label: "Training Time per Week", value: submission.training_time_per_week },
        { label: "Training Facilities", value: submission.training_facilities },
        {
          label: "Preferred Disciplines",
          value: submission.preferred_disciplines?.join(", ") ?? null,
        },
        { label: "Currently Injured", value: submission.currently_injured != null ? (submission.currently_injured ? "Yes" : "No") : null },
      ],
    },
    {
      heading: "Performance",
      fields: [
        { label: "Sport Redpoint", value: submission.hardest_sport_redpoint },
        { label: "Sport in a Day", value: submission.hardest_sport_in_a_day },
        { label: "Sport Onsight", value: submission.hardest_sport_onsight },
        { label: "Boulder Redpoint", value: submission.hardest_boulder_redpoint },
        { label: "Boulder Flash", value: submission.hardest_boulder_flash },
        { label: "Boulder in a Day", value: submission.hardest_boulder_in_a_day },
      ],
    },
    {
      heading: "Goals & History",
      fields: [
        { label: "Goals", value: submission.goals },
        { label: "Perceived Strengths", value: submission.perceived_strengths },
        { label: "Perceived Weaknesses", value: submission.perceived_weaknesses },
        { label: "Injury History", value: submission.injury_history },
        { label: "Climbing & Training History", value: submission.climbing_training_history },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <p className="font-body text-sm text-white/40">
        Your consultation form submission — as received by Buster.
      </p>
      {groups.map((group) => {
        const hasValues = group.fields.some((f) => f.value);
        if (!hasValues) return null;
        return (
          <div key={group.heading}>
            <p className="font-display text-base tracking-wider mb-4" style={{ color: "hsl(var(--golden))" }}>
              {group.heading.toUpperCase()}
            </p>
            <div
              className="border divide-y"
              style={{ borderColor: "hsl(var(--golden) / 0.15)", backgroundColor: "hsl(var(--golden) / 0.04)" }}
            >
              {group.fields.map((f) =>
                f.value ? (
                  <div key={f.label} className="px-5 py-4" style={{ borderColor: "hsl(var(--golden) / 0.1)" }}>
                    <FormField label={f.label} value={f.value} />
                  </div>
                ) : null
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── SETTINGS tab ──────────────────────────────────────────────────────────────

function SettingsTab({
  userEmail,
  newEmail,
  setNewEmail,
  emailSaving,
  emailMsg,
  handleEmailChange,
  timezone,
  setTimezone,
  tzSaving,
  tzMsg,
  handleTimezoneChange,
}: {
  userEmail: string;
  newEmail: string;
  setNewEmail: (v: string) => void;
  emailSaving: boolean;
  emailMsg: { type: "ok" | "err"; text: string } | null;
  handleEmailChange: () => void;
  timezone: string;
  setTimezone: (v: string) => void;
  tzSaving: boolean;
  tzMsg: { type: "ok" | "err"; text: string } | null;
  handleTimezoneChange: () => void;
}) {
  const inputCls = "w-full px-4 py-3 font-body text-sm outline-none border bg-black/20 text-white placeholder-white/30 focus:ring-1";

  return (
    <div className="space-y-8 max-w-md">

      {/* Email */}
      <div
        className="border p-6"
        style={{ borderColor: "hsl(var(--golden) / 0.15)", backgroundColor: "hsl(var(--golden) / 0.04)" }}
      >
        <div className="flex items-center gap-2 mb-5">
          <Mail size={15} style={{ color: "hsl(var(--golden))" }} />
          <p className="font-display text-base tracking-wider" style={{ color: "hsl(var(--golden))" }}>EMAIL ADDRESS</p>
        </div>
        <p className="font-body text-xs text-white/40 mb-4">
          Current: <span className="text-white/60">{userEmail}</span>
        </p>
        <label className="font-body text-xs font-semibold uppercase tracking-wider text-white/40 block mb-2">
          New email address
        </label>
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className={inputCls}
          style={{ borderColor: "hsl(var(--golden) / 0.2)" }}
          placeholder="new@email.com"
        />
        {emailMsg && (
          <p className={`font-body text-xs mt-2 ${emailMsg.type === "ok" ? "text-green-400" : "text-red-400"}`}>
            {emailMsg.text}
          </p>
        )}
        <button
          onClick={handleEmailChange}
          disabled={emailSaving || newEmail === userEmail || !newEmail}
          className="mt-4 inline-flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-wider px-4 py-2.5 transition-all disabled:opacity-40"
          style={{ backgroundColor: "hsl(var(--golden))", color: "hsl(var(--charcoal))" }}
        >
          {emailSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
          {emailSaving ? "Saving…" : "Update Email"}
        </button>
      </div>

      {/* Timezone */}
      <div
        className="border p-6"
        style={{ borderColor: "hsl(var(--golden) / 0.15)", backgroundColor: "hsl(var(--golden) / 0.04)" }}
      >
        <div className="flex items-center gap-2 mb-5">
          <Globe size={15} style={{ color: "hsl(var(--golden))" }} />
          <p className="font-display text-base tracking-wider" style={{ color: "hsl(var(--golden))" }}>TIMEZONE</p>
        </div>
        <p className="font-body text-xs text-white/40 mb-4">
          Used to display your schedule and booking times correctly.
        </p>
        <label className="font-body text-xs font-semibold uppercase tracking-wider text-white/40 block mb-2">
          Select timezone
        </label>
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className={inputCls}
          style={{ borderColor: "hsl(var(--golden) / 0.2)" }}
        >
          {COMMON_TIMEZONES.map((tz) => (
            <option key={tz} value={tz} style={{ backgroundColor: "#1a1a1a" }}>
              {tz.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        {tzMsg && (
          <p className={`font-body text-xs mt-2 ${tzMsg.type === "ok" ? "text-green-400" : "text-red-400"}`}>
            {tzMsg.text}
          </p>
        )}
        <button
          onClick={handleTimezoneChange}
          disabled={tzSaving}
          className="mt-4 inline-flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-wider px-4 py-2.5 transition-all disabled:opacity-40"
          style={{ backgroundColor: "hsl(var(--golden))", color: "hsl(var(--charcoal))" }}
        >
          {tzSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
          {tzSaving ? "Saving…" : "Save Timezone"}
        </button>
      </div>

      {/* Contact */}
      <p className="font-body text-xs text-white/30">
        Need other changes?{" "}
        <a href="mailto:Info@kaizenclimbing.co.uk" className="underline underline-offset-4" style={{ color: "hsl(var(--golden) / 0.5)" }}>
          Email Buster
        </a>
      </p>
    </div>
  );
}
