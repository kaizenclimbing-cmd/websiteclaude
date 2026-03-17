import { CheckCircle2, CreditCard, CalendarDays, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    icon: CheckCircle2,
    number: "01",
    title: "CONSULTATION SUBMITTED",
    description:
      "Your consultation form has been received. We'll review everything and be in touch within 72 hours.",
    status: "done" as const,
  },
  {
    icon: CreditCard,
    number: "02",
    title: "COMPLETE PAYMENT",
    description:
      "Once you've heard back from us, complete payment to secure your coaching spot. You'll receive a payment link via email.",
    status: "next" as const,
    cta: {
      label: "PAY NOW",
      href: "https://buy.stripe.com/kaizen", // placeholder — update with real link
    },
  },
  {
    icon: CalendarDays,
    number: "03",
    title: "BOOK YOUR CALL",
    description:
      "After payment is confirmed, use the link below to book your onboarding call. Times sync with your local time zone automatically.",
    status: "locked" as const,
    cta: {
      label: "BOOK YOUR CALL",
      href: "/book",
    },
  },
];

export default function ConsultationNext() {
  const navigate = useNavigate();

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
          WHAT'S NEXT
        </h1>
        <div
          className="w-16 h-0.5 mx-auto mt-4 mb-4"
          style={{ backgroundColor: "hsl(var(--golden))" }}
        />
        <p className="font-body text-sm text-center text-white/50 mb-14 leading-relaxed max-w-md mx-auto">
          Your consultation has been submitted. Here's what happens from here — three simple steps to get your coaching underway.
        </p>

        {/* Timeline */}
        <div className="space-y-0">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isDone = step.status === "done";
            const isNext = step.status === "next";
            const isLocked = step.status === "locked";

            return (
              <div key={step.number} className="relative flex gap-6">
                {/* Vertical connector */}
                {i < steps.length - 1 && (
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
                      : isNext
                      ? "hsl(var(--golden) / 0.15)"
                      : "hsl(var(--golden) / 0.06)",
                    border: `1.5px solid ${
                      isDone
                        ? "hsl(var(--golden))"
                        : isNext
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
                        : isNext
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
                          : isNext
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
                          : isNext
                          ? "white"
                          : "hsl(var(--charcoal-light, 255 255 255 / 0.3))",
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
                      {isLocked && (
                        <span
                          className="ml-3 font-mono text-xs normal-case tracking-normal"
                          style={{ color: "hsl(var(--golden) / 0.3)" }}
                        >
                          — unlocks after payment
                        </span>
                      )}
                    </h3>
                  </div>

                  <p
                    className="font-body text-sm leading-relaxed mb-4"
                    style={{
                      color: isLocked ? "hsl(255 255 255 / 0.3)" : "hsl(255 255 255 / 0.55)",
                    }}
                  >
                    {step.description}
                  </p>

                  {step.cta && !isLocked && (
                    <a
                      href={step.cta.href}
                      target={step.cta.href.startsWith("http") ? "_blank" : undefined}
                      rel={step.cta.href.startsWith("http") ? "noopener noreferrer" : undefined}
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

        {/* What to expect section */}
        <div
          className="mt-4 p-6 border"
          style={{ borderColor: "hsl(var(--golden) / 0.2)", backgroundColor: "hsl(var(--golden) / 0.04)" }}
        >
          <h4
            className="font-display text-lg mb-3"
            style={{ color: "hsl(var(--golden))" }}
          >
            WHAT TO EXPECT
          </h4>
          <ul className="space-y-2">
            {[
              "A personalised training plan built around your schedule, goals and current level.",
              "Regular check-ins to track progress and adapt the plan.",
              "Direct messaging access for questions and technique feedback.",
              "Video analysis on request for movement and climbing-specific drills.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span style={{ color: "hsl(var(--golden))" }} className="mt-0.5 flex-shrink-0">
                  —
                </span>
                <span className="font-body text-sm text-white/60 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="font-body text-xs text-center text-white/30 mt-8">
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
