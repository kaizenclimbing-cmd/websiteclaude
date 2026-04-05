import { Link } from "react-router-dom";
import SixWeekModal from "@/components/SixWeekModal";
import { useState } from "react";

const BIO_IMAGE = "https://images.squarespace-cdn.com/content/v1/5eecbef0263fed5b408a2c0f/c352d997-4cbd-4edc-b788-3d3a5247238d/Topless_austria_resized_compressed.jpg";

const kaizenBullets = [
  "Initial onboarding call to understand your goals, history and lifestyle",
  "Fully personalised training programme — built around you, not a template",
  "Day-by-day session plans: structured climbing, fingerboarding, campusing, strength & conditioning",
  "Ongoing support via instant messaging — feedback, plan adjustments, advice",
  "Coach in your corner for the full 12 weeks",
  "£200 every 4 weeks — £600 total",
];

const peakBullets = [
  "One-off 6-week personalised training programme",
  "Day-by-day session plans: climbing, fingerboarding, campusing, strength & conditioning",
  "Weekly email support throughout",
  "£200 one-off payment",
];

const testimonials = [
  {
    quote: "I've only been working with Kaizen for the past 2.5 months and I can see incredible improvements in strength and endurance. Their structured and personalised plans are no joke. I've improved a lot. Off the wall I am now consistently doing 1 armers, ring muscle ups, holding lock offs and my weighted pull ups are up to 80% bodyweight!",
    name: "Abdul",
    detail: "Saudi Arabia",
  },
  {
    quote: "Thanks to Buster helping me to manage and fit in my training, I feel like another climber. With an open and trusting coach-athlete relationship, the sharing of everything, and regular communication all underpinned great improvements for me. A real game changer. The training was based on science, carefully considered — not simply being told to pull until you're dead mate.",
    name: "Andrea Milani",
    detail: "Italy",
  },
  {
    quote: "It felt great to work on my finger strength with some solid structure provided by the Kaizen team, and make good gains in a fairly short time, cutting in half the assisting weight I was using at the beginning of the plan.",
    name: "Alessio",
    detail: "London",
  },
];

