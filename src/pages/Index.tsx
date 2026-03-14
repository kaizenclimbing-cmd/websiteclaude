import { Link } from "react-router-dom";

const testimonials = [
  {
    quote:
      "I'VE ONLY BEEN WORKING WITH KAIZEN FOR THE PAST 2.5 MONTHS AND I CAN SEE INCREDIBLE IMPROVEMENTS IN STRENGTH AND ENDURANCE. THEIR STRUCTURED AND PERSONALIZED PLANS ARE NO JOKE. I'VE IMPROVED A LOT. OFF THE WALL I AM NOW CONSISTENTLY DOING 1 ARMERS, RING MUSCLE UPS, HOLDING LOCK OFFS AND MY WEIGHTED PULL UPS ARE UP TO 80% BODYWEIGHT! I'VE GAINED TONS OF CONFIDENCE ON THE WALL WITH THEIR HELP. EXCITED FOR THE NEXT PHASE OF TRAINING WITH KAIZEN.",
    name: "Abdul",
    detail: "Saudi Arabia",
  },
  {
    quote:
      "IT FELT GREAT TO WORK ON MY FINGER STRENGTH WITH SOME SOLID STRUCTURE PROVIDED BY THE KAIZEN TEAM, AND MAKE GOOD GAINS IN A FAIRLY SHORT TIME, CUTTING IN HALF THE ASSISTING WEIGHT I WAS USING AT THE BEGINNING OF THE PLAN. THE LOCKDOWN ALLOWED ME TO FOCUS ON THIS ASPECT OF MY CLIMBING, WHICH I MAY NOT HAVE OTHERWISE. LOOKING FORWARD TO MAKING EVEN BIGGER GAINS IN THE FUTURE AND TAKING THIS STRENGTH ONTO THE ROCKS.",
    name: "Alessio",
    detail: "London",
  },
  {
    quote:
      "THANKS TO BUSTER HELPING ME TO MANAGE AND FIT IN MY TRAINING, I FEEL LIKE ANOTHER CLIMBER. WITH AN OPEN AND TRUSTING COACH-ATHLETE RELATIONSHIP, THE SHARING OF EVERYTHING, AND REGULAR COMMUNICATION ALL UNDERPINNED GREAT IMPROVEMENTS FOR ME. THE SATISFACTION WASN'T IN THE GRADES I HAVE REACHED BUT THE FEELING OF IMPROVING MORE AND MORE ON DIFFERENT TERRAIN AND ON TYPES OF ROUTES THAT I NEVER IMAGINED. A REAL GAME CHANGER. THE TRAINING WAS BASED ON SCIENCE, CAREFULLY CONSIDERED - NOT SIMPLY BEING TOLD TO PULL UNTIL YOU'RE DEAD MATE.",
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
    <main>
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="Buster Martin climbing Action Directe"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "rgba(0,0,0,0.15)" }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-24 pb-16">
          <div className="flex flex-col lg:flex-row lg:items-start gap-12">
            {/* Main headline */}
            <div className="flex-1">
              <h1
                className="font-display text-4xl sm:text-6xl lg:text-7xl text-white max-w-xl"
                style={{ lineHeight: "1.1" }}
              >
                Improve your climbing with the 1-to-1 support of a specialist coach and pro climber.
              </h1>
            </div>

            {/* Right callouts */}
            <div className="flex flex-col gap-4 lg:min-w-[320px] lg:mt-8">
              {[
                "Evidence-based Remote coaching, training plans and rehab",
                "Delivered by Buster Martin",
                "Coach to the Pros and everyday climbers",
              ].map((text, i) => (
                <div
                  key={i}
                  className="px-5 py-4"
                  style={{
                    backgroundColor: "rgba(58,52,37,0.9)",
                  }}
                >
                  <p
                    className="font-display text-base tracking-wide text-white"
                  >
                    {text}
                  </p>
                </div>
              ))}
              <Link to="/contact" className="btn-primary text-center mt-2 font-display text-base tracking-wider">
                START YOUR JOURNEY
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── BIO ── */}
      <section className="section-yellow py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Portrait */}
            <div className="lg:w-2/5 flex-shrink-0">
              <img
                src={BIO_IMAGE}
                alt="Buster Martin - Head Coach"
                className="w-full object-cover"
                style={{ maxHeight: "600px", objectPosition: "top" }}
              />
            </div>
            {/* Text */}
            <div className="lg:w-3/5">
              <h2
                className="font-display text-3xl sm:text-5xl leading-tight mb-6"
                style={{ color: "hsl(var(--near-black))" }}
              >
                I'm Buster - Coach first, climber second.
              </h2>
              <div className="space-y-4 font-body text-base leading-relaxed" style={{ color: "hsl(var(--near-black))" }}>
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
                <ul className="list-disc pl-5 space-y-1">
                  <li>4 × 9a+ routes</li>
                  <li>Action Directe 9a</li>
                  <li>Hubble 9a</li>
                  <li>8B+ boulders</li>
                  <li>8b+ flashes</li>
                </ul>
                <p>
                  Giving me the unique combination of academic knowledge in coaching and rehab, high-level climbing experience, and an understanding of the realities of juggling life's responsibilities and challenges around training and health.
                </p>
              </div>
              <Link to="/plans" className="btn-primary inline-block mt-8 font-display text-base tracking-wider"
                style={{ backgroundColor: "hsl(var(--near-black))", color: "hsl(var(--yellow))" }}
              >
                VIEW COACHING PLANS
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── PLANS PREVIEW ── */}
      <section className="section-olive py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-display text-4xl sm:text-5xl leading-none mb-12 text-white">
            COACHING PLANS
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Kaizen Plan */}
            <div className="plan-card-olive">
              <h3 className="font-display text-3xl leading-tight mb-2" style={{ color: "hsl(var(--yellow))" }}>
                THE KAIZEN PLAN
              </h3>
              <p className="text-sm uppercase tracking-wider mb-6 opacity-70 font-body">Ongoing Remote Coaching</p>
              <ul className="space-y-3 mb-8">
                {kaizenBullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 font-body text-sm">
                    <span style={{ color: "hsl(var(--yellow))" }} className="mt-0.5 font-bold text-base flex-shrink-0">—</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="btn-outline-light inline-block font-display text-base tracking-wider"
              >
                CONTACT US TO START YOUR PLAN
              </Link>
            </div>

            {/* 6 Week Peak Plan */}
            <div className="plan-card-olive">
              <h3 className="font-display text-3xl leading-tight mb-2" style={{ color: "hsl(var(--yellow))" }}>
                6 WEEK PEAK PLAN
              </h3>
              <p className="text-sm uppercase tracking-wider mb-6 opacity-70 font-body">Fixed-Term Performance Programme</p>
              <ul className="space-y-3 mb-8">
                {peakBullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 font-body text-sm">
                    <span style={{ color: "hsl(var(--yellow))" }} className="mt-0.5 font-bold text-base flex-shrink-0">—</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="btn-outline-light inline-block font-display text-base tracking-wider"
              >
                CONTACT US TO START YOUR PLAN
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section-yellow py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2
            className="font-display text-4xl sm:text-5xl leading-none mb-12"
            style={{ color: "hsl(var(--near-black))" }}
          >
            WHAT PEOPLE ARE SAYING
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <p
                  className="font-body text-sm leading-relaxed mb-6"
                  style={{ color: "hsl(var(--near-black))" }}
                >
                  "{t.quote}"
                </p>
                <div>
                  <p className="font-display text-sm" style={{ color: "hsl(var(--near-black))" }}>
                    {t.name}
                  </p>
                  <p className="font-body text-xs opacity-60" style={{ color: "hsl(var(--near-black))" }}>
                    {t.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="py-12 text-center"
        style={{ backgroundColor: "hsl(var(--olive-dark))" }}
      >
        <h3 className="font-display text-3xl sm:text-4xl text-white mb-4">
          READY TO LEVEL UP?
        </h3>
        <p className="font-body text-sm text-white opacity-70 mb-6 max-w-md mx-auto">
          Get in touch and let's build a plan around you.
        </p>
        <Link to="/contact" className="btn-primary font-display text-base tracking-wider px-10 py-4">
          GET STARTED TODAY
        </Link>
        <div className="mt-12 pt-6 border-t text-white opacity-40 text-xs font-body" style={{ borderColor: "hsl(var(--olive))" }}>
          © {new Date().getFullYear()} Kaizen Climbing Coaching. All rights reserved.{" "}
          <Link to="/terms" className="underline hover:opacity-70 transition-opacity">Terms &amp; Conditions</Link>
        </div>
      </footer>
    </main>
  );
};

export default HomePage;
