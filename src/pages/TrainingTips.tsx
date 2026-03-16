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
          className="font-mono text-xs tracking-[0.3em] mb-4"
          style={{ color: "hsl(var(--neon-orange))" }}
        >
          // TRAINING_TIPS.EXE
        </p>
        <h1
          className="font-display text-5xl sm:text-7xl mb-4 glow-green"
          style={{ color: "hsl(var(--chalk-white))" }}
        >
          TRAINING<br />
          <span style={{ color: "hsl(var(--neon-green))" }}>TIPS</span>
        </h1>
        <div
          className="w-32 h-1 mb-8"
          style={{
            background: "linear-gradient(90deg, hsl(var(--neon-green)), hsl(var(--neon-orange)))",
          }}
        />
        <div
          className="px-8 py-6 mb-10 max-w-md"
          style={{
            border: "2px solid hsl(var(--void-light))",
            backgroundColor: "hsl(var(--void-mid))",
          }}
        >
          <p
            className="font-mono text-xs tracking-[0.2em] mb-2"
            style={{ color: "hsl(var(--neon-orange))" }}
          >
            [STATUS: LOADING...]
          </p>
          <p
            className="font-mono text-sm"
            style={{ color: "hsl(var(--chalk-white) / 0.6)" }}
          >
            Coming soon — expert training tips and articles from Buster Martin to help you climb stronger.
          </p>
        </div>
        <Link to="/contact" className="btn-neon px-10 py-4 text-base">
          GET IN TOUCH
        </Link>
      </section>
      <footer
        className="py-8 text-center"
        style={{
          backgroundColor: "hsl(var(--void-dark))",
          borderTop: "1px solid hsl(var(--void-light))",
        }}
      >
        <div className="font-mono text-xs" style={{ color: "hsl(var(--chalk-white) / 0.3)" }}>
          © {new Date().getFullYear()} KAIZEN_CLIMBING_COACHING // ALL RIGHTS RESERVED
        </div>
      </footer>
    </main>
  );
};

export default TrainingTipsPage;
