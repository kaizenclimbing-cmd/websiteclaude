import { Link } from "react-router-dom";

const TrainingTipsPage = () => {
  return (
    <main style={{ backgroundColor: "hsl(var(--void-black))" }}>
      <div className="pt-16" />
      <section
        className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6"
        style={{ backgroundColor: "hsl(var(--void-dark))" }}
      >
        <p
          className="font-mono text-xs tracking-[0.25em] mb-4"
          style={{ color: "hsl(var(--neon-orange))" }}
        >
          // TRAINING TIPS
        </p>
        <h1 className="font-display text-4xl sm:text-6xl mb-4" style={{ color: "hsl(var(--chalk-white))" }}>
          Training Tips
        </h1>
        <div
          className="w-20 h-0.5 mb-8"
          style={{ backgroundColor: "hsl(var(--neon-green))" }}
        />
        <p
          className="font-mono text-sm max-w-md mb-10"
          style={{ color: "hsl(var(--chalk-white) / 0.55)" }}
        >
          Coming soon — expert training tips and articles from Buster Martin to help you climb stronger.
        </p>
        <Link to="/contact" className="btn-neon px-10 py-4">
          GET IN TOUCH
        </Link>
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

export default TrainingTipsPage;
