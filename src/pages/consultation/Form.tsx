import { useState, useEffect, useCallback, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, Save, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type FormData = {
  firstName: string;
  lastName: string;
  location: string;
  email: string;
  phone: string;
  yearsClimbing: string;
  occupation: string;
  currentlyInjured: boolean | null;
  injuryHistory: string;
  climbingTrainingHistory: string;
  goals: string;
  perceivedStrengths: string;
  perceivedWeaknesses: string;
  trainingFacilities: string;
  trainingTimePerWeek: string;
  preferredDisciplines: string[];
  hardestSportRedpoint: string;
  hardestSportInADay: string;
  hardestSportOnsight: string;
  hardestBoulderRedpoint: string;
  hardestBoulderFlash: string;
  hardestBoulderInADay: string;
};

const DISCIPLINE_OPTIONS = ["BOULDERING", "SPORT CLIMBING", "TRAD CLIMBING", "COMPS"];

const initialForm: FormData = {
  firstName: "",
  lastName: "",
  location: "",
  email: "",
  phone: "",
  yearsClimbing: "",
  occupation: "",
  currentlyInjured: null,
  injuryHistory: "",
  climbingTrainingHistory: "",
  goals: "",
  perceivedStrengths: "",
  perceivedWeaknesses: "",
  trainingFacilities: "",
  trainingTimePerWeek: "",
  preferredDisciplines: [],
  hardestSportRedpoint: "",
  hardestSportInADay: "",
  hardestSportOnsight: "",
  hardestBoulderRedpoint: "",
  hardestBoulderFlash: "",
  hardestBoulderInADay: "",
};

const labelCls = "block font-body text-xs font-semibold uppercase tracking-wider mb-1.5";
const inputCls =
  "w-full px-4 py-3 font-body text-sm outline-none focus:ring-2 bg-[#1a1a1a] text-white placeholder-white/30 border border-white/10 focus:border-golden focus:ring-golden/20";
const textareaCls = `${inputCls} resize-none`;

interface FieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

const Field = ({ label, required, hint, children }: FieldProps) => (
  <div>
    <label className={labelCls} style={{ color: "hsl(var(--golden))" }}>
      {label}
      {required && <span className="ml-1 opacity-60">(required)</span>}
    </label>
    {hint && <p className="font-body text-xs text-white/50 mb-2 leading-relaxed">{hint}</p>}
    {children}
  </div>
);

export default function ConsultationForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan") ?? "";
  const sessionId = searchParams.get("session_id") ?? "";
  const isSixWeek = plan === "six_week_peak";

  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [draftLoaded, setDraftLoaded] = useState(false);

  // Auth guard + load session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        const redirect = plan && sessionId
          ? `/consultation/form?plan=${plan}&session_id=${sessionId}`
          : "/consultation/form";
        navigate(`/consultation/auth?redirect=${encodeURIComponent(redirect)}`);
        return;
      }
      setUserId(session.user.id);
      setUserEmail(session.user.email ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/consultation/auth");
      else {
        setUserId(session.user.id);
        setUserEmail(session.user.email ?? null);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Load draft from DB once userId is known
  useEffect(() => {
    if (!userId || draftLoaded) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("consultation_drafts")
      .select("draft_data")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data }: { data: { draft_data: Partial<FormData> } | null }) => {
        if (data?.draft_data) {
          setForm((prev) => ({ ...prev, ...data.draft_data }));
        }
        setDraftLoaded(true);
      });
  }, [userId, draftLoaded]);

  // Auto-save draft to DB (debounced)
  const saveDraft = useCallback(
    async (currentForm: FormData, uid: string) => {
      setSaving(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from("consultation_drafts")
        .upsert({ user_id: uid, draft_data: currentForm }, { onConflict: "user_id" });
      setSaving(false);
    },
    []
  );

  useEffect(() => {
    if (!userId || !draftLoaded || submitted) return;
    const timeout = setTimeout(() => saveDraft(form, userId), 1500);
    return () => clearTimeout(timeout);
  }, [form, userId, draftLoaded, submitted, saveDraft]);

  const set = (field: keyof FormData, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleDiscipline = (d: string) =>
    set(
      "preferredDisciplines",
      form.preferredDisciplines.includes(d)
        ? form.preferredDisciplines.filter((x) => x !== d)
        : [...form.preferredDisciplines, d]
    );

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/consultation/auth");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setError("");
    setLoading(true);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertError } = await (supabase as any)
      .from("consultation_submissions")
      .insert({
        user_id: userId,
        first_name: form.firstName,
        last_name: form.lastName,
        location: form.location || null,
        email: form.email,
        phone: form.phone || null,
        years_climbing: form.yearsClimbing || null,
        occupation: form.occupation || null,
        currently_injured: form.currentlyInjured,
        injury_history: form.injuryHistory || null,
        climbing_training_history: form.climbingTrainingHistory || null,
        goals: form.goals || null,
        perceived_strengths: form.perceivedStrengths || null,
        perceived_weaknesses: form.perceivedWeaknesses || null,
        training_facilities: form.trainingFacilities || null,
        training_time_per_week: form.trainingTimePerWeek || null,
        preferred_disciplines: form.preferredDisciplines.length > 0 ? form.preferredDisciplines : null,
        hardest_sport_redpoint: form.hardestSportRedpoint || null,
        hardest_sport_in_a_day: form.hardestSportInADay || null,
        hardest_sport_onsight: form.hardestSportOnsight || null,
        hardest_boulder_redpoint: form.hardestBoulderRedpoint || null,
        hardest_boulder_flash: form.hardestBoulderFlash || null,
        hardest_boulder_in_a_day: form.hardestBoulderInADay || null,
        ...(plan ? { plan } : {}),
        ...(isSixWeek && sessionId ? { stripe_session_id: sessionId } : {}),
      });

    if (insertError) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    // For 6-week plan: verify payment now that the form is submitted
    if (isSixWeek && sessionId) {
      const { error: verifyError } = await supabase.functions.invoke("verify-payment", {
        body: { session_id: sessionId },
      });
      if (verifyError) {
        // Non-fatal: submission is saved, payment can be reconciled manually
        console.error("Payment verification failed:", verifyError);
      }
    }

    // Delete draft from DB
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from("consultation_drafts")
      .delete()
      .eq("user_id", userId);

    // Send confirmation emails (fire-and-forget)
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
    fetch(
      `https://${projectId}.supabase.co/functions/v1/send-consultation-confirmation`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
        body: JSON.stringify({ firstName: form.firstName, lastName: form.lastName, email: form.email }),
      }
    ).catch(console.error);

    setLoading(false);
    navigate("/consultation/next");
  };

  if (!userId) return null;

  return (
    <main style={{ backgroundColor: "hsl(var(--charcoal))" }} className="min-h-screen">
      <div className="pt-8" />

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 font-mono text-xs" style={{ color: "hsl(var(--golden) / 0.5)" }}>
            <Save size={12} />
            <span>{saving ? "Saving…" : "Draft auto-saved"}</span>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-1.5 font-mono text-xs opacity-40 hover:opacity-70 transition-opacity"
            style={{ color: "hsl(var(--golden))" }}
          >
            <LogOut size={12} />
            Sign out
          </button>
        </div>

        {/* Title */}
        <h1
          className="font-display text-5xl sm:text-6xl leading-none mb-2 text-center"
          style={{ color: "hsl(var(--golden))" }}
        >
          CONSULTATION FORM
        </h1>
        <div className="w-16 h-0.5 mx-auto mt-4 mb-4" style={{ backgroundColor: "hsl(var(--golden))" }} />
        {userEmail && (
          <p className="font-mono text-xs text-center mb-10" style={{ color: "hsl(var(--golden) / 0.4)" }}>
            Signed in as {userEmail}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ── Name ── */}
          <div>
            <p className={labelCls} style={{ color: "hsl(var(--golden))" }}>Name</p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="First Name" required>
                <input type="text" required value={form.firstName} onChange={(e) => set("firstName", e.target.value)} className={inputCls} />
              </Field>
              <Field label="Last Name" required>
                <input type="text" required value={form.lastName} onChange={(e) => set("lastName", e.target.value)} className={inputCls} />
              </Field>
            </div>
          </div>

          {/* ── Location ── */}
          <Field label="Location">
            <input type="text" value={form.location} onChange={(e) => set("location", e.target.value)} className={inputCls} />
          </Field>

          {/* ── Email ── */}
          <Field label="Email" required>
            <input type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls} />
          </Field>

          {/* ── Phone ── */}
          <Field label="Phone Number">
            <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls} />
          </Field>

          {/* ── Years climbing ── */}
          <Field label="Years Climbing">
            <input type="text" value={form.yearsClimbing} onChange={(e) => set("yearsClimbing", e.target.value)} className={inputCls} placeholder="e.g. 3 years" />
          </Field>

          {/* ── Occupation ── */}
          <Field label="Occupation">
            <input type="text" value={form.occupation} onChange={(e) => set("occupation", e.target.value)} className={inputCls} />
          </Field>

          {/* ── Currently injured ── */}
          <div>
            <p className={labelCls} style={{ color: "hsl(var(--golden))" }}>
              Are you currently injured or experiencing pain?
            </p>
            <div className="flex gap-6 mt-1">
              {(["Yes", "No"] as const).map((opt) => {
                const val = opt === "Yes";
                const active = form.currentlyInjured === val;
                return (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer">
                    <div
                      className="w-4 h-4 flex-shrink-0 border flex items-center justify-center transition-colors duration-150"
                      style={{ borderColor: "hsl(var(--golden))", backgroundColor: active ? "hsl(var(--golden))" : "transparent" }}
                      onClick={() => set("currentlyInjured", val)}
                    >
                      {active && (
                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                          <path d="M1 3L3 5L7 1" stroke="hsl(var(--charcoal))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className="font-body text-sm select-none text-white/80" onClick={() => set("currentlyInjured", val)}>{opt}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* ── Injury history ── */}
          <Field label="Past Injury History">
            <textarea rows={4} value={form.injuryHistory} onChange={(e) => set("injuryHistory", e.target.value)} className={textareaCls} />
          </Field>

          {/* ── Climbing and training history ── */}
          <Field label="Climbing and Training History">
            <textarea rows={4} value={form.climbingTrainingHistory} onChange={(e) => set("climbingTrainingHistory", e.target.value)} className={textareaCls} />
          </Field>

          {/* ── Goals ── */}
          <Field
            label="Goals / Projects / Training Goals and Time Scales"
            hint="When would you like to achieve these by? Goals with specific time frames help us design a plan for you, to peak at the right time, before a trip or season at your local spot."
          >
            <textarea rows={5} value={form.goals} onChange={(e) => set("goals", e.target.value)} className={textareaCls} />
          </Field>

          {/* ── Strengths ── */}
          <Field label="Perceived Strengths">
            <textarea rows={4} value={form.perceivedStrengths} onChange={(e) => set("perceivedStrengths", e.target.value)} className={textareaCls} />
          </Field>

          {/* ── Weaknesses ── */}
          <Field label="Perceived Weaknesses">
            <textarea rows={4} value={form.perceivedWeaknesses} onChange={(e) => set("perceivedWeaknesses", e.target.value)} className={textareaCls} />
          </Field>

          {/* ── Training facilities ── */}
          <Field label="What Training Facilities Do You Have Regular Access To?">
            <input type="text" value={form.trainingFacilities} onChange={(e) => set("trainingFacilities", e.target.value)} className={inputCls} />
          </Field>

          {/* ── Training time ── */}
          <Field label="How Much Time Can You Set Aside for Training Per Week?">
            <textarea rows={3} value={form.trainingTimePerWeek} onChange={(e) => set("trainingTimePerWeek", e.target.value)} className={textareaCls} />
          </Field>

          {/* ── Preferred disciplines ── */}
          <div>
            <p className={labelCls} style={{ color: "hsl(var(--golden))" }}>What Is Your Preferred Discipline?</p>
            <div className="space-y-2 mt-1">
              {DISCIPLINE_OPTIONS.map((d) => {
                const active = form.preferredDisciplines.includes(d);
                return (
                  <label key={d} className="flex items-center gap-3 cursor-pointer">
                    <div
                      className="w-4 h-4 flex-shrink-0 border flex items-center justify-center transition-colors duration-150"
                      style={{ borderColor: "hsl(var(--golden))", backgroundColor: active ? "hsl(var(--golden))" : "transparent" }}
                      onClick={() => toggleDiscipline(d)}
                    >
                      {active && (
                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                          <path d="M1 3L3 5L7 1" stroke="hsl(var(--charcoal))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className="font-body text-sm select-none text-white/80 uppercase tracking-wider" onClick={() => toggleDiscipline(d)}>{d}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* ── Grades ── */}
          <div className="space-y-4">
            <p className={labelCls} style={{ color: "hsl(var(--golden))" }}>Grades</p>
            {[
              { key: "hardestSportRedpoint", label: "Hardest Sport Redpoint" },
              { key: "hardestSportInADay", label: "Hardest Sport in a Day" },
              { key: "hardestSportOnsight", label: "Hardest Sport Onsight" },
              { key: "hardestBoulderRedpoint", label: "Hardest Boulder Redpoint" },
              { key: "hardestBoulderFlash", label: "Hardest Boulder Flash" },
              { key: "hardestBoulderInADay", label: "Hardest Boulder in a Day" },
            ].map(({ key, label }) => (
              <Field key={key} label={label}>
                <input
                  type="text"
                  value={form[key as keyof FormData] as string}
                  onChange={(e) => set(key as keyof FormData, e.target.value)}
                  className={inputCls}
                  placeholder="e.g. 7a / V5"
                />
              </Field>
            ))}
          </div>

          {error && <p className="font-body text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 font-display text-2xl tracking-wider transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-60"
            style={{ backgroundColor: "hsl(var(--golden))", color: "hsl(var(--charcoal))" }}
            onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "hsl(var(--golden-dark))"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "hsl(var(--golden))"; }}
          >
            {loading && <Loader2 size={20} className="animate-spin" />}
            {loading ? "SENDING..." : "SEND"}
          </button>
        </form>
      </div>
    </main>
  );
}
