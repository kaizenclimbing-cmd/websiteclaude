import { Link } from "react-router-dom";

const HERO_IMAGE = "https://images.squarespace-cdn.com/content/v1/5eecbef0263fed5b408a2c0f/9ec57a7a-cd1d-47f3-b6a7-741d64c98ed9/Buster_ActionDirecte-8.jpg";

const included = [
  "Initial onboarding call to understand your goals and build your plan",
  "Fully personalised training programme — built around your life, not a template",
  "Day-by-day session plans: climbing, fingerboarding, campusing, strength & conditioning",
  "Ongoing support via instant messaging — feedback, adjustments, advice",
  "Coach on hand throughout the full 12 weeks",
];

const isForYou = [
  "You're serious about improving and willing to put in the work",
  "You want a plan built specifically for you — not a generic programme",
  "You're ready to commit to 12 weeks of structured training",
  "You're open to being coached and receiving honest feedback",
];

const notForYou = [
  "You're looking for a quick fix or guaranteed grade jumps",
  "You can't commit to regular training sessions",
  "You want a generic plan you can follow without guidance",
];

const testimonials = [
  {
    quote: "I've only been working with Kaizen for the past 2.5 months and I can see incredible improvements in strength and endurance. Their structured and personalised plans are no joke.",
    name: "Abdul",
    detail: "Saudi Arabia",
  },
  {
    quote: "Thanks to Buster helping me to manage and fit in my training, I feel like another climber. A real game changer. The training was based on science, carefully considered.",
    name: "Andrea Milani",
    detail: "Italy",
  },
  {
    quote: "It felt great to work on my finger strength with some solid structure provided by the Kaizen team, and make good gains in a fairly short time.",
    name: "Alessio",
    detail: "London",
  },
];

