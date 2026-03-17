import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Mail, Calendar, Tag, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";

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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<"all" | "contact" | "consultation">("all");
  const [activeTab, setActiveTab] = useState<"enquiries" | "pipeline">("enquiries");
  const [advancingId, setAdvancingId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setAdminEmail(user.email ?? "");
    });
    fetchSubmissions();
  }, []);

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
          <span className="font-body text-xs text-white opacity-50 ml-3 uppercase tracking-widest">
            Admin
          </span>
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
        <div className="max-w-6xl mx-auto px-6 flex gap-0">
          {(["enquiries", "pipeline"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="font-body text-xs font-semibold uppercase tracking-widest px-6 py-4 transition-colors duration-150 border-b-2"
              style={{
                color: activeTab === tab ? "hsl(var(--golden))" : "hsl(255 255 255 / 0.4)",
                borderColor: activeTab === tab ? "hsl(var(--golden))" : "transparent",
              }}
            >
              {tab === "enquiries" ? "All Enquiries" : "Pipeline"}
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
                          <div className="flex items-center gap-3">
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
                      {/* Lane header */}
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

                      {/* Client cards */}
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
      </div>
    </main>
  );
};

export default AdminDashboard;
