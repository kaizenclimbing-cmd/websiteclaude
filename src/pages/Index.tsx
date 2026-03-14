import heroImg from "@/assets/hero-climbing.jpg";
import busterImg from "@/assets/buster-headshot.jpg";
import { Link } from "react-router-dom";

const testimonials = [
  {
    quote:
      "Buster completely transformed my training. In 12 weeks I went from struggling on 6c to confidently projecting 7b. The structure and accountability made all the difference.",
    name: "Sarah T.",
    detail: "Amateur climber, 3 years experience",
  },
  {
    quote:
      "As someone with a shoulder injury history, I was nervous about training hard. Buster's rehab-informed approach meant I trained smarter, not just harder. Pain-free at last.",
    name: "James R.",
    detail: "Trad climber, 8 years experience",
  },
  {
    quote:
      "The 6 Week Peak Plan was exactly what I needed before my trip to Ceuse. Structured, science-backed, and Buster was always on hand for questions. 10/10.",
    name: "Marco D.",
    detail: "Sport climber, competition background",
  },
];

const kaizenBullets = [
  "Fully personalised monthly training plan",
  "Weekly check-ins via video or message",
  "Technique analysis from your own footage",
  "Injury prevention and rehab support",
  "Nutrition and recovery guidance",
  "Ongoing plan adjustments based on progress",
];

const peakBullets = [
  "Structured 6-week periodised programme",
  "Designed around a specific goal or trip",
  "Full strength and power phase integration",
  "Rest and recovery scheduling",
  "Delivered digitally — start any time",
  "Email support throughout",
];

