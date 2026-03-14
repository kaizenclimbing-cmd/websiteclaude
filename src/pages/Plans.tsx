import { Link } from "react-router-dom";

const kaizenBullets = [
  "Online coaching / mentoring",
  "Initial consultation call",
  "Fully personalised training programme",
  "Day by day session plans: structured climbing sessions, fingerboarding, campusing, strength and conditioning, and more",
  "Messaging; coach on hand for feedback, plan adjustments and advice",
  "For a minimum of 12 weeks.",
];

const peakBullets = [
  "One off 6 week personalised training programme",
  "Day by day session plans: structured climbing sessions, fingerboarding, campusing, Strength and conditioning, and more",
  "Weekly email support",
  "£200 for the plan",
];

const PlansPage = () => {
  return (
    <main>
      {/* ── HERO ── */}
      <section className="section-golden pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="font-display text-6xl sm:text-8xl leading-none text-charcoal mb-4">
            PLANS &amp;<br />COACHING
          </h1>
          <div
            className="w-24 h-1 mb-0"
            style={{ backgroundColor: "hsl(var(--golden-dark))" }}
          />
        </div>
      </section>

      {/* ── INTRO ── */}
      <section className="section-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p
            className="font-body text-xl sm:text-2xl leading-relaxed font-semibold mb-10"
            style={{ color: "hsl(var(--golden-dark))" }}
          >
            All coaching at Kaizen is rooted in sports science, built around you, and designed to produce measurable results — not just feel-good training sessions.
          </p>
          <div className="space-y-5 font-body text-base leading-relaxed text-left text-charcoal">
            <p>
              Too many climbers train hard without training smart. They repeat the same sessions week after week, grind their tendons into the ground, and wonder why they haven't broken through their plateau. The difference between the climbers who progress consistently and those who stagnate isn't talent — it's structure.
            </p>
            <p>
              Every plan at Kaizen Climbing Coaching is built on periodisation principles drawn from elite sport performance science, adapted specifically for the demands of climbing. Whether you're working on your first 6a or gunning for your first 8b, the same systematic approach applies.
            </p>
            <p>
              Remote coaching means you train on your schedule, at your crag, your wall, your gym — with the expertise of a specialist coach guiding every session. It's the most efficient, flexible, and affordable way to access high-performance coaching.
            </p>
          </div>
        </div>
      </section>

      {/* ── TWO PLANS ── */}
      <section className="section-golden py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-display text-5xl sm:text-6xl leading-none mb-12 text-charcoal">
            CHOOSE YOUR PLAN
          </h2>
          <div className="grid md:grid-cols-2 gap-6 items-start">
            {/* Kaizen Plan */}
            <div className="plan-card-dark h-full flex flex-col">
              <div className="mb-6">
                <h3
                  className="font-display text-5xl leading-none mb-1"
                  style={{ color: "hsl(var(--golden))" }}
                >
                  THE KAIZEN PLAN
                </h3>
                <p className="text-sm uppercase tracking-wider opacity-60 font-body">
                  Ongoing Remote Coaching
                </p>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {kaizenBullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 font-body text-sm leading-relaxed">
                    <span
                      className="mt-0.5 font-bold text-lg flex-shrink-0"
                      style={{ color: "hsl(var(--golden))" }}
                    >
                      —
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div
                className="border-t pt-6 mt-auto"
                style={{ borderColor: "hsl(var(--golden-deep))" }}
              >
                <p
                  className="font-display text-3xl mb-1"
                  style={{ color: "hsl(var(--golden))" }}
                >
                  ENQUIRE FOR PRICING
                </p>
                <p className="font-body text-xs opacity-60 mb-4">
                  Pricing tailored to your goals and commitment level
                </p>
                <Link
                  to="/contact"
                  className="btn-outline-light inline-block font-display text-lg tracking-wider"
                >
                  CONTACT US TO START
                </Link>
              </div>
            </div>

            {/* 6 Week Peak Plan */}
            <div className="plan-card-dark h-full flex flex-col">
              <div className="mb-6">
                <h3
                  className="font-display text-5xl leading-none mb-1"
                  style={{ color: "hsl(var(--golden))" }}
                >
                  6 WEEK PEAK PLAN
                </h3>
                <p className="text-sm uppercase tracking-wider opacity-60 font-body">
                  Fixed-Term Performance Programme
                </p>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {peakBullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 font-body text-sm leading-relaxed">
                    <span
                      className="mt-0.5 font-bold text-lg flex-shrink-0"
                      style={{ color: "hsl(var(--golden))" }}
                    >
                      —
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div
                className="border-t pt-6 mt-auto"
                style={{ borderColor: "hsl(var(--golden-deep))" }}
              >
                <p
                  className="font-display text-3xl mb-1"
                  style={{ color: "hsl(var(--golden))" }}
                >
                  ENQUIRE FOR PRICING
                </p>
                <p className="font-body text-xs opacity-60 mb-4">
                  Fixed investment for a focused performance block
                </p>
                <Link
                  to="/contact"
                  className="btn-outline-light inline-block font-display text-lg tracking-wider"
                >
                  CONTACT US TO START
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="py-12 text-center"
        style={{ backgroundColor: "hsl(var(--charcoal))" }}
      >
        <h3 className="font-display text-4xl sm:text-5xl text-white mb-4">
          NOT SURE WHICH PLAN?
        </h3>
        <p className="font-body text-sm text-white opacity-70 mb-6 max-w-md mx-auto">
          Get in touch — a free consultation call will help us figure out the best fit for you.
        </p>
        <Link to="/contact" className="btn-primary font-display text-xl tracking-wider px-10 py-4">
          BOOK A FREE CONSULTATION
        </Link>
        <div
          className="mt-12 pt-6 border-t text-white opacity-40 text-xs font-body"
          style={{ borderColor: "hsl(var(--golden-dark))" }}
        >
          © {new Date().getFullYear()} Kaizen Climbing Coaching. All rights reserved.
        </div>
      </footer>
    </main>
  );
};

export default PlansPage;
