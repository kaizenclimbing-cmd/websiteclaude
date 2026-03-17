import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle2, CreditCard, CalendarDays, ArrowRight, ClipboardList, Loader2, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Stage = "not_started" | "submitted" | "reviewed" | "paid" | "booked";
type StepStatus = "done" | "current" | "locked";

interface Submission {
  first_name: string;
  onboarding_stage: Stage;
}

const STAGE_ORDER: Stage[] = ["not_started", "submitted", "reviewed", "paid", "booked"];

function getStepStatus(stepIndex: number, stage: Stage): StepStatus {
  const stageIndex = STAGE_ORDER.indexOf(stage);
  if (stepIndex < stageIndex) return "done";
  if (stepIndex === stageIndex) return "current";
  return "locked";
}

const STEPS = [
  {
    icon: FileText,
    number: "01",
    title: "COMPLETE YOUR FORM",
    description: "Fill out the consultation form so we can understand your climbing background, goals, and experience. Takes around 10–15 minutes.",
    cta: { label: "START FORM", href: "/consultation/form" },
  },
  {
    icon: ClipboardList,
    number: "02",
    title: "UNDER REVIEW",
    description: "We're reviewing your consultation in detail. You'll hear back within 72 hours with next steps and a personalised plan outline.",
  },
  {
    icon: CreditCard,
    number: "03",
    title: "COMPLETE PAYMENT",
    description: "Once you've heard back from us, complete payment to secure your coaching spot. You'll receive a payment link via email.",
    cta: { label: "PAY NOW", href: "https://buy.stripe.com/kaizen" },
  },
  {
    icon: CalendarDays,
    number: "04",
    title: "BOOK YOUR CALL",
    description: "After payment is confirmed, book your onboarding call. Times sync with your local timezone automatically.",
    cta: { label: "BOOK YOUR CALL", href: "/book" },
  },
];

export default function ConsultationNext() {
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<Submission | null | "not_started">(null);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);

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

      setSubmission(data ? (data as Submission) : "not_started");
      setLoading(false);
    })();
  }, [navigate]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "hsl(var(--charcoal))" }}>
        <Loader2 size={28} className="animate-spin" style={{ color: "hsl(var(--golden))" }} />
      </main>
    );
  }

  const isNotStarted = submission === "not_started";
  const stage: Stage = isNotStarted ? "not_started" : (submission as Submission).onboarding_stage;
  const firstName = isNotStarted ? null : (submission as Submission).first_name;
  const greeting = firstName ? firstName.toUpperCase() : (userEmail ? userEmail.split("@")[0].toUpperCase() : "THERE");

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
          {isNotStarted
            ? "Complete the steps below to get started with your coaching journey."
            : "Here's where you are in the onboarding process."}
        </p>

        {/* Timeline */}
        <div className="space-y-0">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const status: StepStatus = getStepStatus(i, stage);
            const isDone = status === "done";
            const isCurrent = status === "current";
            const isLocked = status === "locked";

            return (
              <div key={step.number} className="relative flex gap-6">
                {/* Vertical connector */}
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
                    backgroundColor: isDone
                      ? "hsl(var(--golden))"
                      : isCurrent
                      ? "hsl(var(--golden) / 0.15)"
                      : "hsl(var(--golden) / 0.06)",
                    border: `1.5px solid ${
                      isDone
                        ? "hsl(var(--golden))"
                        : isCurrent
                        ? "hsl(var(--golden) / 0.5)"
                        : "hsl(var(--golden) / 0.2)"
                    }`,
                  }}
                >
                  <Icon
                    size={16}
                    style={{
                      color: isDone
                        ? "hsl(var(--charcoal))"
                        : isCurrent
                        ? "hsl(var(--golden))"
                        : "hsl(var(--golden) / 0.3)",
                    }}
                  />
                </div>

                {/* Content */}
                <div className="pb-12 flex-1">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span
                      className="font-mono text-xs"
                      style={{
                        color: isDone
                          ? "hsl(var(--golden))"
                          : isCurrent
                          ? "hsl(var(--golden) / 0.7)"
                          : "hsl(var(--golden) / 0.25)",
                      }}
                    >
                      {step.number}
                    </span>
                    <h3
                      className="font-display text-xl leading-none"
                      style={{
                        color: isDone ? "hsl(var(--golden))" : isCurrent ? "white" : "hsl(255 255 255 / 0.3)",
                      }}
                    >
                      {step.title}
                      {isDone && (
                        <span className="ml-3 font-mono text-xs normal-case tracking-normal" style={{ color: "hsl(var(--golden) / 0.6)" }}>
                          ✓ complete
                        </span>
                      )}
                      {isLocked && (
                        <span className="ml-3 font-mono text-xs normal-case tracking-normal" style={{ color: "hsl(var(--golden) / 0.3)" }}>
                          — locked
                        </span>
                      )}
                    </h3>
                  </div>

                  <p
                    className="font-body text-sm leading-relaxed mb-4"
                    style={{ color: isLocked ? "hsl(255 255 255 / 0.3)" : "hsl(255 255 255 / 0.55)" }}
                  >
                    {step.description}
                  </p>

                  {step.cta && isCurrent && (
                    step.cta.href.startsWith("http") ? (
                      <a
                        href={step.cta.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-display text-sm tracking-wider px-5 py-2.5 transition-all duration-150"
                        style={{ backgroundColor: "hsl(var(--golden))", color: "hsl(var(--charcoal))" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "hsl(var(--golden-dark))"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "hsl(var(--golden))"; }}
                      >
                        {step.cta.label}
                        <ArrowRight size={14} />
                      </a>
                    ) : (
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
                    )
                  )}

                  {step.cta && isLocked && (
                    <div
                      className="inline-flex items-center gap-2 font-display text-sm tracking-wider px-5 py-2.5 cursor-not-allowed select-none"
                      style={{
                        backgroundColor: "hsl(var(--golden) / 0.08)",
                        color: "hsl(var(--golden) / 0.25)",
                        border: "1px solid hsl(var(--golden) / 0.15)",
                      }}
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

