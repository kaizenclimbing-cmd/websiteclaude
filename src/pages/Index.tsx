import { Link } from "react-router-dom";

const testimonials = [
  {
    quote:
      "I've only been working with Kaizen for the past 2.5 months and I can see incredible improvements in strength and endurance. Their structured and personalised plans are no joke. I've improved a lot. Off the wall I am now consistently doing 1 armers, ring muscle ups, holding lock offs and my weighted pull ups are up to 80% bodyweight! I've gained tons of confidence on the wall with their help. Excited for the next phase of training with Kaizen.",
    name: "Abdul",
    detail: "Saudi Arabia",
  },
  {
    quote:
      "It felt great to work on my finger strength with some solid structure provided by the Kaizen team, and make good gains in a fairly short time, cutting in half the assisting weight I was using at the beginning of the plan. The lockdown allowed me to focus on this aspect of my climbing, which I may not have otherwise. Looking forward to making even bigger gains in the future and taking this strength onto the rocks.",
    name: "Alessio",
    detail: "London",
  },
  {
    quote:
      "Thanks to Buster helping me to manage and fit in my training, I feel like another climber. With an open and trusting coach-athlete relationship, the sharing of everything, and regular communication all underpinned great improvements for me. The satisfaction wasn't in the grades I have reached but the feeling of improving more and more on different terrain and on types of routes that I never imagined. A real game changer. The training was based on science, carefully considered — not simply being told to pull until you're dead mate.",
    name: "Andrea Milani",
    detail: "Italy",
  },
];

const kaizenBullets = [
  "Online coaching / mentoring",
  "Initial consultation call",
  "Fully personalized training programme",
  "Day by day session plans: structured climbing sessions, fingerboarding, campusing, strength and conditioning, and more",
  "Support via instant messaging; coach on hand for feedback, plan adjustments and advice",
  "£200 every 4 weeks for a minimum of 12 weeks",
];

const peakBullets = [
  "One off 6 week personalised training programme",
  "Day by day session plans: structured climbing sessions, fingerboarding, campusing, Strength and conditioning, and more",
  "Weekly email support",
  "£200 for the plan",
];

const HERO_IMAGE = "https://images.squarespace-cdn.com/content/v1/5eecbef0263fed5b408a2c0f/9ec57a7a-cd1d-47f3-b6a7-741d64c98ed9/Buster_ActionDirecte-8.jpg";
const BIO_IMAGE = "https://images.squarespace-cdn.com/content/v1/5eecbef0263fed5b408a2c0f/c352d997-4cbd-4edc-b788-3d3a5247238d/Topless_austria_resized_compressed.jpg";