const HomePage = () => {
  return (
    <main>
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <img
          src={heroImg}
          alt="Climber on a vertical rock face"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to right, rgba(0,0,0,0.75) 40%, rgba(0,0,0,0.35) 100%)" }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-24 pb-16">
          <div className="flex flex-col lg:flex-row lg:items-start gap-12">
            {/* Main headline */}
            <div className="flex-1">
              <h1
                className="font-display text-5xl sm:text-7xl lg:text-8xl leading-none text-white mb-6 max-w-2xl"
                style={{ lineHeight: "0.95" }}
              >
                IMPROVE YOUR{" "}
                <span style={{ color: "hsl(var(--golden))" }}>CLIMBING</span>{" "}
                WITH THE 1-TO-1 SUPPORT OF A SPECIALIST COACH AND PRO CLIMBER
              </h1>
            </div>

            {/* Right callouts */}
            <div className="flex flex-col gap-4 lg:min-w-[320px] lg:mt-8">
              {[
                "Evidence-based remote coaching, training plans and rehab",
                "Delivered by Buster Martin",
                "Coach to the pros and everyday climbers",
              ].map((text, i) => (
                <div
                  key={i}
                  className="px-5 py-4 border-l-4"
                  style={{
                    backgroundColor: "rgba(92,84,53,0.85)",
                    borderColor: "hsl(var(--golden))",
                  }}
                >
                  <p
                    className="font-display text-xl tracking-wider"
                    style={{ color: "hsl(var(--golden))" }}
                  >
                    {text}
                  </p>
                </div>
              ))}
              <Link to="/contact" className="btn-primary text-center mt-2 font-display text-xl tracking-wider">
                START YOUR JOURNEY
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── BIO ── */}
      <section className="section-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Headshot */}
            <div className="lg:w-2/5 flex-shrink-0">
              <div
                className="relative"
                style={{ borderLeft: "6px solid hsl(var(--golden))" }}
              >
                <img
                  src={busterImg}
                  alt="Buster Martin - Head Coach"
                  className="w-full object-cover"
                  style={{ maxHeight: "560px", objectPosition: "top" }}
                />
              </div>
            </div>
            {/* Text */}
            <div className="lg:w-3/5">
              <h2
                className="font-display text-5xl sm:text-6xl leading-none mb-6"
                style={{ color: "hsl(var(--golden-dark))" }}
              >
                I'M BUSTER —<br />
                <span style={{ color: "hsl(var(--charcoal))" }}>
                  COACH FIRST, CLIMBER SECOND.
                </span>
              </h2>
              <div className="space-y-4 font-body text-base leading-relaxed" style={{ color: "hsl(var(--charcoal))" }}>
                <p>
                  I've been climbing for over 20 years — from dusty sport crags in Spain to bouldering in Fontainebleau and competing at national level. But somewhere along the way, I realised my greatest passion wasn't sending my next project. It was helping others send theirs.
                </p>
                <p>
                  I hold a BSc in Sports Science and have had the privilege of working with Olympic-level athletes, national team members, and weekend warriors who just want to stop falling off the same move. My approach is the same for everyone: evidence-based, individualised, and results-driven.
                </p>
                <p>
                  Kaizen is the Japanese concept of continuous improvement. That's the philosophy at the heart of everything I do. No shortcuts. No gimmicks. Just a structured, science-backed path to becoming a better climber — whatever that looks like for you.
                </p>
                <p className="font-semibold" style={{ color: "hsl(var(--golden-dark))" }}>
                  Whether you're a beginner or a competitor, remote coaching with me will change the way you train.
                </p>
              </div>
              <Link to="/plans" className="btn-primary inline-block mt-8 font-display text-xl tracking-wider">
                VIEW COACHING PLANS
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── PLANS PREVIEW ── */}
      <section className="section-golden py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-display text-5xl sm:text-6xl leading-none mb-12 text-charcoal">
            COACHING PLANS
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Kaizen Plan */}
            <div className="plan-card-dark">
              <h3 className="font-display text-4xl leading-none mb-2" style={{ color: "hsl(var(--golden))" }}>
                THE KAIZEN PLAN
              </h3>
              <p className="text-sm uppercase tracking-wider mb-6 opacity-70">Ongoing Remote Coaching</p>
              <ul className="space-y-3 mb-8">
                {kaizenBullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 font-body text-sm">
                    <span style={{ color: "hsl(var(--golden))" }} className="mt-0.5 font-bold text-base">—</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="btn-outline-light inline-block font-display text-lg tracking-wider"
              >
                CONTACT US TO START YOUR PLAN
              </Link>
            </div>

            {/* 6 Week Peak Plan */}
            <div className="plan-card-dark">
              <h3 className="font-display text-4xl leading-none mb-2" style={{ color: "hsl(var(--golden))" }}>
                6 WEEK PEAK PLAN
              </h3>
              <p className="text-sm uppercase tracking-wider mb-6 opacity-70">Fixed-Term Performance Programme</p>
              <ul className="space-y-3 mb-8">
                {peakBullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 font-body text-sm">
                    <span style={{ color: "hsl(var(--golden))" }} className="mt-0.5 font-bold text-base">—</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="btn-outline-light inline-block font-display text-lg tracking-wider"
              >
                CONTACT US TO START YOUR PLAN
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section-dark py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2
            className="font-display text-5xl sm:text-6xl leading-none mb-12 text-center"
            style={{ color: "hsl(var(--golden))" }}
          >
            WHAT PEOPLE ARE SAYING
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <p
                  className="font-body text-sm leading-relaxed mb-6"
                  style={{ color: "hsl(var(--charcoal))" }}
                >
                  "{t.quote}"
                </p>
                <div>
                  <p className="font-bold text-sm uppercase tracking-wide" style={{ color: "hsl(var(--charcoal))" }}>
                    {t.name}
                  </p>
                  <p className="text-xs opacity-70" style={{ color: "hsl(var(--charcoal))" }}>
                    {t.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <footer
        className="py-12 text-center"
        style={{ backgroundColor: "hsl(var(--charcoal))" }}
      >
        <h3 className="font-display text-4xl sm:text-5xl text-white mb-4">
          READY TO LEVEL UP?
        </h3>
        <p className="font-body text-sm text-white opacity-70 mb-6 max-w-md mx-auto">
          Get in touch and let's build a plan around you.
        </p>
        <Link to="/contact" className="btn-primary font-display text-xl tracking-wider px-10 py-4">
          GET STARTED TODAY
        </Link>
        <div className="mt-12 pt-6 border-t text-white opacity-40 text-xs font-body" style={{ borderColor: "hsl(var(--golden-dark))" }}>
          © {new Date().getFullYear()} Kaizen Climbing Coaching. All rights reserved.
        </div>
      </footer>
    </main>
  );
};

export default HomePage;
