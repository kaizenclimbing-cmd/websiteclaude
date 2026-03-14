import { Link } from "react-router-dom";

const PlansPage = () => {
  return (
    <main>
      {/* ── HERO ── */}
      <section className="section-yellow pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="font-display text-5xl sm:text-7xl leading-none mb-4" style={{ color: "hsl(var(--near-black))" }}>
            Plans and Coaching
          </h1>
          <div className="w-24 h-1" style={{ backgroundColor: "hsl(var(--near-black))" }} />
        </div>
      </section>

      {/* ── INTRO ── */}
      <section className="section-olive py-20">
        <div className="max-w-4xl mx-auto px-6">
          <p className="font-body text-lg sm:text-xl leading-relaxed font-semibold mb-10 text-white">
            At Kaizen we understand the importance of combining evidence-based science and experience. Our plans and coaching aim to improve all aspects of climbing performance; movement, mindset and of course the physical aspects of climbing performance such as strength, power and energy systems.
          </p>
          <div className="space-y-5 font-body text-base leading-relaxed text-white opacity-80">
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
      <section className="section-olive-dark py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-display text-4xl sm:text-5xl leading-none mb-12 text-white">
            CHOOSE YOUR PLAN
          </h2>
          <div className="grid md:grid-cols-2 gap-6 items-start">

            {/* Kaizen Plan */}
            <div className="plan-card-olive h-full flex flex-col" style={{ backgroundColor: "hsl(var(--olive))" }}>
              <div className="mb-6">
                <h3 className="font-display text-3xl leading-tight mb-1" style={{ color: "hsl(var(--yellow))" }}>
                  THE KAIZEN PLAN
                </h3>
                <p className="text-sm uppercase tracking-wider opacity-60 font-body">Ongoing Remote Coaching</p>
              </div>
              <div className="font-body text-sm leading-relaxed mb-8 flex-1 space-y-3 opacity-90">
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
                    <li key={i} className="flex items-start gap-3">
                      <span style={{ color: "hsl(var(--yellow))" }} className="font-bold flex-shrink-0">—</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <p className="font-semibold" style={{ color: "hsl(var(--yellow))" }}>
                  £200 every 4 weeks for a minimum of 12 weeks.
                </p>
              </div>
              <div className="border-t pt-6 mt-auto" style={{ borderColor: "hsl(var(--olive-dark))" }}>
                <Link to="/contact" className="btn-outline-light inline-block font-display text-base tracking-wider">
                  CONTACT US TO START YOUR PLAN
                </Link>
              </div>
            </div>

            {/* 6 Week Peak Plan */}
            <div className="plan-card-olive h-full flex flex-col" style={{ backgroundColor: "hsl(var(--olive))" }}>
              <div className="mb-6">
                <h3 className="font-display text-3xl leading-tight mb-1" style={{ color: "hsl(var(--yellow))" }}>
                  6 WEEK PEAK PLAN
                </h3>
                <p className="text-sm uppercase tracking-wider opacity-60 font-body">Fixed-Term Performance Programme</p>
              </div>
              <div className="font-body text-sm leading-relaxed mb-8 flex-1 space-y-3 opacity-90">
                <p>
                  A shorter one off plan to help you peak for a trip, achieve a short term goal or to try out our coaching before moving onto the main Kaizen plan.
                </p>
                <ul className="space-y-2">
                  {[
                    "One off 6 week personalised training programme",
                    "Day by day session plans: structured climbing sessions, fingerboarding, campusing, Strength and conditioning, and more",
                    "Weekly email support",
                  ].map((b, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span style={{ color: "hsl(var(--yellow))" }} className="font-bold flex-shrink-0">—</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <p className="font-semibold" style={{ color: "hsl(var(--yellow))" }}>
                  £200 for the plan.
                </p>
              </div>
              <div className="border-t pt-6 mt-auto" style={{ borderColor: "hsl(var(--olive-dark))" }}>
                <Link to="/contact" className="btn-outline-light inline-block font-display text-base tracking-wider">
                  CONTACT US TO START YOUR PLAN
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 text-center" style={{ backgroundColor: "hsl(var(--olive-dark))" }}>
        <h3 className="font-display text-3xl sm:text-4xl text-white mb-4">
          NOT SURE WHICH PLAN?
        </h3>
        <p className="font-body text-sm text-white opacity-70 mb-6 max-w-md mx-auto">
          Get in touch — a free consultation call will help us figure out the best fit for you.
        </p>
        <Link to="/contact" className="btn-primary font-display text-base tracking-wider px-10 py-4">
          BOOK A FREE CONSULTATION
        </Link>
        <div className="mt-12 pt-6 border-t text-white opacity-40 text-xs font-body" style={{ borderColor: "hsl(var(--olive))" }}>
          © {new Date().getFullYear()} Kaizen Climbing Coaching. All rights reserved.
        </div>
      </footer>
    </main>
  );
};

export default PlansPage;
