import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  LogOut,
  Mail,
  Calendar,
  Tag,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Users,
  BarChart3,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Clock,
  CreditCard,
} from "lucide-react";

type Stage = "submitted" | "reviewed" | "paid" | "booked";

const STAGES: Stage[] = ["submitted", "reviewed", "paid", "booked"];
const STAGE_LABELS: Record<Stage, string> = {
  submitted: "SUBMITTED",
  reviewed: "UNDER REVIEW",
  paid: "PAYMENT",
  booked: "BOOKED",
};
const NEXT_STAGE: Record<Stage, Stage | null> = {
  submitted: "reviewed",
  reviewed: "paid",
  paid: "booked",
  booked: null,
};

type ContactSubmission = {
  type: "contact";
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  message: string | null;
  interests: string[] | null;
  submitted_at: string;
};

type ConsultationSubmission = {
  type: "consultation";
  id: string;
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
  submitted_at: string;
  onboarding_stage: Stage;
};

type Submission = ContactSubmission | ConsultationSubmission;

type AnalyticsData = {
  enquiries: { thisMonth: number; lastMonth: number };
  newClients: { thisMonth: number; lastMonth: number };
  revenue: { thisMonth: number; lastMonth: number };
  predictedMonthlyRevenue: number;
  activeSubscriptions: number;
  stageBreakdown: Record<string, number>;
};

type ClientBillingData = {
  subscriptionId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
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
  status: string;
  cancelAtPeriodEnd: boolean;
};

// ── Email templates (read-only copies) ─────────────────────────────────────

