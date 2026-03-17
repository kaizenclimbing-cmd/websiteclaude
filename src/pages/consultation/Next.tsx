import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CreditCard, CalendarDays, ArrowRight, FileText, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Stages stored in DB (plus virtual "not_started")
type Stage = "not_started" | "submitted" | "paid" | "booked";
type StepStatus = "done" | "current" | "locked";

interface Submission {
  first_name: string;
  onboarding_stage: string;
}

// Map DB stage → which step index is "current"
// Step 0 = Form, Step 1 = Payment, Step 2 = Book
function getStepStatus(stepIndex: number, stage: Stage): StepStatus {
  const stageToCurrentStep: Record<Stage, number> = {
    not_started: 0,
    submitted: 1,
    paid: 2,
    booked: 3, // all done
  };
  const currentStep = stageToCurrentStep[stage] ?? 0;
  if (stepIndex < currentStep) return "done";
  if (stepIndex === currentStep) return "current";
  return "locked";
}

const STEPS = [
  {
    icon: FileText,
    number: "01",
    title: "COMPLETE YOUR FORM",
    description:
      "Fill out the consultation form so we can understand your climbing background, goals, and experience. Takes around 10–15 minutes.",
    cta: { label: "START FORM", href: "/consultation/form" },
  },
  {
    icon: CreditCard,
    number: "02",
    title: "COMPLETE PAYMENT",
    description:
      "Secure your coaching spot by completing payment. You'll receive instant confirmation and your onboarding call link.",
    cta: { label: "PAY NOW", href: "https://buy.stripe.com/kaizen" },
  },
  {
    icon: CalendarDays,
    number: "03",
    title: "BOOK YOUR CALL",
    description:
      "Pick a time that works for you. Your onboarding call is where we map out your training plan together.",
    cta: { label: "BOOK YOUR CALL", href: "/book" },
  },
];

export default function ConsultationNext() {
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<Submission | null | "loading">("loading");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/consultation/auth");
        return;
      }

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

  if (submission === "loading") {
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "hsl(var(--charcoal))" }}
      >
        <Loader2 size={28} className="animate-spin" style={{ color: "hsl(var(--golden))" }} />
      </main>
    );
  }

  const hasSubmission = submission !== null;
  const stage: Stage = hasSubmission
    ? ((submission as Submission).onboarding_stage as Stage)
    : "not_started";
  const firstName = hasSubmission ? (submission as Submission).first_name : null;

  // Greeting: use first name if known, otherwise derive from email, otherwise "THERE"
  const greeting = firstName
    ? firstName.toUpperCase()
    : userEmail
    ? userEmail.split("@")[0].toUpperCase()
    : "THERE";

  const allDone = stage === "booked";

  return (
    <main
      className="min-h-screen px-6 py-16"
      style={{ backgroundColor: "hsl(var(--charcoal))" }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <p
          className="font-mono text-xs tracking-[0.3em] text-center mb-4"
          style={{ color: "hsl(var(--golden) / 0.5)" }}
        >
          // KAIZEN CLIMBING COACHING
        </p>
        <h1
          className="font-display text-5xl sm:text-6xl leading-none mb-2 text-center"
          style={{ color: "hsl(var(--golden))" }}
        >
          HEY, {greeting}
        </h1>
        <div
          className="w-16 h-0.5 mx-auto mt-4 mb-4"
          style={{ backgroundColor: "hsl(var(--golden))" }}
        />

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

            return (
              <div key={step.number} className="relative flex gap-6">
                {/* Vertical connector */}
                {i < STEPS.length - 1 && (
                  <div
                    className="absolute left-5 top-12 bottom-0 w-px"
                    style={{
                      backgroundColor: isDone
                        ? "hsl(var(--golden) / 0.4)"
                        : "hsl(var(--golden) / 0.15)",
                    }}
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
                        color: isDone
                          ? "hsl(var(--golden))"
                          : isCurrent
                          ? "white"
                          : "hsl(255 255 255 / 0.3)",
                      }}
                    >
                      {step.title}
                      {isDone && (
                        <span
                          className="ml-3 font-mono text-xs normal-case tracking-normal"
                          style={{ color: "hsl(var(--golden) / 0.6)" }}
                        >
                          ✓ complete
                        </span>
                      )}
                    </h3>
                  </div>

                  <p
                    className="font-body text-sm leading-relaxed mb-4"
                    style={{
                      color: isLocked
                        ? "hsl(255 255 255 / 0.25)"
                        : "hsl(255 255 255 / 0.55)",
                    }}
                  >
                    {step.description}
                  </p>

                  {/* Active CTA */}
                  {step.cta && isCurrent &&
                    (step.cta.href.startsWith("http") ? (
                      <a
                        href={step.cta.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-display text-sm tracking-wider px-5 py-2.5 transition-all duration-150"
                        style={{
                          backgroundColor: "hsl(var(--golden))",
                          color: "hsl(var(--charcoal))",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                            "hsl(var(--golden-dark))";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                            "hsl(var(--golden))";
                        }}
                      >
                        {step.cta.label}
                        <ArrowRight size={14} />
                      </a>
                    ) : (
                      <Link
                        to={step.cta.href}
                        className="inline-flex items-center gap-2 font-display text-sm tracking-wider px-5 py-2.5 transition-all duration-150"
                        style={{
                          backgroundColor: "hsl(var(--golden))",
                          color: "hsl(var(--charcoal))",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                            "hsl(var(--golden-dark))";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                            "hsl(var(--golden))";
                        }}
                      >
                        {step.cta.label}
                        <ArrowRight size={14} />
                      </Link>
                    ))}

                  {/* Locked CTA (greyed out) */}
                  {step.cta && isLocked && (
                    <div
                      className="inline-flex items-center gap-2 font-display text-sm tracking-wider px-5 py-2.5 cursor-not-allowed select-none"
                      style={{
                        backgroundColor: "hsl(var(--golden) / 0.06)",
                        color: "hsl(var(--golden) / 0.2)",
                        border: "1px solid hsl(var(--golden) / 0.12)",
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
          <a
            href="mailto:Info@kaizenclimbing.co.uk"
            className="underline"
            style={{ color: "hsl(var(--golden) / 0.5)" }}
          >
            Info@kaizenclimbing.co.uk
          </a>
        </p>
      </div>
    </main>
  );
}
