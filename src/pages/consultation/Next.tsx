import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, CreditCard, CalendarDays, ArrowRight, ClipboardList, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Stage = "submitted" | "reviewed" | "paid" | "booked";
type StepStatus = "done" | "current" | "locked";

interface Submission {
  first_name: string;
  onboarding_stage: Stage;
}

const STAGE_ORDER: Stage[] = ["submitted", "reviewed", "paid", "booked"];

function getStepStatus(stepIndex: number, stage: Stage): StepStatus {
  const stageIndex = STAGE_ORDER.indexOf(stage);
  if (stepIndex < stageIndex) return "done";
  if (stepIndex === stageIndex) return "current";
  return "locked";
}

const STEPS = [
  {
    icon: CheckCircle2,
    number: "01",
    title: "SUBMITTED",
    description: "Your consultation form has been received. We'll review everything carefully before getting back to you.",
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
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/consultation/auth"); return; }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase as any)
        .from("consultation_submissions")
        .select("first_name, onboarding_stage")
        .eq("user_id", user.id)
        .order("submitted_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!data) { navigate("/consultation/form"); return; }
      setSubmission(data as Submission);
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

  const stage = submission!.onboarding_stage;

  return (
    <main className="min-h-screen px-6 py-16" style={{ backgroundColor: "hsl(var(--charcoal))" }}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <p className="font-mono text-xs tracking-[0.3em] text-center mb-4" style={{ color: "hsl(var(--golden) / 0.5)" }}>
          // KAIZEN CLIMBING COACHING
        </p>
        <h1 className="font-display text-5xl sm:text-6xl leading-none mb-2 text-center" style={{ color: "hsl(var(--golden))" }}>
          HEY, {submission!.first_name.toUpperCase()}
        </h1>
        <div className="w-16 h-0.5 mx-auto mt-4 mb-4" style={{ backgroundColor: "hsl(var(--golden))" }} />

        <p className="font-body text-sm text-center text-white/50 mb-14 leading-relaxed max-w-md mx-auto">
          Here's where you are in the onboarding process.
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
                    <a
                      href={step.cta.href}
                      target={step.cta.href.startsWith("http") ? "_blank" : undefined}
                      rel={step.cta.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-2 font-display text-sm tracking-wider px-5 py-2.5 transition-all duration-150"
                      style={{ backgroundColor: "hsl(var(--golden))", color: "hsl(var(--charcoal))" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "hsl(var(--golden-dark))"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "hsl(var(--golden))"; }}
                    >
                      {step.cta.label}
                      <ArrowRight size={14} />
                    </a>
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

        {/* How Coaching Works */}
        <div className="mt-8 space-y-px">
          <p className="font-mono text-xs tracking-[0.3em] mb-6" style={{ color: "hsl(var(--golden) / 0.5)" }}>
            // HOW COACHING WORKS
          </p>

          {/* Coaching Approach */}
          <section
            className="p-6 border-t"
            style={{ borderColor: "hsl(var(--golden) / 0.15)" }}
          >
            <h4 className="font-display text-base mb-3" style={{ color: "hsl(var(--golden))" }}>
              COACHING APPROACH
            </h4>
            <p className="font-body text-sm text-white/55 leading-relaxed">
              Structured, evidence-based training that adapts to real life. My coaching is pragmatic and collaborative. The aim is not to follow a rigid plan for the sake of it, but to build a structure that works around your life, facilities, and goals. Training should move you forward consistently without becoming another source of stress. Plans are adjusted as we go, based on feedback, performance, and real-world constraints.
            </p>
          </section>

          {/* How the Process Works */}
          <section
            className="p-6 border-t"
            style={{ borderColor: "hsl(var(--golden) / 0.15)" }}
          >
            <h4 className="font-display text-base mb-5" style={{ color: "hsl(var(--golden))" }}>
              HOW THE PROCESS WORKS
            </h4>
            <div className="space-y-5">
              {[
                {
                  n: "01",
                  title: "Consultation Form",
                  desc: "You complete a form covering your climbing background, goals, schedule, injuries, facilities, and what you feel is currently holding you back.",
                },
                {
                  n: "02",
                  title: "Benchmarking",
                  desc: "A small set of practical benchmarks to establish useful starting points and guide programming. I value conversation and your history over this data.",
                },
                {
                  n: "03",
                  title: "Payment",
                  desc: "Payment confirms your place and start date.",
                },
                {
                  n: "04",
                  title: "Onboarding Call",
                  desc: "We talk through goals, benchmarks, and training priorities so everything is clear before we begin.",
                },
                {
                  n: "05",
                  title: "Start Training",
                  desc: "Training begins with a reactive, supportive, and flexible approach. The plan evolves based on how training is actually landing.",
                },
              ].map((step) => (
                <div key={step.n} className="flex gap-4">
                  <span className="font-mono text-xs flex-shrink-0 mt-0.5" style={{ color: "hsl(var(--golden) / 0.5)" }}>
                    {step.n}
                  </span>
                  <div>
                    <p className="font-display text-sm mb-1" style={{ color: "hsl(var(--golden) / 0.85)" }}>
                      {step.title}
                    </p>
                    <p className="font-body text-sm text-white/50 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* What's Included */}
          <section
            className="p-6 border-t"
            style={{ borderColor: "hsl(var(--golden) / 0.15)" }}
          >
            <h4 className="font-display text-base mb-5" style={{ color: "hsl(var(--golden))" }}>
              WHAT'S INCLUDED
            </h4>
            <div className="space-y-5">
              {[
                {
                  title: "Personalised Training Plan",
                  desc: "A fully customised plan built around your goals, available training time, facilities, and upcoming objectives. The focus is realistic, progressive training you can sustain.",
                },
                {
                  title: "Ongoing Support (WhatsApp)",
                  desc: "WhatsApp access for questions about sessions, adjustments, projects, or general guidance. I aim to reply quickly, but response time may be up to 3 days if I am away climbing or taking time off.",
                },
                {
                  title: "Weekly Check-ins",
                  desc: "Alongside day-to-day messaging, I review your training weekly and make adjustments where needed to keep progress steady.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-3">
                  <span style={{ color: "hsl(var(--golden))" }} className="flex-shrink-0 mt-0.5">—</span>
                  <div>
                    <p className="font-display text-sm mb-1" style={{ color: "hsl(var(--golden) / 0.85)" }}>
                      {item.title}
                    </p>
                    <p className="font-body text-sm text-white/50 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Payment */}
          <section
            className="p-6 border-t"
            style={{ borderColor: "hsl(var(--golden) / 0.15)" }}
          >
            <h4 className="font-display text-base mb-4" style={{ color: "hsl(var(--golden))" }}>
              PAYMENT &amp; COMMITMENT
            </h4>
            <p className="font-display text-2xl mb-3" style={{ color: "hsl(var(--golden))" }}>
              £600 <span className="font-body text-sm text-white/40 font-normal">/ 3 months</span>
            </p>
            <ul className="space-y-1 mb-3">
              {[
                "Pay £600 upfront, or",
                "Split into 3 monthly payments of £200",
              ].map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <span style={{ color: "hsl(var(--golden) / 0.5)" }} className="flex-shrink-0">•</span>
                  <span className="font-body text-sm text-white/50">{line}</span>
                </li>
              ))}
            </ul>
            <p className="font-body text-sm text-white/40 leading-relaxed">
              The minimum commitment is there to make sure we have enough time to build momentum and make meaningful progress. Most climbers continue beyond the first block.
            </p>
          </section>
        </div>

        <p className="font-body text-xs text-center text-white/30 mt-10 mb-2">
          Questions?{" "}
          <a href="mailto:Info@kaizenclimbing.co.uk" className="underline" style={{ color: "hsl(var(--golden) / 0.5)" }}>
            Info@kaizenclimbing.co.uk
          </a>
        </p>
      </div>
    </main>
  );
}