const EMAIL_TEMPLATES = [
  {
    id: "contact-confirmation",
    name: "Contact Form Confirmation",
    description: "Sent to someone who submits the contact form.",
    subject: "We've received your enquiry — Kaizen Climbing Coaching",
    preview: `Hey [First Name], thanks for your enquiry. We've received it and will be in touch shortly.

[If interests provided]
You expressed interest in: [interests list]

In the meantime, if you'd like to start the process, you can fill out a form so I can get to know a little more about you and your climbing — or see more details about the training.

→ Fill out the form: kaizenclimbing.com/consultation
→ See training details: kaizenclimbing.com/plans

Questions? Reply to this email or contact us at admin@kaizenclimbing.co.uk`,
  },
  {
    id: "consultation-confirmation",
    name: "Consultation Form Confirmation",
    description: "Sent to a client after they complete the consultation form.",
    subject: "Thanks for your consultation form — Kaizen Climbing Coaching",
    preview: `Hey [First Name], thanks for submitting your consultation form.

We've received everything and will review your details shortly. The next step is to discuss your goals and put together a plan that works for you.

We'll be in touch soon to set up a call or get started.

Buster
Kaizen Climbing Coaching

admin@kaizenclimbing.co.uk`,
  },
  {
    id: "admin-notification",
    name: "Admin New Submission Notification",
    description: "Sent internally to admin@kaizenclimbing.co.uk when a new consultation is submitted.",
    subject: "New consultation submission — [First Name Last Name]",
    preview: `A new consultation form has been submitted.

Name: [First Name] [Last Name]
Email: [email]
Location: [location]
Years climbing: [years]
Stage: Submitted

Log in to the admin dashboard to review the full submission and advance their pipeline stage.

→ kaizenclimbing.com/admin`,
  },
  {
    id: "signup-verification",
    name: "Sign-up Email Verification",
    description: "Sent by the auth system when a new user registers. Asks them to confirm their email.",
    subject: "Confirm your email for Kaizen Climbing Coaching",
    preview: `Thanks for signing up for Kaizen Climbing Coaching!

Please confirm your email address by clicking the button in this email:

→ [Verify Email] button linking to the confirmation URL

If you didn't create an account, you can safely ignore this email.`,
  },
  {
    id: "password-reset",
    name: "Password Reset",
    description: "Sent when a user requests to reset their password.",
    subject: "Reset your password for Kaizen Climbing Coaching",
    preview: `We received a request to reset your password for Kaizen Climbing Coaching. Click the button below to choose a new password.

→ [Reset Password] button linking to the reset URL

If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.`,
  },
  {
    id: "magic-link",
    name: "Magic Link / OTP Login",
    description: "Sent when a user requests a magic link to log in without a password.",
    subject: "Your login link for Kaizen Climbing Coaching",
    preview: `Click the button below to log in to Kaizen Climbing Coaching. This link will expire shortly.

→ [Log In] button linking to the confirmation URL

If you didn't request this link, you can safely ignore this email.`,
  },
  {
    id: "reauthentication",
    name: "Reauthentication Code",
    description: "Sent when a logged-in user needs to verify their identity again (e.g. before sensitive actions).",
    subject: "Your verification code — Kaizen Climbing Coaching",
    preview: `Use the code below to confirm your identity:

[6-digit code]

This code will expire shortly. If you didn't request this, you can safely ignore this email.`,
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

const Field = ({ label, value }: { label: string; value: string | null | undefined }) => {
  if (!value) return null;
  return (
    <div>
      <p className="font-body text-xs font-semibold uppercase tracking-wider opacity-50 mb-0.5" style={{ color: "white" }}>
        {label}
      </p>
      <p className="font-body text-sm text-white leading-relaxed">{value}</p>
    </div>
  );
};

const STAGE_COLOURS: Record<Stage, { bg: string; text: string }> = {
  submitted: { bg: "hsl(var(--golden) / 0.15)", text: "hsl(var(--golden) / 0.9)" },
  reviewed:  { bg: "hsl(220 80% 60% / 0.2)",    text: "hsl(220 80% 75%)" },
  paid:      { bg: "hsl(142 60% 40% / 0.2)",    text: "hsl(142 60% 65%)" },
  booked:    { bg: "hsl(var(--golden))",         text: "hsl(var(--charcoal))" },
};

const fmt = (pence: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(pence / 100);

const Trend = ({ current, previous, unit = "" }: { current: number; previous: number; unit?: string }) => {
  if (previous === 0) return null;
  const diff = current - previous;
  const pct = Math.round((diff / previous) * 100);
  const up = diff >= 0;
  return (
    <span
      className="flex items-center gap-0.5 font-body text-xs font-semibold"
      style={{ color: up ? "hsl(142 60% 65%)" : "hsl(0 70% 65%)" }}
    >
      {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {up ? "+" : ""}{pct}% vs last month
    </span>
  );
};

const StatCard = ({
  label,
  value,
  sub,
  trend,
}: {
  label: string;
  value: string;
  sub?: string;
  trend?: React.ReactNode;
}) => (
  <div
    className="p-5 border flex flex-col gap-2"
    style={{ backgroundColor: "hsl(var(--golden-dark))", borderColor: "hsl(var(--golden-deep))" }}
  >
    <p className="font-body text-xs font-semibold uppercase tracking-widest opacity-50 text-white">{label}</p>
    <p className="font-display text-4xl tracking-wider" style={{ color: "hsl(var(--golden))" }}>
      {value}
    </p>
    {sub && <p className="font-body text-xs text-white/40">{sub}</p>}
    {trend}
  </div>
);

// ── Main component ───────────────────────────────────────────────────────────

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<"all" | "contact" | "consultation">("all");
  const [activeTab, setActiveTab] = useState<"enquiries" | "pipeline" | "analytics" | "templates">("enquiries");
  const [advancingId, setAdvancingId] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setAdminEmail(user.email ?? "");
    });
    fetchSubmissions();
  }, []);

  const fetchAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const resp = await supabase.functions.invoke("admin-analytics", {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (resp.data) setAnalytics(resp.data as AnalyticsData);
    } catch (e) {
      console.error(e);
    }
    setAnalyticsLoading(false);
  }, []);

  useEffect(() => {
    if (activeTab === "analytics" && !analytics) fetchAnalytics();
  }, [activeTab, analytics, fetchAnalytics]);

  const fetchSubmissions = async () => {
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [{ data: contacts }, { data: consultations }] = await Promise.all([
      (supabase as any).from("contact_submissions").select("*").order("submitted_at", { ascending: false }),
      (supabase as any).from("consultation_submissions").select("*").order("submitted_at", { ascending: false }),
    ]);

    const merged: Submission[] = [
      ...((contacts ?? []) as ContactSubmission[]).map((s: ContactSubmission) => ({ ...s, type: "contact" as const })),
      ...((consultations ?? []) as ConsultationSubmission[]).map((s: ConsultationSubmission) => ({ ...s, type: "consultation" as const })),
    ].sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());

    setSubmissions(merged);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const advanceStage = async (id: string, currentStage: Stage) => {
    const next = NEXT_STAGE[currentStage];
    if (!next) return;
    setAdvancingId(id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from("consultation_submissions")
      .update({ onboarding_stage: next })
      .eq("id", id);
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === id && s.type === "consultation"
          ? { ...s, onboarding_stage: next }
          : s
      )
    );
    setAdvancingId(null);
  };

  const filtered = submissions.filter((s) => filter === "all" || s.type === filter);
  const consultations = submissions.filter((s): s is ConsultationSubmission => s.type === "consultation");

  const TABS = [
    { id: "enquiries" as const, label: "All Enquiries" },
    { id: "pipeline" as const, label: "Pipeline" },
    { id: "analytics" as const, label: "Analytics" },
    { id: "templates" as const, label: "Email Templates" },
  ];

  return (
    <main className="min-h-screen" style={{ backgroundColor: "hsl(var(--charcoal))" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b"
        style={{ backgroundColor: "hsl(var(--golden-dark))", borderColor: "hsl(var(--golden-deep))" }}
      >
        <div>
          <span className="font-display text-2xl tracking-wider" style={{ color: "hsl(var(--golden))" }}>
            KAIZEN
          </span>
          <span className="font-body text-xs text-white opacity-50 ml-3 uppercase tracking-widest">Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-body text-xs text-white opacity-50 hidden sm:block">{adminEmail}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-wider px-3 py-2 transition-colors duration-200"
            style={{ color: "hsl(var(--golden))" }}
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b" style={{ borderColor: "hsl(var(--golden-deep))", backgroundColor: "hsl(var(--golden-dark))" }}>
        <div className="max-w-6xl mx-auto px-6 flex gap-0 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="font-body text-xs font-semibold uppercase tracking-widest px-6 py-4 transition-colors duration-150 border-b-2 whitespace-nowrap"
              style={{
                color: activeTab === tab.id ? "hsl(var(--golden))" : "rgba(255,255,255,0.4)",
                borderColor: activeTab === tab.id ? "hsl(var(--golden))" : "transparent",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* ── ALL ENQUIRIES TAB ── */}
        {activeTab === "enquiries" && (
          <>
            <div className="flex flex-wrap items-baseline justify-between gap-4 mb-8">
              <h1 className="font-display text-5xl tracking-wider" style={{ color: "hsl(var(--golden))" }}>
                ALL ENQUIRIES
              </h1>
              <div className="flex items-center gap-2">
                {(["all", "contact", "consultation"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className="font-body text-xs font-semibold uppercase tracking-wider px-3 py-1.5 transition-colors duration-150"
                    style={{
                      backgroundColor: filter === f ? "hsl(var(--golden))" : "transparent",
                      color: filter === f ? "hsl(var(--charcoal))" : "hsl(var(--golden))",
                      border: "1px solid hsl(var(--golden))",
                    }}
                  >
                    {f}
                  </button>
                ))}
                <span className="font-body text-sm text-white opacity-40 ml-2">
                  {filtered.length} total
                </span>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-24">
                <div className="w-8 h-8 border-2 animate-spin" style={{ borderColor: "hsl(var(--golden))", borderTopColor: "transparent" }} />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-body text-white opacity-30">No enquiries yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((sub) => {
                  const isOpen = expanded.has(sub.id);
                  const isConsultation = sub.type === "consultation";
                  const c = sub as ConsultationSubmission;

                  return (
                    <div
                      key={sub.id}
                      className="border"
                      style={{ backgroundColor: "hsl(var(--golden-dark))", borderColor: "hsl(var(--golden-deep))" }}
                    >
                      <div className="p-6">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-1 flex-wrap">
                              <p className="font-display text-2xl tracking-wider" style={{ color: "hsl(var(--golden))" }}>
                                {sub.first_name} {sub.last_name}
                              </p>
                              <span
                                className="font-body text-xs font-semibold uppercase tracking-wider px-2 py-0.5"
                                style={{
                                  backgroundColor: isConsultation ? "hsl(var(--golden))" : "hsl(var(--golden-deep))",
                                  color: "hsl(var(--charcoal))",
                                }}
                              >
                                {isConsultation ? "Consultation" : "Contact"}
                              </span>
                              {isConsultation && (
                                <span
                                  className="font-body text-xs font-semibold uppercase tracking-wider px-2 py-0.5"
                                  style={{
                                    backgroundColor: STAGE_COLOURS[c.onboarding_stage].bg,
                                    color: STAGE_COLOURS[c.onboarding_stage].text,
                                    border: `1px solid ${STAGE_COLOURS[c.onboarding_stage].text}`,
                                  }}
                                >
                                  {STAGE_LABELS[c.onboarding_stage]}
                                </span>
                              )}
                            </div>
                            <a
                              href={`mailto:${sub.email}`}
                              className="flex items-center gap-1.5 font-body text-sm text-white opacity-70 hover:opacity-100 transition-opacity"
                            >
                              <Mail size={12} />
                              {sub.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-3 flex-wrap">
                            {/* Reply button */}
                            <a
                              href={`mailto:${sub.email}?subject=Re: Your enquiry — Kaizen Climbing Coaching`}
                              className="flex items-center gap-1.5 font-body text-xs font-semibold uppercase tracking-wider px-3 py-1.5 transition-all duration-150"
                              style={{
                                backgroundColor: "hsl(var(--golden))",
                                color: "hsl(var(--charcoal))",
                              }}
                            >
                              <Mail size={12} />
                              Reply
                            </a>
                            {isConsultation && NEXT_STAGE[c.onboarding_stage] && (
                              <button
                                onClick={() => advanceStage(c.id, c.onboarding_stage)}
                                disabled={advancingId === c.id}
                                className="flex items-center gap-1.5 font-body text-xs font-semibold uppercase tracking-wider px-3 py-1.5 transition-all duration-150 disabled:opacity-50"
                                style={{
                                  border: "1px solid hsl(var(--golden) / 0.5)",
                                  color: "hsl(var(--golden))",
                                }}
                              >
                                {advancingId === c.id ? "..." : `→ ${STAGE_LABELS[NEXT_STAGE[c.onboarding_stage]!]}`}
                              </button>
                            )}
                            <div className="flex items-center gap-1.5 font-body text-xs text-white opacity-50">
                              <Calendar size={12} />
                              {formatDate(sub.submitted_at)}
                            </div>
                          </div>
                        </div>

                        {!isConsultation && (
                          <>
                            {(sub as ContactSubmission).interests && (sub as ContactSubmission).interests!.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {(sub as ContactSubmission).interests!.map((interest) => (
                                  <span
                                    key={interest}
                                    className="flex items-center gap-1 font-body text-xs font-semibold uppercase tracking-wider px-2.5 py-1"
                                    style={{ backgroundColor: "hsl(var(--golden))", color: "hsl(var(--charcoal))" }}
                                  >
                                    <Tag size={10} />
                                    {interest}
                                  </span>
                                ))}
                              </div>
                            )}
                            {(sub as ContactSubmission).message && (
                              <p
                                className="font-body text-sm text-white opacity-70 leading-relaxed border-t pt-4"
                                style={{ borderColor: "hsl(var(--golden-deep))" }}
                              >
                                "{(sub as ContactSubmission).message}"
                              </p>
                            )}
                          </>
                        )}

                        {isConsultation && (
                          <div className="flex flex-wrap gap-4 text-xs font-body text-white opacity-60 mb-2">
                            {c.location && <span>📍 {c.location}</span>}
                            {c.years_climbing && <span>🧗 {c.years_climbing} years climbing</span>}
                            {c.training_time_per_week && <span>⏱ {c.training_time_per_week}/week</span>}
                            {c.currently_injured && <span className="text-red-400 opacity-100">⚠ Currently injured</span>}
                          </div>
                        )}
                      </div>

                      {isConsultation && (
                        <>
                          <button
                            onClick={() => toggleExpand(sub.id)}
                            className="w-full flex items-center justify-center gap-2 py-3 font-body text-xs font-semibold uppercase tracking-wider border-t transition-colors duration-150"
                            style={{ borderColor: "hsl(var(--golden-deep))", color: "hsl(var(--golden))" }}
                          >
                            {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            {isOpen ? "Hide details" : "View all fields"}
                          </button>

                          {isOpen && (
                            <div
                              className="px-6 pb-6 pt-4 border-t grid grid-cols-1 sm:grid-cols-2 gap-5"
                              style={{ borderColor: "hsl(var(--golden-deep))" }}
                            >
                              <Field label="Phone" value={c.phone} />
                              <Field label="Location" value={c.location} />
                              <Field label="Occupation" value={c.occupation} />
                              <Field label="Years Climbing" value={c.years_climbing} />
                              <Field label="Currently Injured" value={c.currently_injured != null ? (c.currently_injured ? "Yes" : "No") : null} />
                              <Field label="Training Time per Week" value={c.training_time_per_week} />
                              <Field label="Training Facilities" value={c.training_facilities} />
                              {c.preferred_disciplines && c.preferred_disciplines.length > 0 && (
                                <div>
                                  <p className="font-body text-xs font-semibold uppercase tracking-wider opacity-50 mb-1 text-white">Preferred Disciplines</p>
                                  <div className="flex flex-wrap gap-2">
                                    {c.preferred_disciplines.map((d) => (
                                      <span key={d} className="font-body text-xs px-2 py-0.5 font-semibold uppercase tracking-wider" style={{ backgroundColor: "hsl(var(--golden))", color: "hsl(var(--charcoal))" }}>{d}</span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              <div className="sm:col-span-2 border-t pt-4" style={{ borderColor: "hsl(var(--golden-deep))" }}>
                                <p className="font-body text-xs font-semibold uppercase tracking-wider opacity-50 mb-3 text-white">Performance</p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                  <Field label="Sport Redpoint" value={c.hardest_sport_redpoint} />
                                  <Field label="Sport in a Day" value={c.hardest_sport_in_a_day} />
                                  <Field label="Sport Onsight" value={c.hardest_sport_onsight} />
                                  <Field label="Boulder Redpoint" value={c.hardest_boulder_redpoint} />
                                  <Field label="Boulder Flash" value={c.hardest_boulder_flash} />
                                  <Field label="Boulder in a Day" value={c.hardest_boulder_in_a_day} />
                                </div>
                              </div>
                              <div className="sm:col-span-2 space-y-4 border-t pt-4" style={{ borderColor: "hsl(var(--golden-deep))" }}>
                                <Field label="Goals" value={c.goals} />
                                <Field label="Perceived Strengths" value={c.perceived_strengths} />
                                <Field label="Perceived Weaknesses" value={c.perceived_weaknesses} />
                                <Field label="Injury History" value={c.injury_history} />
                                <Field label="Climbing & Training History" value={c.climbing_training_history} />
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── PIPELINE TAB ── */}
        {activeTab === "pipeline" && (
          <>
            <div className="mb-8">
              <h1 className="font-display text-5xl tracking-wider" style={{ color: "hsl(var(--golden))" }}>
                PIPELINE
              </h1>
              <p className="font-body text-sm text-white/40 mt-2">
                {consultations.length} consultation{consultations.length !== 1 ? "s" : ""} in progress
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-24">
                <div className="w-8 h-8 border-2 animate-spin" style={{ borderColor: "hsl(var(--golden))", borderTopColor: "transparent" }} />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {STAGES.map((stage) => {
                  const stageClients = consultations.filter((c) => c.onboarding_stage === stage);
                  const colours = STAGE_COLOURS[stage];

                  return (
                    <div key={stage} className="flex flex-col gap-3">
                      <div
                        className="px-3 py-2 flex items-center justify-between"
                        style={{ backgroundColor: colours.bg, border: `1px solid ${colours.text}` }}
                      >
                        <span className="font-display text-xs tracking-widest" style={{ color: colours.text }}>
                          {STAGE_LABELS[stage]}
                        </span>
                        <span className="font-mono text-xs" style={{ color: colours.text }}>
                          {stageClients.length}
                        </span>
                      </div>

                      {stageClients.length === 0 ? (
                        <div
                          className="flex-1 min-h-[80px] flex items-center justify-center border border-dashed"
                          style={{ borderColor: "hsl(var(--golden) / 0.15)" }}
                        >
                          <span className="font-body text-xs text-white/20">—</span>
                        </div>
                      ) : (
                        stageClients.map((client) => (
                          <div
                            key={client.id}
                            className="p-4 border"
                            style={{ backgroundColor: "hsl(var(--golden-dark))", borderColor: "hsl(var(--golden-deep))" }}
                          >
                            <p className="font-display text-base tracking-wide mb-0.5" style={{ color: "hsl(var(--golden))" }}>
                              {client.first_name} {client.last_name}
                            </p>
                            <a
                              href={`mailto:${client.email}`}
                              className="font-body text-xs text-white/50 hover:text-white/80 transition-colors block mb-1 truncate"
                            >
                              {client.email}
                            </a>
                            <p className="font-mono text-xs text-white/30 mb-3">{formatDate(client.submitted_at)}</p>

                            {NEXT_STAGE[client.onboarding_stage] && (
                              <button
                                onClick={() => advanceStage(client.id, client.onboarding_stage)}
                                disabled={advancingId === client.id}
                                className="w-full flex items-center justify-center gap-1.5 font-body text-xs font-semibold uppercase tracking-wider py-1.5 transition-all duration-150 disabled:opacity-50"
                                style={{
                                  border: "1px solid hsl(var(--golden) / 0.4)",
                                  color: "hsl(var(--golden))",
                                }}
                              >
                                {advancingId === client.id ? "..." : (
                                  <>
                                    Move to {STAGE_LABELS[NEXT_STAGE[client.onboarding_stage]!]}
                                    <ArrowRight size={10} />
                                  </>
                                )}
                              </button>
                            )}

                            {!NEXT_STAGE[client.onboarding_stage] && (
                              <div
                                className="w-full text-center font-body text-xs uppercase tracking-wider py-1.5"
                                style={{ color: "hsl(var(--golden) / 0.4)" }}
                              >
                                ✓ Complete
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── ANALYTICS TAB ── */}
        {activeTab === "analytics" && (
          <>
            <div className="flex flex-wrap items-baseline justify-between gap-4 mb-8">
              <h1 className="font-display text-5xl tracking-wider" style={{ color: "hsl(var(--golden))" }}>
                ANALYTICS
              </h1>
              <button
                onClick={fetchAnalytics}
                disabled={analyticsLoading}
                className="font-body text-xs font-semibold uppercase tracking-wider px-4 py-2 transition-colors disabled:opacity-50"
                style={{ border: "1px solid hsl(var(--golden))", color: "hsl(var(--golden))" }}
              >
                {analyticsLoading ? "Loading…" : "↻ Refresh"}
              </button>
            </div>

            {analyticsLoading && !analytics ? (
              <div className="flex justify-center py-24">
                <div className="w-8 h-8 border-2 animate-spin" style={{ borderColor: "hsl(var(--golden))", borderTopColor: "transparent" }} />
              </div>
            ) : analytics ? (
              <div className="space-y-10">
                {/* Stat cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    label="Enquiries this month"
                    value={String(analytics.enquiries.thisMonth)}
                    sub="Contact form submissions"
                    trend={<Trend current={analytics.enquiries.thisMonth} previous={analytics.enquiries.lastMonth} />}
                  />
                  <StatCard
                    label="New clients this month"
                    value={String(analytics.newClients.thisMonth)}
                    sub="Consultation form submissions"
                    trend={<Trend current={analytics.newClients.thisMonth} previous={analytics.newClients.lastMonth} />}
                  />
                  <StatCard
                    label="Revenue this month"
                    value={fmt(analytics.revenue.thisMonth)}
                    sub="Successful Stripe payments"
                    trend={<Trend current={analytics.revenue.thisMonth} previous={analytics.revenue.lastMonth} />}
                  />
                  <StatCard
                    label="Predicted monthly revenue"
                    value={fmt(analytics.predictedMonthlyRevenue)}
                    sub={`${analytics.activeSubscriptions} active subscription${analytics.activeSubscriptions !== 1 ? "s" : ""}`}
                  />
                </div>

                {/* Pipeline breakdown */}
                <div>
                  <p className="font-display text-xl tracking-wider mb-4" style={{ color: "hsl(var(--golden))" }}>
                    PIPELINE BREAKDOWN
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {STAGES.map((stage) => {
                      const count = analytics.stageBreakdown[stage] ?? 0;
                      const total = Object.values(analytics.stageBreakdown).reduce((a, b) => a + b, 0);
                      const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                      const colours = STAGE_COLOURS[stage];
                      return (
                        <div
                          key={stage}
                          className="p-4 border"
                          style={{ backgroundColor: colours.bg, borderColor: colours.text + "40" }}
                        >
                          <p className="font-body text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: colours.text }}>
                            {STAGE_LABELS[stage]}
                          </p>
                          <p className="font-display text-3xl tracking-wider mb-1" style={{ color: colours.text }}>
                            {count}
                          </p>
                          <div className="w-full h-1 rounded-full" style={{ backgroundColor: colours.text + "30" }}>
                            <div className="h-1 rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: colours.text }} />
                          </div>
                          <p className="font-mono text-xs mt-1 opacity-60" style={{ color: colours.text }}>{pct}%</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Last month comparison */}
                <div
                  className="p-6 border"
                  style={{ backgroundColor: "hsl(var(--golden-dark))", borderColor: "hsl(var(--golden-deep))" }}
                >
                  <p className="font-display text-xl tracking-wider mb-4" style={{ color: "hsl(var(--golden))" }}>
                    LAST MONTH COMPARISON
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {[
                      { label: "Enquiries", now: analytics.enquiries.thisMonth, prev: analytics.enquiries.lastMonth },
                      { label: "New Clients", now: analytics.newClients.thisMonth, prev: analytics.newClients.lastMonth },
                      { label: "Revenue", now: analytics.revenue.thisMonth, prev: analytics.revenue.lastMonth, isCurrency: true },
                    ].map(({ label, now, prev, isCurrency }) => (
                      <div key={label}>
                        <p className="font-body text-xs font-semibold uppercase tracking-widest opacity-50 text-white mb-1">{label}</p>
                        <p className="font-mono text-sm text-white">{isCurrency ? fmt(now) : now} <span className="opacity-40">this month</span></p>
                        <p className="font-mono text-xs text-white/30">{isCurrency ? fmt(prev) : prev} last month</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-24">
                <BarChart3 size={40} className="mx-auto mb-4 opacity-20 text-white" />
                <p className="font-body text-white opacity-30">No analytics data yet.</p>
              </div>
            )}
          </>
        )}

        {/* ── EMAIL TEMPLATES TAB ── */}
        {activeTab === "templates" && (
          <>
            <div className="mb-8">
              <h1 className="font-display text-5xl tracking-wider" style={{ color: "hsl(var(--golden))" }}>
                EMAIL TEMPLATES
              </h1>
              <p className="font-body text-sm text-white/40 mt-2">
                View-only copies of all system emails sent by Kaizen Climbing Coaching.
              </p>
            </div>

            <div className="space-y-3">
              {EMAIL_TEMPLATES.map((tpl) => {
                const isOpen = expandedTemplate === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    className="border"
                    style={{ backgroundColor: "hsl(var(--golden-dark))", borderColor: "hsl(var(--golden-deep))" }}
                  >
                    <button
                      onClick={() => setExpandedTemplate(isOpen ? null : tpl.id)}
                      className="w-full flex items-center justify-between p-5 text-left"
                    >
                      <div>
                        <p className="font-display text-lg tracking-wide" style={{ color: "hsl(var(--golden))" }}>
                          {tpl.name}
                        </p>
                        <p className="font-body text-xs text-white/40 mt-0.5">{tpl.description}</p>
                      </div>
                      <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                        <span
                          className="font-body text-xs font-semibold uppercase tracking-wider px-2.5 py-1 hidden sm:block"
                          style={{ backgroundColor: "hsl(var(--golden) / 0.1)", color: "hsl(var(--golden) / 0.7)", border: "1px solid hsl(var(--golden) / 0.2)" }}
                        >
                          {tpl.id}
                        </span>
                        {isOpen ? (
                          <ChevronUp size={16} style={{ color: "hsl(var(--golden))" }} />
                        ) : (
                          <Eye size={16} style={{ color: "hsl(var(--golden) / 0.5)" }} />
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="border-t px-5 pb-5" style={{ borderColor: "hsl(var(--golden-deep))" }}>
                        <div className="mt-4 mb-3">
                          <p className="font-body text-xs font-semibold uppercase tracking-widest opacity-40 text-white mb-1">Subject line</p>
                          <p
                            className="font-body text-sm px-3 py-2 border"
                            style={{ backgroundColor: "hsl(var(--charcoal))", borderColor: "hsl(var(--golden-deep))", color: "hsl(var(--golden))" }}
                          >
                            {tpl.subject}
                          </p>
                        </div>
                        <div>
                          <p className="font-body text-xs font-semibold uppercase tracking-widest opacity-40 text-white mb-1">Body content</p>
                          <pre
                            className="font-body text-sm text-white/70 leading-relaxed whitespace-pre-wrap px-4 py-4 border"
                            style={{ backgroundColor: "hsl(var(--charcoal))", borderColor: "hsl(var(--golden-deep))" }}
                          >
                            {tpl.preview}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

      </div>
    </main>
  );
};

export default AdminDashboard;
