import { Link } from "react-router-dom";

const testimonials = [
  {
    quote:
      "I'VE ONLY BEEN WORKING WITH KAIZEN FOR THE PAST 2.5 MONTHS AND I CAN SEE INCREDIBLE IMPROVEMENTS IN STRENGTH AND ENDURANCE. OFF THE WALL I AM NOW CONSISTENTLY DOING 1 ARMERS, RING MUSCLE UPS, HOLDING LOCK OFFS AND MY WEIGHTED PULL UPS ARE UP TO 80% BODYWEIGHT!",
    name: "Abdul",
    detail: "Saudi Arabia",
  },
  {
    quote:
      "IT FELT GREAT TO WORK ON MY FINGER STRENGTH WITH SOME SOLID STRUCTURE PROVIDED BY THE KAIZEN TEAM, AND MAKE GOOD GAINS IN A FAIRLY SHORT TIME, CUTTING IN HALF THE ASSISTING WEIGHT I WAS USING AT THE BEGINNING OF THE PLAN.",
    name: "Alessio",
    detail: "London",
  },
  {
    quote:
      "THE SATISFACTION WASN'T IN THE GRADES I HAVE REACHED BUT THE FEELING OF IMPROVING MORE AND MORE ON DIFFERENT TERRAIN. THE TRAINING WAS BASED ON SCIENCE, CAREFULLY CONSIDERED - NOT SIMPLY BEING TOLD TO PULL UNTIL YOU'RE DEAD MATE.",
    name: "Andrea Milani",
    detail: "Italy",
  },
];

const kaizenBullets = [
  "Online coaching / mentoring",
  "Initial consultation call",
  "Fully personalized training programme",
  "Day by day session plans: structured climbing sessions, fingerboarding, campusing, strength + conditioning",
  "Support via instant messaging",
  "£200 every 4 weeks / 12 week minimum",
];

const peakBullets = [
  "One off 6 week personalised training programme",
  "Day by day session plans",
  "Weekly email support",
  "£200 for the plan",
];

const HERO_IMAGE = "https://images.squarespace-cdn.com/content/v1/5eecbef0263fed5b408a2c0f/9ec57a7a-cd1d-47f3-b6a7-741d64c98ed9/Buster_ActionDirecte-8.jpg";
const BIO_IMAGE = "https://images.squarespace-cdn.com/content/v1/5eecbef0263fed5b408a2c0f/c352d997-4cbd-4edc-b788-3d3a5247238d/Topless_austria_resized_compressed.jpg";