const KaizenPage = () => {
  return (
    <main style={{ backgroundColor: "hsl(var(--void-black))" }}>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-end overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="Buster Martin climbing"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.25) saturate(0.6) contrast(1.1)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--neon-green) / 0.03) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--neon-green) / 0.03) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            zIndex: 1,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, hsl(var(--void-black)) 0%, transparent 60%)",
            zIndex: 2,
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-6 w-full pb-20 pt-32">
          <p
            className="font-mono text-xs tracking-[0.25em] mb-5"
            style={{ color: "hsl(var(--neon-orange))" }}
          >
            // THE KAIZEN PLAN
          </p>
          <h1
            className="font-display text-3xl sm:text-5xl leading-tight mb-6 max-w-2xl"
            style={{ color: "hsl(var(--chalk-white))" }}
          >
            1-to-1 coaching built entirely around you.
          </h1>
          <p
            className="font-mono text-sm leading-relaxed mb-10 max-w-xl"
            style={{ color: "hsl(var(--chalk-white) / 0.6)" }}
          >
            12 weeks. Fully personalised. A coach in your corner every step of the way.
            £200 every 4 weeks — £600 total.
          </p>
          <Link to="/apply" className="btn-neon px-10 py-4 text-base">
            APPLY NOW
          </Link>
          <p
            className="font-mono text-xs mt-4"
            style={{ color: "hsl(var(--chalk-white) / 0.35)" }}
          >
            Applications reviewed within 48 hours.
          </p>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ── */}
      <section className="py-24" style={{ backgroundColor: "hsl(var(--void-dark))" }}>
        <div className="max-w-4xl mx-auto px-6">
          <p
            className="font-mono text-xs tracking-[0.25em] mb-3"
            style={{ color: "hsl(var(--neon-orange))" }}
          >
            // WHAT YOU GET
          </p>
          <h2
            className="font-display text-2xl sm:text-3xl mb-10"
            style={{ color: "hsl(var(--chalk-white))" }}
          >
            WHAT'S INCLUDED
          </h2>
          <ul className="space-y-4">
            {included.map((item, i) => (
              <li key={i} className="flex items-start gap-4">
                <span
                  className="font-mono text-sm flex-shrink-0 mt-0.5"
                  style={{ color: "hsl(var(--neon-green))" }}
                >
                  ►
                </span>
                <span
                  className="font-mono text-sm leading-relaxed"
                  style={{ color: "hsl(var(--chalk-white) / 0.75)" }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
          <div
            className="mt-10 p-6"
            style={{
              backgroundColor: "hsl(var(--void-black))",
              border: "1px solid hsl(var(--neon-green) / 0.3)",
              borderLeft: "3px solid hsl(var(--neon-green))",
            }}
          >
            <p className="font-display text-xl mb-1" style={{ color: "hsl(var(--neon-green))" }}>
              £200 every 4 weeks
            </p>
            <p className="font-mono text-xs" style={{ color: "hsl(var(--chalk-white) / 0.45)" }}>
              Minimum 12-week commitment — £600 total. Pay in full or in 3 instalments.
            </p>
          </div>
        </div>
      </section>

      {/* ── IS THIS FOR YOU ── */}
      <section className="py-24" style={{ backgroundColor: "hsl(var(--void-mid))" }}>
        <div className="max-w-4xl mx-auto px-6">
          <p
            className="font-mono text-xs tracking-[0.25em] mb-3"
            style={{ color: "hsl(var(--neon-orange))" }}
          >
            // ELIGIBILITY
          </p>
          <h2
            className="font-display text-2xl sm:text-3xl mb-10"
            style={{ color: "hsl(var(--chalk-white))" }}
          >
            IS THIS FOR YOU?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p
                className="font-mono text-xs tracking-widest mb-5"
                style={{ color: "hsl(var(--neon-green))" }}
              >
                THIS IS FOR YOU IF...
              </p>
              <ul className="space-y-3">
                {isForYou.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span style={{ color: "hsl(var(--neon-green))" }} className="flex-shrink-0">✓</span>
                    <span className="font-mono text-xs leading-relaxed" style={{ color: "hsl(var(--chalk-white) / 0.7)" }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p
                className="font-mono text-xs tracking-widest mb-5"
                style={{ color: "hsl(var(--neon-orange))" }}
              >
                THIS IS NOT FOR YOU IF...
              </p>
              <ul className="space-y-3">
                {notForYou.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span style={{ color: "hsl(var(--neon-orange))" }} className="flex-shrink-0">✗</span>
                    <span className="font-mono text-xs leading-relaxed" style={{ color: "hsl(var(--chalk-white) / 0.7)" }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24" style={{ backgroundColor: "hsl(var(--void-dark))" }}>
        <div className="max-w-4xl mx-auto px-6">
          <p
            className="font-mono text-xs tracking-[0.25em] mb-3"
            style={{ color: "hsl(var(--neon-orange))" }}
          >
            // PROCESS
          </p>
          <h2
            className="font-display text-2xl sm:text-3xl mb-10"
            style={{ color: "hsl(var(--chalk-white))" }}
          >
            HOW IT WORKS
          </h2>
          <div className="space-y-6">
            {[
              { step: "01", title: "Apply", desc: "Fill out a short application. Takes 2 minutes. No account needed." },
              { step: "02", title: "Review", desc: "I review your application within 48 hours and reach out personally." },
              { step: "03", title: "Discovery Call", desc: "We have a 30–45 minute call to confirm fit and talk through your goals." },
              { step: "04", title: "Payment", desc: "If we're both in, you pay. Full payment or 3 instalments — your choice." },
              { step: "05", title: "We get to work", desc: "You create your account, complete the onboarding form, and your plan is built." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-6 items-start">
                <span
                  className="font-display text-3xl flex-shrink-0 w-12"
                  style={{ color: "hsl(var(--neon-green) / 0.3)" }}
                >
                  {step}
                </span>
                <div>
                  <p className="font-display text-base mb-1" style={{ color: "hsl(var(--chalk-white))" }}>
                    {title}
                  </p>
                  <p className="font-mono text-xs leading-relaxed" style={{ color: "hsl(var(--chalk-white) / 0.55)" }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24" style={{ backgroundColor: "hsl(var(--void-black))" }}>
        <div className="max-w-4xl mx-auto px-6">
          <p
            className="font-mono text-xs tracking-[0.25em] mb-3"
            style={{ color: "hsl(var(--neon-orange))" }}
          >
            // RESULTS
          </p>
          <h2
            className="font-display text-2xl sm:text-3xl mb-10"
            style={{ color: "hsl(var(--chalk-white))" }}
          >
            WHAT ATHLETES SAY
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="p-6"
                style={{
                  backgroundColor: "hsl(var(--void-mid))",
                  border: "1px solid hsl(var(--void-light))",
                  borderTop: `2px solid hsl(var(${i % 2 === 0 ? "--neon-green" : "--neon-orange"}))`,
                }}
              >
                <p
                  className="font-mono text-xs leading-relaxed mb-6"
                  style={{ color: "hsl(var(--chalk-white) / 0.65)" }}
                >
                  "{t.quote}"
                </p>
                <div>
                  <p className="font-display text-sm" style={{ color: "hsl(var(--chalk-white))" }}>
                    {t.name}
                  </p>
                  <p className="font-mono text-xs mt-0.5" style={{ color: "hsl(var(--neon-green))" }}>
                    [{t.detail}]
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPLY CTA ── */}
      <section
        className="py-20 text-center"
        style={{
          backgroundColor: "hsl(var(--void-mid))",
          borderTop: "2px solid hsl(var(--neon-orange))",
        }}
      >
        <div className="max-w-xl mx-auto px-6">
          <p
            className="font-mono text-xs tracking-[0.25em] mb-4"
            style={{ color: "hsl(var(--neon-orange))" }}
          >
            // READY?
          </p>
          <h3
            className="font-display text-2xl sm:text-3xl mb-4"
            style={{ color: "hsl(var(--chalk-white))" }}
          >
            APPLY FOR THE KAIZEN PLAN
          </h3>
          <p
            className="font-mono text-sm mb-8"
            style={{ color: "hsl(var(--chalk-white) / 0.5)" }}
          >
            Applications reviewed within 48 hours. Only a small number of athletes are taken on each intake.
          </p>
          <Link to="/apply" className="btn-neon px-12 py-4 text-base">
            APPLY NOW
          </Link>
          <p className="font-mono text-xs mt-6" style={{ color: "hsl(var(--chalk-white) / 0.3)" }}>
            © {new Date().getFullYear()} Kaizen Climbing Coaching.{" "}
            <Link to="/terms" className="underline hover:opacity-70 transition-opacity">Terms</Link>
          </p>
        </div>
      </section>

    </main>
  );
};

export default KaizenPage;
