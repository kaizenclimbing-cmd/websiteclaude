import { useState, useEffect, type FormEvent } from "react";
import { Loader2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const DRAFT_KEY = "consultation_draft";

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

// ── Reusable field primitives ──────────────────────────────────────────────

const labelCls =
  "block font-body text-xs font-semibold uppercase tracking-wider mb-1.5";
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
    {hint && (
      <p className="font-body text-xs text-white/50 mb-2 leading-relaxed">{hint}</p>
    )}
    {children}
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────

const ConsultationPage = () => {
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (field: keyof FormData, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleDiscipline = (d: string) =>
    set(
      "preferredDisciplines",
      form.preferredDisciplines.includes(d)
        ? form.preferredDisciplines.filter((x) => x !== d)
        : [...form.preferredDisciplines, d]
    );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertError } = await (supabase as any)
      .from("consultation_submissions")
      .insert({
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
        preferred_disciplines:
          form.preferredDisciplines.length > 0 ? form.preferredDisciplines : null,
        hardest_sport_redpoint: form.hardestSportRedpoint || null,
        hardest_sport_in_a_day: form.hardestSportInADay || null,
        hardest_sport_onsight: form.hardestSportOnsight || null,
        hardest_boulder_redpoint: form.hardestBoulderRedpoint || null,
        hardest_boulder_flash: form.hardestBoulderFlash || null,
        hardest_boulder_in_a_day: form.hardestBoulderInADay || null,
      });

    setLoading(false);

    if (insertError) {
      setError("Something went wrong. Please try again.");
      return;
    }

    setSubmitted(true);
  };

  return (
    <main style={{ backgroundColor: "hsl(var(--charcoal))" }} className="min-h-screen">
      {/* Header spacer for nav */}
      <div className="pt-16" style={{ backgroundColor: "hsl(var(--charcoal))" }} />

      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Title */}
        <h1
          className="font-display text-5xl sm:text-6xl leading-none mb-2 text-center"
          style={{ color: "hsl(var(--golden))" }}
        >
          CONSULTATION FORM
        </h1>
        <div
          className="w-16 h-0.5 mx-auto mt-4 mb-12"
          style={{ backgroundColor: "hsl(var(--golden))" }}
        />

        {submitted ? (
          <div className="text-center py-20">
            <h2
              className="font-display text-4xl leading-none mb-4"
              style={{ color: "hsl(var(--golden))" }}
            >
              FORM SUBMITTED!
            </h2>
            <p className="font-body text-white/70 mb-8 max-w-xs mx-auto">
              Thanks for filling this out. We'll review your consultation and be in touch soon.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setForm(initialForm);
              }}
              className="font-body font-semibold text-sm uppercase tracking-wider underline"
              style={{ color: "hsl(var(--golden))" }}
            >
              Submit another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* ── Name ── */}
            <div>
              <p className={labelCls} style={{ color: "hsl(var(--golden))" }}>
                Name
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Field label="First Name" required>
                  <input
                    type="text"
                    required
                    value={form.firstName}
                    onChange={(e) => set("firstName", e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Last Name" required>
                  <input
                    type="text"
                    required
                    value={form.lastName}
                    onChange={(e) => set("lastName", e.target.value)}
                    className={inputCls}
                  />
                </Field>
              </div>
            </div>

            {/* ── Location ── */}
            <Field label="Location">
              <input
                type="text"
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                className={inputCls}
              />
            </Field>

            {/* ── Email ── */}
            <Field label="Email" required>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className={inputCls}
              />
            </Field>

            {/* ── Phone ── */}
            <Field label="Phone Number">
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                className={inputCls}
              />
            </Field>

            {/* ── Years climbing ── */}
            <Field label="Years Climbing">
              <input
                type="text"
                value={form.yearsClimbing}
                onChange={(e) => set("yearsClimbing", e.target.value)}
                className={inputCls}
                placeholder="e.g. 3 years"
              />
            </Field>

            {/* ── Occupation ── */}
            <Field label="Occupation">
              <input
                type="text"
                value={form.occupation}
                onChange={(e) => set("occupation", e.target.value)}
                className={inputCls}
              />
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
                        style={{
                          borderColor: "hsl(var(--golden))",
                          backgroundColor: active ? "hsl(var(--golden))" : "transparent",
                        }}
                        onClick={() => set("currentlyInjured", val)}
                      >
                        {active && (
                          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                            <path d="M1 3L3 5L7 1" stroke="hsl(var(--charcoal))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span
                        className="font-body text-sm select-none text-white/80"
                        onClick={() => set("currentlyInjured", val)}
                      >
                        {opt}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* ── Injury history ── */}
            <Field label="Past Injury History">
              <textarea
                rows={4}
                value={form.injuryHistory}
                onChange={(e) => set("injuryHistory", e.target.value)}
                className={textareaCls}
              />
            </Field>

            {/* ── Climbing and training history ── */}
            <Field label="Climbing and Training History">
              <textarea
                rows={4}
                value={form.climbingTrainingHistory}
                onChange={(e) => set("climbingTrainingHistory", e.target.value)}
                className={textareaCls}
              />
            </Field>

            {/* ── Goals ── */}
            <Field
              label="Goals / Projects / Training Goals and Time Scales"
              hint="When would you like to achieve these by? Goals with specific time frames help us design a plan for you, to peak at the right time, before a trip or season at your local spot."
            >
              <textarea
                rows={5}
                value={form.goals}
                onChange={(e) => set("goals", e.target.value)}
                className={textareaCls}
              />
            </Field>

            {/* ── Strengths ── */}
            <Field label="Perceived Strengths">
              <textarea
                rows={4}
                value={form.perceivedStrengths}
                onChange={(e) => set("perceivedStrengths", e.target.value)}
                className={textareaCls}
              />
            </Field>

            {/* ── Weaknesses ── */}
            <Field label="Perceived Weaknesses">
              <textarea
                rows={4}
                value={form.perceivedWeaknesses}
                onChange={(e) => set("perceivedWeaknesses", e.target.value)}
                className={textareaCls}
              />
            </Field>

            {/* ── Training facilities ── */}
            <Field label="What Training Facilities Do You Have Regular Access To?">
              <input
                type="text"
                value={form.trainingFacilities}
                onChange={(e) => set("trainingFacilities", e.target.value)}
                className={inputCls}
              />
            </Field>

            {/* ── Training time ── */}
            <Field label="How Much Time Can You Set Aside for Training Per Week?">
              <textarea
                rows={3}
                value={form.trainingTimePerWeek}
                onChange={(e) => set("trainingTimePerWeek", e.target.value)}
                className={textareaCls}
              />
            </Field>

            {/* ── Preferred disciplines ── */}
            <div>
              <p className={labelCls} style={{ color: "hsl(var(--golden))" }}>
                What Is Your Preferred Discipline?
              </p>
              <div className="space-y-2 mt-1">
                {DISCIPLINE_OPTIONS.map((d) => {
                  const active = form.preferredDisciplines.includes(d);
                  return (
                    <label key={d} className="flex items-center gap-3 cursor-pointer">
                      <div
                        className="w-4 h-4 flex-shrink-0 border flex items-center justify-center transition-colors duration-150"
                        style={{
                          borderColor: "hsl(var(--golden))",
                          backgroundColor: active ? "hsl(var(--golden))" : "transparent",
                        }}
                        onClick={() => toggleDiscipline(d)}
                      >
                        {active && (
                          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                            <path d="M1 3L3 5L7 1" stroke="hsl(var(--charcoal))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span
                        className="font-body text-sm select-none text-white/80 uppercase tracking-wider"
                        onClick={() => toggleDiscipline(d)}
                      >
                        {d}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* ── Grades ── */}
            <div className="space-y-4">
              <p className={labelCls} style={{ color: "hsl(var(--golden))" }}>
                Grades
              </p>
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

            {/* ── Error ── */}
            {error && <p className="font-body text-xs text-red-400">{error}</p>}

            {/* ── Submit ── */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 font-display text-2xl tracking-wider transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-60"
              style={{
                backgroundColor: "hsl(var(--golden))",
                color: "hsl(var(--charcoal))",
              }}
              onMouseEnter={(e) => {
                if (!loading)
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "hsl(var(--golden-dark))";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "hsl(var(--golden))";
              }}
            >
              {loading && <Loader2 size={20} className="animate-spin" />}
              {loading ? "SENDING..." : "SEND"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
};

export default ConsultationPage;
