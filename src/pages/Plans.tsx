import { Link } from "react-router-dom";

const PlansPage = () => {
  return (
    <main style={{ backgroundColor: "hsl(var(--void-black))" }}>

      {/* ── HERO ── */}
      <section
        className="pt-28 pb-16"
        style={{
          backgroundColor: "hsl(var(--void-dark))",
          borderBottom: "3px solid hsl(var(--neon-green))",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <p
            className="font-mono text-xs tracking-[0.3em] mb-3"
            style={{ color: "hsl(var(--neon-orange))" }}
          >
            // PLANS_AND_COACHING.DAT
          </p>
          <h1
            className="font-display text-5xl sm:text-7xl leading-none mb-4 glow-green"
            style={{ color: "hsl(var(--chalk-white))" }}
          >
            PLANS &amp;<br />
            <span style={{ color: "hsl(var(--neon-green))" }}>COACHING</span>
          </h1>
          <div
            className="w-32 h-1 mt-4"
            style={{
              background: "linear-gradient(90deg, hsl(var(--neon-green)), hsl(var(--neon-orange)))",
            }}
          />
        </div>
      </section>

      {/* ── INTRO ── */}
      <section
        className="py-20"
        style={{ backgroundColor: "hsl(var(--void-mid))" }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <div
            className="p-8"
            style={{
              border: "2px solid hsl(var(--neon-green))",
              backgroundColor: "hsl(var(--void-black))",
            }}
          >
            <p
              className="font-mono text-xs tracking-[0.3em] mb-4"
              style={{ color: "hsl(var(--neon-green))" }}
            >
              // MISSION_BRIEF.TXT
            </p>
            <p
              className="font-mono text-base leading-relaxed mb-6"
              style={{ color: "hsl(var(--chalk-white))" }}
            >
              At Kaizen we understand the importance of combining evidence-based science and experience. Our plans and coaching aim to improve all aspects of climbing performance — movement, mindset, and the physical aspects such as strength, power and energy systems.
            </p>
            <div className="space-y-4 font-mono text-sm leading-relaxed" style={{ color: "hsl(var(--chalk-white) / 0.7)" }}>
              <p>
                Each plan and session is truly personalised around you. Designed to take into account your goals, facilities, lifestyle, current ability, strengths and weaknesses, and personality.
              </p>
              <p>
                Experience has taught us that there is no one-size-fits-all approach. The Kaizen team will become your coaches and mentors — on hand to guide you through your training and progress as a climber.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TWO PLANS ── */}
      <section
        className="py-20"
        style={{ backgroundColor: "hsl(var(--void-dark))" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <p
            className="font-mono text-xs tracking-[0.3em] mb-3"
            style={{ color: "hsl(var(--neon-orange))" }}
          >
            // SELECT_PROGRAMME.EXE
          </p>
          <h2
            className="font-display text-4xl sm:text-5xl leading-none mb-12"
            style={{ color: "hsl(var(--chalk-white))" }}
          >
            CHOOSE YOUR <span style={{ color: "hsl(var(--neon-green))" }}>PLAN</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6 items-start">

            {/* Kaizen Plan */}
            <div
              className="h-full flex flex-col p-8"
              style={{
                backgroundColor: "hsl(var(--void-mid))",
                border: "3px solid hsl(var(--neon-green))",
              }}
            >
              <div className="mb-6">
                <p className="font-mono text-xs tracking-widest mb-2" style={{ color: "hsl(var(--neon-orange))" }}>
                  [PLAN_01 // ONGOING]
                </p>
                <h3
                  className="font-display text-3xl leading-tight mb-1 glow-green"
                  style={{ color: "hsl(var(--neon-green))" }}
                >
                  THE KAIZEN PLAN
                </h3>
                <p
                  className="font-mono text-xs uppercase tracking-wider"
                  style={{ color: "hsl(var(--chalk-white) / 0.5)" }}
                >
                  Ongoing Remote Coaching
                </p>
              </div>
              <div className="font-mono text-xs leading-relaxed mb-8 flex-1 space-y-4" style={{ color: "hsl(var(--chalk-white) / 0.8)" }}>
                <p>
                  If you're serious about taking the next step in your climbing and making long-term gains — this is the plan for you. Unrivaled levels of support, experience, and a truly personal training and coaching service including:
                </p>
                <ul className="space-y-2">
                  {[
                    "Online coaching / mentoring",
                    "Initial consultation call",
                    "Fully personalized training programme",
                    "Day by day session plans: climbing, fingerboarding, campusing, S&C",
                    "Support via instant messaging",
                  ].map((b, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span style={{ color: "hsl(var(--neon-green))" }} className="flex-shrink-0">►</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <p
                  className="font-display text-sm pt-2"
                  style={{ color: "hsl(var(--neon-green))" }}
                >
                  £200 / 4 WEEKS // 12 WEEK MINIMUM
                </p>
              </div>
              <div
                className="border-t pt-6 mt-auto"
                style={{ borderColor: "hsl(var(--void-light))" }}
              >
                <Link to="/contact" className="btn-outline-neon inline-block">
                  CONTACT US TO START
                </Link>
              </div>
            </div>

            {/* 6 Week Peak Plan */}
            <div
              className="h-full flex flex-col p-8"
              style={{
                backgroundColor: "hsl(var(--void-mid))",
                border: "3px solid hsl(var(--neon-orange))",
              }}
            >
              <div className="mb-6">
                <p className="font-mono text-xs tracking-widest mb-2" style={{ color: "hsl(var(--neon-orange))" }}>
                  [PLAN_02 // FIXED-TERM]
                </p>
                <h3
                  className="font-display text-3xl leading-tight mb-1 glow-orange"
                  style={{ color: "hsl(var(--neon-orange))" }}
                >
                  6 WEEK PEAK PLAN
                </h3>
                <p
                  className="font-mono text-xs uppercase tracking-wider"
                  style={{ color: "hsl(var(--chalk-white) / 0.5)" }}
                >
                  Fixed-Term Performance Programme
                </p>
              </div>
              <div className="font-mono text-xs leading-relaxed mb-8 flex-1 space-y-4" style={{ color: "hsl(var(--chalk-white) / 0.8)" }}>
                <p>
                  A one-off plan to help you peak for a trip, achieve a short-term goal, or try our coaching before moving onto the main Kaizen plan.
                </p>
                <ul className="space-y-2">
                  {[
                    "One off 6 week personalised training programme",
                    "Day by day session plans: climbing, fingerboarding, campusing, S&C",
                    "Weekly email support",
                  ].map((b, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span style={{ color: "hsl(var(--neon-orange))" }} className="flex-shrink-0">►</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <p
                  className="font-display text-sm pt-2"
                  style={{ color: "hsl(var(--neon-orange))" }}
                >
                  £200 // ONE TIME
                </p>
              </div>
              <div
                className="border-t pt-6 mt-auto"
                style={{ borderColor: "hsl(var(--void-light))" }}
              >
                <Link to="/contact" className="btn-outline-orange inline-block">
                  CONTACT US TO START
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="py-16"
        style={{
          backgroundColor: "hsl(var(--void-black))",
          borderTop: "3px solid hsl(var(--neon-orange))",
        }}
      >
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <p
              className="font-mono text-xs tracking-[0.3em] mb-2"
              style={{ color: "hsl(var(--neon-orange))" }}
            >
              // NOT_SURE.QUERY
            </p>
            <h2
              className="font-display text-3xl sm:text-4xl leading-tight mb-3"
              style={{ color: "hsl(var(--chalk-white))" }}
            >
              NOT SURE WHICH<br />
              <span style={{ color: "hsl(var(--neon-green))" }}>PLAN?</span>
            </h2>
            <p
              className="font-mono text-sm leading-relaxed max-w-md"
              style={{ color: "hsl(var(--chalk-white) / 0.6)" }}
            >
              Book a free initial consultation call with Buster. We'll talk through your goals, current level and lifestyle — no commitment required.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link to="/contact" className="btn-neon px-10 py-4">
              GET IN TOUCH
            </Link>
          </div>
        </div>
      </section>

      <footer
        className="py-8 text-center"
        style={{ backgroundColor: "hsl(var(--void-dark))", borderTop: "1px solid hsl(var(--void-light))" }}
      >
        <div className="font-mono text-xs" style={{ color: "hsl(var(--chalk-white) / 0.3)" }}>
          © {new Date().getFullYear()} KAIZEN_CLIMBING_COACHING // ALL RIGHTS RESERVED
        </div>
      </footer>
    </main>
  );
};

export default PlansPage;
