import { Link } from "react-router-dom";

const TrainingTipsPage = () => {
  return (
    <main>
      {/* Spacer for sticky nav */}
      <div style={{ paddingTop: "4rem", backgroundColor: "hsl(var(--golden-dark))" }} />

      <section
        className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-24"
        style={{ backgroundColor: "hsl(var(--golden-dark))" }}
      >
        <h1
          className="font-display text-7xl sm:text-9xl leading-none mb-4"
          style={{ color: "hsl(var(--golden))" }}
        >
          TRAINING<br />TIPS
        </h1>
        <div
          className="w-24 h-1 mb-8 mx-auto"
          style={{ backgroundColor: "hsl(var(--golden))" }}
        />
        <p className="font-display text-4xl sm:text-5xl text-white mb-4 leading-none">
          COMING SOON
        </p>
        <p className="font-body text-base text-white opacity-70 max-w-md leading-relaxed mb-10">
          We're putting together a library of evidence-based training articles, videos, and resources for climbers of all levels. Check back soon.
        </p>
        <Link to="/" className="btn-primary font-display text-xl tracking-wider px-10 py-4">
          BACK TO HOME
        </Link>
      </section>
    </main>
  );
};

export default TrainingTipsPage;
