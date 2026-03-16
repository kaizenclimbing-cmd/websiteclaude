import { Link } from "react-router-dom";

const PlansPage = () => {
  return (
    <main style={{ backgroundColor: "hsl(var(--void-black))" }}>

      {/* ── HERO ── */}
      <section
        className="pt-28 pb-16"
        style={{
          backgroundColor: "hsl(var(--void-dark))",
          borderBottom: "2px solid hsl(var(--neon-green))",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <p
            className="font-mono text-xs tracking-[0.25em] mb-3"
            style={{ color: "hsl(var(--neon-orange))" }}
          >
            // PLANS AND COACHING
          </p>
          <h1
            className="font-display text-5xl sm:text-7xl leading-none mb-4"
            style={{ color: "hsl(var(--chalk-white))" }}
          >
            Plans and Coaching
          </h1>
          <div
            className="w-24 h-0.5 mt-4"
            style={{ backgroundColor: "hsl(var(--neon-green))" }}
          />
        </div>
      </section>

      {/* ── INTRO ── */}
      <section className="py-20" style={{ backgroundColor: "hsl(var(--void-mid))" }}>
        <div className="max-w-4xl mx-auto px-6">
          <p
            className="font-mono text-base leading-relaxed font-semibold mb-8"
            style={{ color: "hsl(var(--chalk-white))" }}
          >
            At Kaizen we understand the importance of combining evidence-based science and experience. Our plans and coaching aim to improve all aspects of climbing performance; movement, mindset and of course the physical aspects of climbing performance such as strength, power and energy systems.
          </p>
          <div className="space-y-5 font-mono text-sm leading-relaxed" style={{ color: "hsl(var(--chalk-white) / 0.65)" }}>
            <p>
              Each plan and session is truly personalised around you. They are designed to take into account your goals, facilities/equipment, lifestyle/time available, current ability, strengths and weaknesses, personal preferences and personality.
            </p>
            <p>
              Experience has taught us that there is no one size fits all approach or formula to improving climbing performance. It has also helped us find the equilibrium between the science and art of training for climbing and making long term improvement. This can't be done with a simple training plan, which is why we are offering not only very personalised plans but online coaching and mentoring too.
            </p>
            <p>
              The Kaizen team will become your coaches and mentors, on hand to guide you through your training and progress as a climber.
            </p>
          </div>
        </div>
      </section>

      {/* ── TWO PLANS ── */}
      <section className="py-20" style={{ backgroundColor: "hsl(var(--void-dark))" }}>
        <div className="max-w-7xl mx-auto px-6">
          <p
            className="font-mono text-xs tracking-[0.25em] mb-3"
            style={{ color: "hsl(var(--neon-orange))" }}
          >
            // SELECT YOUR PLAN
          </p>
          <h2
            className="font-display text-4xl sm:text-5xl leading-none mb-12"
            style={{ color: "hsl(var(--chalk-white))" }}
          >
            CHOOSE YOUR PLAN
          </h2>
          <div className="grid md:grid-cols-2 gap-6 items-start">

            {/* Kaizen Plan */}
            <div
              className="h-full flex flex-col p-8"
              style={{
                backgroundColor: "hsl(var(--void-mid))",
                border: "2px solid hsl(var(--neon-green))",
              }}
            >
              <div className="mb-6">
                <p className="font-mono text-xs tracking-widest mb-2" style={{ color: "hsl(var(--neon-orange))" }}>
                  [PLAN 01]
                </p>
                <h3
                  className="font-display text-3xl leading-tight mb-1"
                  style={{ color: "hsl(var(--neon-green))" }}
                >
                  THE KAIZEN PLAN
                </h3>
                <p className="font-mono text-xs uppercase tracking-wider" style={{ color: "hsl(var(--chalk-white) / 0.45)" }}>
                  Ongoing Remote Coaching
                </p>
              </div>
              <div className="font-mono text-sm leading-relaxed mb-8 flex-1 space-y-4" style={{ color: "hsl(var(--chalk-white) / 0.75)" }}>
                <p>
                  If you're serious about taking the next step in your climbing and making long-term gains then this is the plan for you. The Kaizen plan is our most comprehensive training plan. Whether you have a specific goal or are looking for general long term improvement, the kaizen plan offers unrivaled levels of support and experience and a truly personal training plan and coaching service including:
                </p>
                <ul className="space-y-2">
                  {[
                    "Online coaching / mentoring",
                    "Initial consultation call",
                    "Fully personalized training programme",
                    "Day by day session plans: structured climbing sessions, fingerboarding, campusing, strength and conditioning, and more",
                    "Support via instant messaging; coach on hand for feedback, plan adjustments and advice",
                  ].map((b, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs">
                      <span style={{ color: "hsl(var(--neon-green))" }} className="flex-shrink-0">►</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <p className="font-mono text-sm" style={{ color: "hsl(var(--neon-green))" }}>
                  £200 every 4 weeks for a minimum of 12 weeks.
                </p>
              </div>
              <div className="border-t pt-6 mt-auto" style={{ borderColor: "hsl(var(--void-light))" }}>
                <Link to="/contact" className="btn-outline-neon inline-block">
                  CONTACT US TO START YOUR PLAN
                </Link>
              </div>
            </div>

            {/* 6 Week Peak Plan */}
            <div
              className="h-full flex flex-col p-8"
              style={{
                backgroundColor: "hsl(var(--void-mid))",
                border: "2px solid hsl(var(--neon-orange))",
              }}
            >
              <div className="mb-6">
                <p className="font-mono text-xs tracking-widest mb-2" style={{ color: "hsl(var(--neon-orange))" }}>
                  [PLAN 02]
                </p>
                <h3
                  className="font-display text-3xl leading-tight mb-1"
                  style={{ color: "hsl(var(--neon-orange))" }}
                >
                  6 WEEK PEAK PLAN
                </h3>
                <p className="font-mono text-xs uppercase tracking-wider" style={{ color: "hsl(var(--chalk-white) / 0.45)" }}>
                  Fixed-Term Performance Programme
                </p>
              </div>
              <div className="font-mono text-sm leading-relaxed mb-8 flex-1 space-y-4" style={{ color: "hsl(var(--chalk-white) / 0.75)" }}>
                <p>
                  A shorter one off plan to help you peak for a trip, achieve a short term goal or to try out our coaching before moving onto the main Kaizen plan.
                </p>
                <ul className="space-y-2">
                  {[
                    "One off 6 week personalised training programme",
                    "Day by day session plans: structured climbing sessions, fingerboarding, campusing, Strength and conditioning, and more",
                    "Weekly email support",
                  ].map((b, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs">
                      <span style={{ color: "hsl(var(--neon-orange))" }} className="flex-shrink-0">►</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <p className="font-mono text-sm" style={{ color: "hsl(var(--neon-orange))" }}>
                  £200 for the plan.
                </p>
              </div>
              <div className="border-t pt-6 mt-auto" style={{ borderColor: "hsl(var(--void-light))" }}>
                <Link to="/contact" className="btn-outline-orange inline-block">
                  CONTACT US TO START YOUR PLAN
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FREE CONSULTATION CTA ── */}
      <section
        className="py-16"
        style={{
          backgroundColor: "hsl(var(--void-black))",
          borderTop: "2px solid hsl(var(--void-light))",
        }}
      >
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <p
              className="font-mono text-xs tracking-[0.25em] mb-2"
              style={{ color: "hsl(var(--neon-orange))" }}
            >
              // NOT SURE WHICH PLAN?
            </p>
            <h2
              className="font-display text-3xl sm:text-4xl leading-tight mb-3"
              style={{ color: "hsl(var(--chalk-white))" }}
            >
              NOT SURE WHICH PLAN?
            </h2>
            <p
              className="font-mono text-sm leading-relaxed max-w-md"
              style={{ color: "hsl(var(--chalk-white) / 0.55)" }}
            >
              Book a free initial consultation call with Buster. We'll talk through your goals, current level and lifestyle so we can recommend the right plan for you — no commitment required.
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
          © {new Date().getFullYear()} Kaizen Climbing Coaching. All rights reserved.
        </div>
      </footer>
    </main>
  );
};

export default PlansPage;
