import { Link } from "react-router-dom";

const TrainingTipsPage = () => {
  return (
    <main>
      <div className="pt-16" style={{ backgroundColor: "hsl(var(--olive-dark))" }} />
      <section
        className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6"
        style={{ backgroundColor: "hsl(var(--olive))" }}
      >
        <h1 className="font-display text-4xl sm:text-6xl text-white mb-6">
          Training Tips
        </h1>
        <div
          className="w-20 h-1 mb-8"
          style={{ backgroundColor: "hsl(var(--yellow))" }}
        />
        <p className="font-body text-lg text-white opacity-70 max-w-md mb-10">
          Coming soon — expert training tips and articles from Buster Martin to help you climb stronger.
        </p>
        <Link to="/contact" className="btn-primary font-display text-base tracking-wider px-10 py-4">
          GET IN TOUCH
        </Link>
      </section>
      <footer className="py-8 text-center" style={{ backgroundColor: "hsl(var(--olive-dark))" }}>
        <div className="text-white opacity-40 text-xs font-body">
          © {new Date().getFullYear()} Kaizen Climbing Coaching. All rights reserved.
        </div>
      </footer>
    </main>
  );
};

export default TrainingTipsPage;