const CoachingPage = () => {
  const [sixWeekModalOpen, setSixWeekModalOpen] = useState(false);

  return (
    <main style={{ backgroundColor: "hsl(var(--void-black))" }}>
      <SixWeekModal open={sixWeekModalOpen} onClose={() => setSixWeekModalOpen(false)} />

      <div className="pt-16" />

      {/* ── INTRO ── */}
      <section className="py-24" style={{ backgroundColor: "hsl(var(--void-dark))" }}>
        <div className="max-w-7xl mx-auto px-6">
          <p
            className="font-mono text-xs tracking-[0.25em] mb-3"
            style={{ color: "hsl(var(--neon-orange))" }}
          >
            // COACHING
          </p>
          <h1
            className="font-display text-3xl sm:text-5xl leading-tight mb-6 max-w-3xl"
            style={{ color: "hsl(var(--chalk-white))" }}
          >
            Coaching that's built around you — not a template.
          </h1>
          <p
            className="font-mono text-sm leading-relaxed max-w-2xl"
            style={{ color: "hsl(var(--chalk-white) / 0.6)" }}
          >
            Every athlete is different. Different grades, different goals, different lives.
            The only thing that works long-term is a plan that accounts for all of it.
          </p>
        </div>
      </section>

      {/* ── BIO ── */}
      <section className="py-24" style={{ backgroundColor: "hsl(var(--void-mid))" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="lg:w-2/5 flex-shrink-0 relative">
              <div
                className="absolute -top-3 -left-3 w-full h-full"
                style={{ border: "2px solid hsl(var(--neon-green))", zIndex: 0 }}
              />
              <img
                src={BIO_IMAGE}
                alt="Buster Martin — Head Coach"
                className="w-full object-cover relative z-10"
                style={{ maxHeight: "600px", objectPosition: "top", filter: "contrast(1.05) saturate(0.85)" }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 px-4 py-3 z-20"
                style={{
                  backgroundColor: "hsl(var(--void-black) / 0.9)",
                  borderTop: "2px solid hsl(var(--neon-green))",
                }}
              >
                <p className="font-display text-xs" style={{ color: "hsl(var(--neon-green))" }}>
                  BUSTER MARTIN // HEAD COACH
                </p>
              </div>
            </div>

            <div className="lg:w-3/5">
              <p
                className="font-mono text-xs tracking-[0.25em] mb-3"
                style={{ color: "hsl(var(--neon-orange))" }}
              >
                // ABOUT BUSTER
              </p>
              <h2
                className="font-display text-2xl sm:text-3xl leading-tight mb-6"
                style={{ color: "hsl(var(--chalk-white))" }}
              >
                I'm Buster —<br />
                <span style={{ color: "hsl(var(--neon-green))" }}>Coach first,</span> climber second.
              </h2>
              <div className="space-y-4 font-mono text-sm leading-relaxed" style={{ color: "hsl(var(--chalk-white) / 0.7)" }}>
                <p>
                  I've spent 20 years studying the science and art of climbing performance — from the physiology of finger tendons to the psychology of projecting hard routes. And 15 years applying that knowledge as a coach.
                </p>
                <p>
                  I consolidated years of self-directed study and coaching experience with a Sports Science degree specialising in sports rehab. Since then I've worked with hundreds of athletes — multiple Olympians and competition climbers at the highest level, through to everyday climbers juggling work, family, and a passion for the sport.
                </p>
                <p>
                  What I care about most is building plans that actually work in your real life. Not plans that look good on paper and fall apart by week three.
                </p>
                <p>Applying the same principles to my own climbing:</p>
                <div
                  className="py-4 px-5"
                  style={{
                    borderLeft: "3px solid hsl(var(--neon-green))",
                    backgroundColor: "hsl(var(--void-black))",
                  }}
                >
                  <ul className="space-y-1">
                    {["4 × 9a+ routes", "Action Directe 9a", "Hubble 9a", "8B+ boulders", "8b+ flashes"].map(a => (
                      <li key={a} className="flex gap-2" style={{ color: "hsl(var(--chalk-white) / 0.85)" }}>
                        <span style={{ color: "hsl(var(--neon-orange))" }}>→</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p>
                  That combination — academic rigour, high-level climbing experience, and an understanding of what it's like to train around a real life — is what I bring to every athlete I work with.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div
        className="py-6"
        style={{
          backgroundColor: "hsl(var(--void-dark))",
          borderTop: "2px solid hsl(var(--neon-green))",
          borderBottom: "2px solid hsl(var(--void-light))",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between gap-6">
          {[
            ["20+", "Years Climbing"],
            ["15+", "Years Coaching"],
            ["100s", "Athletes Worldwide"],
            ["4×", "9a+ Routes"],
            ["8B+", "Boulders"],
          ].map(([stat, label]) => (
            <div key={label} className="text-center">
              <div className="font-display text-2xl" style={{ color: "hsl(var(--neon-orange))" }}>
                {stat}
              </div>
              <div className="font-mono text-xs tracking-widest mt-1" style={{ color: "hsl(var(--chalk-white) / 0.4)" }}>
                {label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PLANS ── */}
      <section className="py-24" style={{ backgroundColor: "hsl(var(--void-dark))" }}>
        <div className="max-w-7xl mx-auto px-6">
          <p
            className="font-mono text-xs tracking-[0.25em] mb-3"
            style={{ color: "hsl(var(--neon-orange))" }}
          >
            // COACHING OPTIONS
          </p>
          <h2
            className="font-display text-2xl sm:text-3xl mb-12"
            style={{ color: "hsl(var(--chalk-white))" }}
          >
            CHOOSE YOUR PATH
          </h2>
          <div className="grid md:grid-cols-2 gap-6">

            {/* Kaizen Plan */}
            <div className="plan-card-retro">
              <h3 className="font-display text-xl leading-tight mb-1" style={{ color: "hsl(var(--neon-green))" }}>
                THE KAIZEN PLAN
              </h3>
              <p className="font-mono text-xs uppercase tracking-wider mb-6" style={{ color: "hsl(var(--chalk-white) / 0.45)" }}>
                Ongoing Remote Coaching — 12 Weeks
              </p>
              <ul className="space-y-3 mb-8">
                {kaizenBullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 font-mono text-xs">
                    <span style={{ color: "hsl(var(--neon-green))" }} className="flex-shrink-0">►</span>
                    <span style={{ color: "hsl(var(--chalk-white) / 0.75)" }}>{b}</span>
                  </li>
                ))}
              </ul>
              <Link to="/kaizen" className="btn-outline-neon inline-block">
                LEARN MORE & APPLY
              </Link>
            </div>

            {/* 6 Week Peak Plan */}
            <div className="plan-card-retro" style={{ borderColor: "hsl(var(--neon-orange))" }}>
              <h3 className="font-display text-xl leading-tight mb-1" style={{ color: "hsl(var(--neon-orange))" }}>
                6 WEEK PEAK PLAN
              </h3>
              <p className="font-mono text-xs uppercase tracking-wider mb-6" style={{ color: "hsl(var(--chalk-white) / 0.45)" }}>
                Fixed-Term Performance Programme
              </p>
              <ul className="space-y-3 mb-8">
                {peakBullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 font-mono text-xs">
                    <span style={{ color: "hsl(var(--neon-orange))" }} className="flex-shrink-0">►</span>
                    <span style={{ color: "hsl(var(--chalk-white) / 0.75)" }}>{b}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => setSixWeekModalOpen(true)} className="btn-outline-orange">
                GET YOUR PLAN
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section
        className="py-24"
        style={{
          backgroundColor: "hsl(var(--void-black))",
          borderTop: "2px solid hsl(var(--void-light))",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <p
            className="font-mono text-xs tracking-[0.25em] mb-3"
            style={{ color: "hsl(var(--neon-orange))" }}
          >
            // TESTIMONIALS
          </p>
          <h2
            className="font-display text-2xl sm:text-3xl mb-12"
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

      {/* ── CTA ── */}
      <footer
        className="py-16 text-center"
        style={{
          backgroundColor: "hsl(var(--void-mid))",
          borderTop: "2px solid hsl(var(--neon-orange))",
        }}
      >
        <p
          className="font-mono text-xs tracking-[0.25em] mb-4"
          style={{ color: "hsl(var(--neon-orange))" }}
        >
          // READY TO START
        </p>
        <h3
          className="font-display text-2xl sm:text-3xl mb-4"
          style={{ color: "hsl(var(--chalk-white))" }}
        >
          READY TO LEVEL UP?
        </h3>
        <p
          className="font-mono text-sm mb-8 max-w-md mx-auto"
          style={{ color: "hsl(var(--chalk-white) / 0.55)" }}
        >
          Get in touch and let's build a plan around you.
        </p>
        <Link to="/contact" className="btn-neon px-12 py-4 text-base">
          GET IN TOUCH
        </Link>
        <div
          className="mt-12 pt-6 text-xs font-mono"
          style={{
            borderTop: "1px solid hsl(var(--void-light))",
            color: "hsl(var(--chalk-white) / 0.3)",
          }}
        >
          © {new Date().getFullYear()} Kaizen Climbing Coaching. All rights reserved.{" "}
          <Link to="/terms" className="underline hover:opacity-70 transition-opacity">Terms & Conditions</Link>
        </div>
      </footer>

    </main>
  );
};

export default CoachingPage;
