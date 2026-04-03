import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Step = 1 | 2 | 3;

const DISCIPLINES = ["Sport climbing", "Bouldering", "Both equally"];
const HOURS = ["2–4 hrs", "4–6 hrs", "6–8 hrs", "8+ hrs"];
const YEARS = ["Less than 1 year", "1–2 years", "2–5 years", "5–10 years", "10+ years"];

const ApplyPage = () => {
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    current_grade: "",
    target_grade: "",
    years_climbing: "",
    preferred_discipline: "",
    goals: "",
    training_history: "",
    currently_injured: false,
    injury_details: "",
    hours_per_week: "",
    budget_confirmed: false,
    why_now: "",
  });

  const set = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === "checkbox"
      ? (e.target as HTMLInputElement).checked
      : e.target.value;
    setForm(f => ({ ...f, [field]: value }));
  };

  const step1Valid = form.first_name && form.last_name && form.email;
  const step2Valid = form.current_grade && form.target_grade && form.years_climbing && form.preferred_discipline;
  const step3Valid = form.goals && form.training_history && form.hours_per_week && form.why_now && form.budget_confirmed;

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const { error: fnError } = await supabase.functions.invoke("submit-application", {
        body: form,
      });
      if (fnError) throw new Error(fnError.message);
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    backgroundColor: "hsl(var(--void-black))",
    border: "1px solid hsl(var(--void-light))",
    color: "hsl(var(--chalk-white))",
    padding: "0.75rem 1rem",
    fontFamily: "inherit",
    fontSize: "0.85rem",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.6rem",
    letterSpacing: "0.18em",
    textTransform: "uppercase" as const,
    color: "hsl(var(--chalk-white) / 0.5)",
    marginBottom: "0.4rem",
    fontFamily: "inherit",
  };

  const fieldStyle: React.CSSProperties = { marginBottom: "1.25rem" };

  if (submitted) {
    return (
      <main
        className="min-h-screen flex items-center justify-center px-6"
        style={{ backgroundColor: "hsl(var(--void-black))" }}
      >
        <div className="max-w-md w-full text-center">
          <p
            className="font-mono text-xs tracking-[0.25em] mb-4"
            style={{ color: "hsl(var(--neon-green))" }}
          >
            // APPLICATION RECEIVED
          </p>
          <h1
            className="font-display text-3xl sm:text-4xl mb-6"
            style={{ color: "hsl(var(--chalk-white))" }}
          >
            YOU'RE IN THE QUEUE.
          </h1>
          <div className="w-16 h-0.5 mx-auto mb-6" style={{ backgroundColor: "hsl(var(--neon-green))" }} />
          <p
            className="font-mono text-sm leading-relaxed"
            style={{ color: "hsl(var(--chalk-white) / 0.6)" }}
          >
            I'll review your application and be in touch within 48 hours. Check your inbox — you should have a confirmation email.
          </p>
          <p
            className="font-mono text-sm mt-4"
            style={{ color: "hsl(var(--chalk-white) / 0.6)" }}
          >
            — Buster
          </p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ backgroundColor: "hsl(var(--void-black))", minHeight: "100vh" }}>

      {/* Header */}
      <div
        style={{
          borderBottom: "3px solid hsl(var(--neon-green))",
          backgroundColor: "hsl(var(--void-black))",
          padding: "1.25rem 1.5rem",
        }}
      >
        <p
          className="font-display text-sm tracking-widest"
          style={{ color: "hsl(var(--neon-green))" }}
        >
          ⬡ KAIZEN
        </p>
      </div>

      <div className="max-w-xl mx-auto px-6 py-16">

        {/* Title */}
        <p
          className="font-mono text-xs tracking-[0.25em] mb-3"
          style={{ color: "hsl(var(--neon-orange))" }}
        >
          // APPLY FOR THE KAIZEN PLAN
        </p>
        <h1
          className="font-display text-3xl sm:text-4xl mb-2"
          style={{ color: "hsl(var(--chalk-white))" }}
        >
          LET'S SEE IF WE'RE A FIT.
        </h1>
        <p
          className="font-mono text-xs mb-10"
          style={{ color: "hsl(var(--chalk-white) / 0.4)" }}
        >
          Takes 3 minutes. No account needed. I'll review within 48 hours.
        </p>

        {/* Step indicator */}
        <div className="flex gap-2 mb-10">
          {([1, 2, 3] as Step[]).map(s => (
            <div
              key={s}
              style={{
                flex: 1,
                height: 3,
                backgroundColor: s <= step
                  ? "hsl(var(--neon-green))"
                  : "hsl(var(--void-light))",
                transition: "background-color 0.3s",
              }}
            />
          ))}
        </div>

        {/* ── STEP 1: Contact ── */}
        {step === 1 && (
          <div>
            <p
              className="font-mono text-xs tracking-widest mb-6"
              style={{ color: "hsl(var(--neon-green))" }}
            >
              STEP 1 — ABOUT YOU
            </p>

            <div className="grid grid-cols-2 gap-4" style={{ marginBottom: "1.25rem" }}>
              <div>
                <label style={labelStyle}>First name *</label>
                <input style={inputStyle} value={form.first_name} onChange={set("first_name")} />
              </div>
              <div>
                <label style={labelStyle}>Last name *</label>
                <input style={inputStyle} value={form.last_name} onChange={set("last_name")} />
              </div>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Email address *</label>
              <input type="email" style={inputStyle} value={form.email} onChange={set("email")} />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Phone (optional)</label>
              <input type="tel" style={inputStyle} value={form.phone} onChange={set("phone")} placeholder="+44..." />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!step1Valid}
              className="btn-neon w-full py-4 mt-2"
              style={{ opacity: step1Valid ? 1 : 0.4, cursor: step1Valid ? "pointer" : "not-allowed" }}
            >
              NEXT: YOUR CLIMBING →
            </button>
          </div>
        )}

        {/* ── STEP 2: Climbing background ── */}
        {step === 2 && (
          <div>
            <p
              className="font-mono text-xs tracking-widest mb-6"
              style={{ color: "hsl(var(--neon-green))" }}
            >
              STEP 2 — YOUR CLIMBING
            </p>

            <div className="grid grid-cols-2 gap-4" style={{ marginBottom: "1.25rem" }}>
              <div>
                <label style={labelStyle}>Current grade *</label>
                <input style={inputStyle} value={form.current_grade} onChange={set("current_grade")} placeholder="e.g. 7a / V5" />
              </div>
              <div>
                <label style={labelStyle}>Target grade *</label>
                <input style={inputStyle} value={form.target_grade} onChange={set("target_grade")} placeholder="e.g. 7c / V8" />
              </div>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Years climbing *</label>
              <select style={inputStyle} value={form.years_climbing} onChange={set("years_climbing")}>
                <option value="">Select...</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Primary discipline *</label>
              <select style={inputStyle} value={form.preferred_discipline} onChange={set("preferred_discipline")}>
                <option value="">Select...</option>
                {DISCIPLINES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setStep(1)}
                className="btn-outline-neon flex-1 py-4"
              >
                ← BACK
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!step2Valid}
                className="btn-neon flex-1 py-4"
                style={{ opacity: step2Valid ? 1 : 0.4, cursor: step2Valid ? "pointer" : "not-allowed" }}
              >
                NEXT: GOALS →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Goals, history, commitment ── */}
        {step === 3 && (
          <div>
            <p
              className="font-mono text-xs tracking-widest mb-6"
              style={{ color: "hsl(var(--neon-green))" }}
            >
              STEP 3 — GOALS & COMMITMENT
            </p>

            <div style={fieldStyle}>
              <label style={labelStyle}>What are your goals? *</label>
              <textarea
                style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
                value={form.goals}
                onChange={set("goals")}
                placeholder="What do you want to achieve? Any specific routes, grades, or areas of climbing?"
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Training history *</label>
              <textarea
                style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
                value={form.training_history}
                onChange={set("training_history")}
                placeholder="What have you tried so far? Any structured training, plans, coaching, etc.?"
              />
            </div>

            <div style={fieldStyle}>
              <label style={{ ...labelStyle, marginBottom: "0.75rem" }}>Currently injured?</label>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="injured"
                  checked={form.currently_injured}
                  onChange={set("currently_injured")}
                  style={{ width: 16, height: 16, accentColor: "hsl(var(--neon-green))" }}
                />
                <label htmlFor="injured" className="font-mono text-xs" style={{ color: "hsl(var(--chalk-white) / 0.7)" }}>
                  Yes, I have a current injury
                </label>
              </div>
              {form.currently_injured && (
                <textarea
                  style={{ ...inputStyle, minHeight: 72, resize: "vertical", marginTop: "0.75rem" }}
                  value={form.injury_details}
                  onChange={set("injury_details")}
                  placeholder="Brief description — what is it and how long have you had it?"
                />
              )}
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Hours available to train per week *</label>
              <select style={inputStyle} value={form.hours_per_week} onChange={set("hours_per_week")}>
                <option value="">Select...</option>
                {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Why now? *</label>
              <textarea
                style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
                value={form.why_now}
                onChange={set("why_now")}
                placeholder="What's prompted you to look for coaching at this point?"
              />
            </div>

            {/* Budget confirmation */}
            <div
              style={{
                padding: "1rem 1.25rem",
                backgroundColor: "hsl(var(--void-dark))",
                border: "1px solid hsl(var(--void-light))",
                marginBottom: "1.25rem",
              }}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="budget"
                  checked={form.budget_confirmed}
                  onChange={set("budget_confirmed")}
                  style={{ width: 16, height: 16, marginTop: 2, accentColor: "hsl(var(--neon-green))", flexShrink: 0 }}
                />
                <label htmlFor="budget" className="font-mono text-xs leading-relaxed" style={{ color: "hsl(var(--chalk-white) / 0.7)" }}>
                  I understand the Kaizen Plan is a minimum 12-week commitment at £200 every 4 weeks (£600 total),
                  payable in full or in 3 instalments. *
                </label>
              </div>
            </div>

            {error && (
              <p className="font-mono text-xs mb-4" style={{ color: "hsl(0 70% 60%)" }}>
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="btn-outline-neon flex-1 py-4"
              >
                ← BACK
              </button>
              <button
                onClick={handleSubmit}
                disabled={!step3Valid || submitting}
                className="btn-neon flex-1 py-4"
                style={{ opacity: step3Valid && !submitting ? 1 : 0.4, cursor: step3Valid && !submitting ? "pointer" : "not-allowed" }}
              >
                {submitting ? "SUBMITTING..." : "SUBMIT APPLICATION →"}
              </button>
            </div>
          </div>
        )}

        <p
          className="font-mono text-xs text-center mt-8"
          style={{ color: "hsl(var(--chalk-white) / 0.25)" }}
        >
          © {new Date().getFullYear()} Kaizen Climbing Coaching
        </p>
      </div>
    </main>
  );
};

export default ApplyPage;