const HomePage = () => {
  return (
    <main style={{ backgroundColor: "hsl(var(--void-black))" }}>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-end overflow-hidden scanlines">
        <img
          src={HERO_IMAGE}
          alt="Buster Martin climbing Action Directe"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.35) saturate(0.7) contrast(1.2)" }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--neon-green) / 0.05) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--neon-green) / 0.05) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            zIndex: 1,
          }}
        />
        {/* Bottom gradient fade */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, hsl(var(--void-black)) 0%, transparent 60%)",
            zIndex: 2,
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pb-20 pt-32">
          {/* Tag line */}
          <p
            className="font-mono text-xs tracking-[0.3em] mb-4"
            style={{ color: "hsl(var(--neon-green))" }}
          >
            // KAIZEN_CLIMBING_COACHING.EXE
          </p>

          <h1
            className="font-display text-5xl sm:text-7xl lg:text-8xl leading-none mb-8 glow-green"
            style={{ color: "hsl(var(--chalk-white))" }}
          >
            SEND IT.<br />
            <span style={{ color: "hsl(var(--neon-green))" }}>LEVEL UP.</span>
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 items-start mb-16">
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
              "Evidence-based remote coaching",
              "Delivered by Buster Martin",
              "Coach to Olympians + everyday climbers",
            ].map((text, i) => (
              <div
                key={i}
                className="px-4 py-2 font-mono text-xs tracking-wider"
                style={{
                  border: "2px solid hsl(var(--neon-orange))",
                  color: "hsl(var(--neon-orange))",
                  backgroundColor: "hsl(var(--void-black) / 0.8)",
                }}
              >
                [{text}]
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div
        className="stripe-border-top py-6 overflow-hidden"
        style={{ backgroundColor: "hsl(var(--void-dark))" }}
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
                className="font-display text-3xl glow-orange"
                style={{ color: "hsl(var(--neon-orange))" }}
              >
                {stat}
              </div>
              <div
                className="font-mono text-xs tracking-widest mt-1"
                style={{ color: "hsl(var(--chalk-white) / 0.5)" }}
              >
                {label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── BIO ── */}
      <section
        className="py-24"
        style={{ backgroundColor: "hsl(var(--void-mid))" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Portrait with border frame */}
            <div className="lg:w-2/5 flex-shrink-0 relative">
              <div
                className="absolute -top-3 -left-3 w-full h-full"
                style={{ border: "3px solid hsl(var(--neon-green))", zIndex: 0 }}
              />
              <img
                src={BIO_IMAGE}
                alt="Buster Martin - Head Coach"
                className="w-full object-cover relative z-10"
                style={{ maxHeight: "600px", objectPosition: "top", filter: "contrast(1.1) saturate(0.9)" }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 px-4 py-3 z-20"
                style={{ backgroundColor: "hsl(var(--void-black) / 0.9)", borderTop: "3px solid hsl(var(--neon-green))" }}
              >
                <p className="font-display text-xs" style={{ color: "hsl(var(--neon-green))" }}>
                  BUSTER MARTIN // HEAD COACH
                </p>
              </div>
            </div>

            {/* Text */}
            <div className="lg:w-3/5">
              <p
                className="font-mono text-xs tracking-[0.3em] mb-3"
                style={{ color: "hsl(var(--neon-orange))" }}
              >
                // ABOUT.TXT
              </p>
              <h2
                className="font-display text-4xl sm:text-5xl leading-tight mb-6"
                style={{ color: "hsl(var(--chalk-white))" }}
              >
                COACH FIRST.<br />
                <span style={{ color: "hsl(var(--neon-green))" }}>CLIMBER SECOND.</span>
              </h2>
              <div className="space-y-4 font-mono text-sm leading-relaxed" style={{ color: "hsl(var(--chalk-white) / 0.75)" }}>
                <p>
                  I've been relentlessly studying the science and art of training for climbing for as long as I can remember — committed to sharing lessons from 20 years of climbing and 15 years of plan writing in a no-nonsense way.
                </p>
                <p>
                  I consolidated personal study and years of experience with a Sports Science degree specialising in sports rehab. Since then I've worked with hundreds of athletes worldwide — multiple Olympians and everyday climbers alike.
                </p>
                <div
                  className="py-4 px-5 my-4"
                  style={{
                    borderLeft: "4px solid hsl(var(--neon-green))",
                    backgroundColor: "hsl(var(--void-black))",
                  }}
                >
                  <p className="font-mono text-xs mb-2" style={{ color: "hsl(var(--neon-green))" }}>
                    // PERSONAL_BESTS.LOG
                  </p>
                  <ul className="space-y-1 font-mono text-sm" style={{ color: "hsl(var(--chalk-white))" }}>
                    {["4 × 9a+ routes", "Action Directe 9a", "Hubble 9a", "8B+ boulders", "8b+ flashes"].map(a => (
                      <li key={a} className="flex gap-2">
                        <span style={{ color: "hsl(var(--neon-orange))" }}>→</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <Link to="/plans" className="btn-neon inline-block mt-8 px-8 py-4">
                VIEW COACHING PLANS
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── PLANS PREVIEW ── */}
      <section
        className="py-24"
        style={{ backgroundColor: "hsl(var(--void-dark))" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <p
            className="font-mono text-xs tracking-[0.3em] mb-3"
            style={{ color: "hsl(var(--neon-orange))" }}
          >
            // COACHING_PLANS.DAT
          </p>
          <h2
            className="font-display text-4xl sm:text-5xl leading-none mb-12"
            style={{ color: "hsl(var(--chalk-white))" }}
          >
            CHOOSE YOUR <span style={{ color: "hsl(var(--neon-green))" }}>PROGRAMME</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Kaizen Plan */}
            <div className="plan-card-retro">
              <p className="font-mono text-xs tracking-widest mb-2" style={{ color: "hsl(var(--neon-orange))" }}>
                [PLAN_01]
              </p>
              <h3
                className="font-display text-3xl leading-tight mb-1"
                style={{ color: "hsl(var(--neon-green))" }}
              >
                THE KAIZEN PLAN
              </h3>
              <p className="font-mono text-xs uppercase tracking-wider mb-6" style={{ color: "hsl(var(--chalk-white) / 0.5)" }}>
                Ongoing Remote Coaching
              </p>
              <ul className="space-y-3 mb-8">
                {kaizenBullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 font-mono text-xs">
                    <span style={{ color: "hsl(var(--neon-green))" }} className="flex-shrink-0">►</span>
                    <span style={{ color: "hsl(var(--chalk-white) / 0.8)" }}>{b}</span>
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="btn-outline-neon inline-block">
                CONTACT US TO START
              </Link>
            </div>

            {/* 6 Week Peak Plan */}
            <div
              className="plan-card-retro"
              style={{ borderColor: "hsl(var(--neon-orange))" }}
            >
              <p className="font-mono text-xs tracking-widest mb-2" style={{ color: "hsl(var(--neon-orange))" }}>
                [PLAN_02]
              </p>
              <h3
                className="font-display text-3xl leading-tight mb-1"
                style={{ color: "hsl(var(--neon-orange))" }}
              >
                6 WEEK PEAK PLAN
              </h3>
              <p className="font-mono text-xs uppercase tracking-wider mb-6" style={{ color: "hsl(var(--chalk-white) / 0.5)" }}>
                Fixed-Term Performance Programme
              </p>
              <ul className="space-y-3 mb-8">
                {peakBullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 font-mono text-xs">
                    <span style={{ color: "hsl(var(--neon-orange))" }} className="flex-shrink-0">►</span>
                    <span style={{ color: "hsl(var(--chalk-white) / 0.8)" }}>{b}</span>
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="btn-outline-orange inline-block">
                CONTACT US TO START
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
          borderTop: "3px solid hsl(var(--neon-green))",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <p
            className="font-mono text-xs tracking-[0.3em] mb-3"
            style={{ color: "hsl(var(--neon-green))" }}
          >
            // TESTIMONIALS.LOG
          </p>
          <h2
            className="font-display text-4xl sm:text-5xl leading-none mb-12"
            style={{ color: "hsl(var(--chalk-white))" }}
          >
            WHAT PEOPLE<br />
            <span style={{ color: "hsl(var(--neon-orange))" }}>ARE SAYING</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="p-6"
                style={{
                  backgroundColor: "hsl(var(--void-mid))",
                  border: "2px solid hsl(var(--void-light))",
                  borderTop: `3px solid hsl(var(${i % 2 === 0 ? "--neon-green" : "--neon-orange"}))`,
                }}
              >
                <p
                  className="font-mono text-xs leading-relaxed mb-6"
                  style={{ color: "hsl(var(--chalk-white) / 0.7)" }}
                >
                  "{t.quote}"
                </p>
                <div>
                  <p
                    className="font-display text-sm"
                    style={{ color: "hsl(var(--chalk-white))" }}
                  >
                    {t.name}
                  </p>
                  <p
                    className="font-mono text-xs mt-0.5"
                    style={{ color: "hsl(var(--neon-green))" }}
                  >
                    [{t.detail}]
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <footer
        className="py-16 text-center"
        style={{
          backgroundColor: "hsl(var(--void-mid))",
          borderTop: "3px solid hsl(var(--neon-orange))",
        }}
      >
        <p
          className="font-mono text-xs tracking-[0.3em] mb-4"
          style={{ color: "hsl(var(--neon-orange))" }}
        >
          // READY_TO_SEND.EXE
        </p>
        <h3
          className="font-display text-4xl sm:text-5xl mb-4 glow-green"
          style={{ color: "hsl(var(--neon-green))" }}
        >
          READY TO LEVEL UP?
        </h3>
        <p
          className="font-mono text-sm mb-8 max-w-md mx-auto"
          style={{ color: "hsl(var(--chalk-white) / 0.6)" }}
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
          © {new Date().getFullYear()} KAIZEN_CLIMBING_COACHING // ALL RIGHTS RESERVED //
          {" "}<Link to="/terms" className="underline hover:opacity-70 transition-opacity">TERMS &amp; CONDITIONS</Link>
        </div>
      </footer>
    </main>
  );
};

export default HomePage;
