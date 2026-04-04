import { Link } from "react-router-dom";

interface Send {
  id: string;
  route: string;
  grade: string;
  location: string;
  year: string;
  desc: string;
  youtubeId: string; // ← swap these out for your actual footage
}

// ─── ADD YOUR SENDS HERE ──────────────────────────────────────────────────────
// Replace the youtubeId values with the actual IDs from your YouTube videos.
// YouTube URL: https://youtube.com/watch?v=XXXXXXXXXXX  →  ID = XXXXXXXXXXX
const SENDS: Send[] = [
  {
    id: "hubble",
    route: "Hubble",
    grade: "9a",
    location: "Raven Tor, Peak District, UK",
    year: "2020",
    desc: "The world's first 9a — bolted and first ascended by Ben Moon in 1990. One of the most technical routes in the world, more boulder problem than route. 10th ascent.",
    youtubeId: "Y1p3bR6kZJ4",
  },
  {
    id: "action-directe",
    route: "Action Directe",
    grade: "9a",
    location: "Frankenjura, Germany",
    year: "2022",
    desc: "Wolfgang Güllich's 1991 masterpiece — a vision 30 years ahead of its time. First British ascent. Sent in four sessions over two trips. Only the second person to climb both Hubble and Action Directe.",
    youtubeId: "UfZhJw3JKXM",
  },
  // ── ADD MORE SENDS BELOW ──────────────────────────────────────────────────
  // { id: "send-3", route: "Route Name", grade: "8c+", location: "...", year: "...", desc: "...", youtubeId: "..." },
];
// ─────────────────────────────────────────────────────────────────────────────

function SendCard({ send }: { send: Send }) {
  return (
    <div
      style={{
        backgroundColor: "hsl(var(--void-mid))",
        border: "1px solid hsl(var(--void-light))",
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.2s",
      }}
    >
      {/* Video embed */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", overflow: "hidden", backgroundColor: "hsl(var(--void-dark))" }}>
        <iframe
          src={`https://www.youtube.com/embed/${send.youtubeId}?rel=0&modestbranding=1`}
          title={send.route}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ width: "100%", height: "100%", border: "none", display: "block" }}
        />
        {/* Grade badge */}
        <span
          className="font-mono"
          style={{
            position: "absolute",
            top: "0.6rem",
            right: "0.6rem",
            fontSize: "0.55rem",
            letterSpacing: "0.15em",
            padding: "0.2rem 0.55rem",
            backgroundColor: "hsl(var(--void-black))",
            color: "hsl(var(--neon-green))",
            border: "1px solid hsl(var(--neon-green))",
          }}
        >
          {send.grade}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: "1rem 1.25rem 1.25rem", display: "flex", flexDirection: "column", flex: 1 }}>
        <p className="font-mono" style={{ fontSize: "0.5rem", letterSpacing: "0.15em", color: "hsl(var(--chalk-white) / 0.3)", marginBottom: "0.4rem" }}>
          {send.year} · {send.location}
        </p>
        <h2
          className="font-display"
          style={{ fontSize: "1.1rem", letterSpacing: "0.04em", textTransform: "uppercase", color: "hsl(var(--chalk-white))", lineHeight: 1.25, marginBottom: "0.5rem" }}
        >
          {send.route}
        </h2>
        <p
          className="font-mono"
          style={{ fontSize: "0.65rem", lineHeight: 1.7, color: "hsl(var(--chalk-white) / 0.45)" }}
        >
          {send.desc}
        </p>
      </div>
    </div>
  );
}

const SendsPage = () => {
  return (
    <main style={{ backgroundColor: "hsl(var(--void-black))" }}>
      <div className="pt-16" />

      {/* ── HEADER ── */}
      <header
        className="text-center py-14"
        style={{ backgroundColor: "hsl(var(--void-dark))", borderBottom: "2px solid hsl(var(--void-light))" }}
      >
        <p className="font-mono text-xs tracking-[0.25em] mb-3" style={{ color: "hsl(var(--neon-green))" }}>
          // SENDS
        </p>
        <h1 className="font-display text-4xl sm:text-5xl mb-4" style={{ color: "hsl(var(--chalk-white))" }}>
          Hard Routes I've Done
        </h1>
        <div className="w-16 h-0.5 mx-auto mb-5" style={{ backgroundColor: "hsl(var(--neon-green))" }} />
        <p className="font-mono text-xs max-w-sm mx-auto px-6" style={{ color: "hsl(var(--chalk-white) / 0.45)", lineHeight: 1.8 }}>
          Famous routes, hard projects, milestone sends — documented on film.
        </p>
      </header>

      {/* ── GRID ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 1.5rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {SENDS.map(send => (
            <SendCard key={send.id} send={send} />
          ))}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer
        className="py-8 text-center"
        style={{ backgroundColor: "hsl(var(--void-dark))", borderTop: "2px solid hsl(var(--neon-orange))" }}
      >
        <div className="font-mono text-xs" style={{ color: "hsl(var(--chalk-white) / 0.3)" }}>
          © {new Date().getFullYear()} Kaizen Climbing Coaching.{" "}
          <Link to="/terms" className="underline hover:opacity-70 transition-opacity">Terms & Conditions</Link>
        </div>
      </footer>
    </main>
  );
};

export default SendsPage;