const HomePage = () => {
  return (
    <main style={{ backgroundColor: "hsl(var(--void-black))" }}>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-end overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="Buster Martin climbing Action Directe"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.3) saturate(0.6) contrast(1.1)" }}
        />
        {/* Subtle grid overlay */}
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
            background: "linear-gradient(to top, hsl(var(--void-black)) 0%, transparent 65%)",
            zIndex: 2,
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pb-20 pt-32">
          <p
            className="font-mono text-xs tracking-[0.25em] mb-5"
            style={{ color: "hsl(var(--neon-orange))" }}
          >
            // KAIZEN CLIMBING COACHING
          </p>

          <h1
            className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight mb-10 max-w-2xl"
            style={{ color: "hsl(var(--chalk-white))" }}
          >
            Improve your climbing with the 1-to-1 support of a specialist coach and pro climber.
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 items-start mb-12">
            <Link to="/contact" className="btn-neon px-10 py-4 text-base">
              START YOUR JOURNEY
            </Link>
            <Link to="/plans" className="btn-outline-neon px-10 py-4 text-base">
              VIEW PLANS
            </Link>
          </div>

          {/* Callout tags */}
          <div className="flex flex-wrap gap-3">
            {[
              "Evidence-based Remote coaching, training plans and rehab",
              "Delivered by Buster Martin",
              "Coach to the Pros and everyday climbers",
            ].map((text, i) => (
              <div
                key={i}
                className="px-4 py-2 font-mono text-xs tracking-wide"
                style={{
                  border: "1px solid hsl(var(--neon-orange) / 0.5)",
                  color: "hsl(var(--chalk-white) / 0.7)",
                  backgroundColor: "hsl(var(--void-black) / 0.7)",
                }}
              >
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
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
              <div
                className="font-display text-2xl"
                style={{ color: "hsl(var(--neon-orange))" }}
              >
                {stat}
              </div>
              <div
                className="font-mono text-xs tracking-widest mt-1"
                style={{ color: "hsl(var(--chalk-white) / 0.4)" }}
              >
                {label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── BIO ── */}
      <section className="py-24" style={{ backgroundColor: "hsl(var(--void-mid))" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Portrait */}
            <div className="lg:w-2/5 flex-shrink-0 relative">
              <div
                className="absolute -top-3 -left-3 w-full h-full"
                style={{ border: "2px solid hsl(var(--neon-green))", zIndex: 0 }}
              />
              <img
                src={BIO_IMAGE}
                alt="Buster Martin - Head Coach"
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

            {/* Text */}
            <div className="lg:w-3/5">
              <p
                className="font-mono text-xs tracking-[0.25em] mb-3"
                style={{ color: "hsl(var(--neon-orange))" }}
              >
                // ABOUT
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
                  I've been relentlessly studying the science and art of training for climbing for as long as I can remember and am committed to sharing those lessons from 20 years of climbing and 15 years of plan writing in a no-nonsense way.
                </p>
                <p>
                  I consolidated my personal study and years of experience with a Sports Science degree specialising in sports rehab.
                </p>
                <p>
                  Since then, I've worked with hundreds of athletes from all around the world — multiple Olympians, rock climbers at the highest level, as well as regular climbers of all abilities and from all walks of life.
                </p>
                <p>Applying this knowledge to my own training and climbing too:</p>
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
                  Giving me the unique combination of academic knowledge in coaching and rehab, high-level climbing experience, and an understanding of the realities of juggling life's responsibilities and challenges around training and health.
                </p>
              </div>
              <Link to="/plans" className="btn-neon inline-block mt-8 px-8 py-4">
                VIEW COACHING PLANS
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── PLANS PREVIEW ── */}
      <section className="py-24" style={{ backgroundColor: "hsl(var(--void-dark))" }}>
        <div className="max-w-7xl mx-auto px-6">
          <p
            className="font-mono text-xs tracking-[0.25em] mb-3"
            style={{ color: "hsl(var(--neon-orange))" }}
          >
            // COACHING PLANS
          </p>
          <h2
            className="font-display text-4xl sm:text-5xl leading-none mb-12"
            style={{ color: "hsl(var(--chalk-white))" }}
          >
            COACHING PLANS
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Kaizen Plan */}
            <div className="plan-card-retro">
              <h3 className="font-display text-3xl leading-tight mb-1" style={{ color: "hsl(var(--neon-green))" }}>
                THE KAIZEN PLAN
              </h3>
              <p className="font-mono text-xs uppercase tracking-wider mb-6" style={{ color: "hsl(var(--chalk-white) / 0.45)" }}>
                Ongoing Remote Coaching
              </p>
              <ul className="space-y-3 mb-8">
                {kaizenBullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 font-mono text-xs">
                    <span style={{ color: "hsl(var(--neon-green))" }} className="flex-shrink-0">►</span>
                    <span style={{ color: "hsl(var(--chalk-white) / 0.75)" }}>{b}</span>
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="btn-outline-neon inline-block">
                CONTACT US TO START YOUR PLAN
              </Link>
            </div>

            {/* 6 Week Peak Plan */}
            <div className="plan-card-retro" style={{ borderColor: "hsl(var(--neon-orange))" }}>
              <h3 className="font-display text-3xl leading-tight mb-1" style={{ color: "hsl(var(--neon-orange))" }}>
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
              <Link to="/contact" className="btn-outline-orange inline-block">
                CONTACT US TO START YOUR PLAN
              </Link>
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
            className="font-display text-4xl sm:text-5xl leading-none mb-12"
            style={{ color: "hsl(var(--chalk-white))" }}
          >
            WHAT PEOPLE ARE SAYING
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

      {/* ── FOOTER ── */}
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
          // READY TO SEND
        </p>
        <h3
          className="font-display text-3xl sm:text-4xl mb-4"
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
          GET STARTED TODAY
        </Link>
        <div
          className="mt-12 pt-6 text-xs font-mono"
          style={{
            borderTop: "1px solid hsl(var(--void-light))",
            color: "hsl(var(--chalk-white) / 0.3)",
          }}
        >
          © {new Date().getFullYear()} Kaizen Climbing Coaching. All rights reserved.{" "}
          <Link to="/terms" className="underline hover:opacity-70 transition-opacity">Terms &amp; Conditions</Link>
        </div>
      </footer>
    </main>
  );
};

export default HomePage;
