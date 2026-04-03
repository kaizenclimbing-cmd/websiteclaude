import { useState } from "react";
import { Link } from "react-router-dom";

type MediaType = "video" | "podcast" | "featured" | "press";

interface MediaItem {
  id: string;
  title: string;
  desc: string;
  date: string;
  types: MediaType[];
  youtubeId?: string;
  youtubeUrl?: string;
  spotifyUrl?: string;
  externalUrl?: string;
  externalLabel?: string;
  wide?: boolean;
  spotifyThumb?: boolean;
  pressThumb?: boolean;
}

const SPOTIFY_SHOW = "https://open.spotify.com/show/5pCUdSf6p9Q3j9lBHjnhZQ";

const items: MediaItem[] = [
  {
    id: "missing-exercises",
    title: "You're Probably Missing These Exercises for Climbing Gains",
    desc: "The exercises most climbers skip — and why they're holding your grade back. Fingerboarding, antagonist work, and the shoulder prep that changed everything.",
    date: "NOV 2024 · MOST VIEWED",
    types: ["video", "podcast"],
    youtubeId: "nhPzD7iJd7I",
    youtubeUrl: "https://youtube.com/watch?v=nhPzD7iJd7I",
    spotifyUrl: SPOTIFY_SHOW,
    wide: true,
  },
  {
    id: "hangboard-twice",
    title: "Should Climbers Hangboard Twice a Day?",
    desc: "More isn't always better. Breaking down the science of fingerboard frequency and recovery for climbing-specific gains.",
    date: "JAN 2026",
    types: ["video"],
    youtubeId: "32DmME_5bR0",
    youtubeUrl: "https://youtube.com/watch?v=32DmME_5bR0",
  },
  {
    id: "tcc-podcast",
    title: "The Climbing Coach Podcast — Buster Martin on Training Specificity",
    desc: "Joined the team at TCC to talk about what actually drives grade improvements, and why most climbers are training the wrong things.",
    date: "JAN 2025",
    types: ["featured"],
    spotifyUrl: SPOTIFY_SHOW,
    spotifyThumb: true,
  },
  {
    id: "improve-instantly",
    title: "Improve Your Climbing Instantly",
    desc: "A single movement fix that most climbers can apply immediately — and see the difference on the wall within a session.",
    date: "DEC 2025",
    types: ["video", "podcast"],
    youtubeId: "IQri1-fmaoM",
    youtubeUrl: "https://youtube.com/watch?v=IQri1-fmaoM",
    spotifyUrl: SPOTIFY_SHOW,
  },
  {
    id: "climbing-magazine",
    title: "The Science of Climbing Stronger",
    desc: "Featured in Climbing Magazine discussing evidence-based training approaches for intermediate and advanced climbers.",
    date: "NOV 2024 · CLIMBING MAGAZINE",
    types: ["press"],
    pressThumb: true,
    externalUrl: "#",
    externalLabel: "READ ARTICLE",
  },
  {
    id: "bouldering-qa",
    title: "Get Better at Bouldering — Q&A with an Olympic Coach",
    desc: "8 training questions answered directly — technique, strength, periodisation, and what most boulderers are getting wrong.",
    date: "NOV 2024",
    types: ["video"],
    youtubeId: "QovM_THXvMs",
    youtubeUrl: "https://youtube.com/watch?v=QovM_THXvMs",
  },
];

const FILTERS = [
  { key: "all", label: "ALL" },
  { key: "video", label: "▶ VIDEOS" },
  { key: "podcast", label: "🎙 PODCAST" },
  { key: "featured", label: "★ FEATURED" },
  { key: "press", label: "◈ PRESS" },
] as const;

type FilterKey = typeof FILTERS[number]["key"];

const badgeStyle: Record<MediaType, React.CSSProperties> = {
  video:    { color: "hsl(var(--neon-green))",  border: "1px solid hsl(var(--neon-green))",  backgroundColor: "hsl(var(--void-black))" },
  podcast:  { color: "hsl(var(--neon-orange))", border: "1px solid hsl(var(--neon-orange))", backgroundColor: "hsl(var(--void-black))" },
  featured: { color: "hsl(205 12% 65%)",        border: "1px solid hsl(205 12% 42%)",        backgroundColor: "hsl(var(--void-black))" },
  press:    { color: "hsl(330 10% 65%)",        border: "1px solid hsl(330 10% 46%)",        backgroundColor: "hsl(var(--void-black))" },
};

const badgeLabel: Record<MediaType, string> = {
  video: "VIDEO", podcast: "PODCAST", featured: "FEATURED", press: "PRESS",
};

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" style={{ width: 44, height: 44 }}>
      <circle cx="12" cy="12" r="10" stroke="hsl(var(--neon-green))" strokeWidth="1.5" />
      <polygon points="10,8 16,12 10,16" fill="hsl(var(--neon-green))" />
    </svg>
  );
}

function MediaCard({ item }: { item: MediaItem }) {
  const isWide = item.wide;

  const thumb = (
    <div
      style={{
        position: "relative",
        width: isWide ? undefined : "100%",
        aspectRatio: isWide ? undefined : "16/9",
        flex: isWide ? "0 0 45%" : undefined,
        overflow: "hidden",
        backgroundColor: "hsl(var(--void-dark))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {item.youtubeId && (
        <img
          src={`https://img.youtube.com/vi/${item.youtubeId}/maxresdefault.jpg`}
          alt={item.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.75) contrast(1.05)" }}
        />
      )}
      {item.spotifyThumb && (
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/168px-Spotify_logo_without_text.svg.png"
          alt="Spotify"
          style={{ width: 64, height: 64, objectFit: "contain", opacity: 0.35 }}
        />
      )}
      {item.pressThumb && (
        <img
          src="https://images.squarespace-cdn.com/content/v1/5eecbef0263fed5b408a2c0f/9ec57a7a-cd1d-47f3-b6a7-741d64c98ed9/Buster_ActionDirecte-8.jpg"
          alt="Press"
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.3) contrast(1.1) brightness(0.6)" }}
        />
      )}
      {/* Play icon — only for YouTube cards */}
      {item.youtubeId && (
        <div
          className="play-overlay"
          style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            backgroundColor: "hsl(210 8% 8% / 0.35)",
            opacity: 0, transition: "opacity 0.2s",
          }}
        >
          <PlayIcon />
        </div>
      )}
      {/* Badges */}
      <div style={{ position: "absolute", top: "0.6rem", left: "0.6rem", display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
        {item.types.map(t => (
          <span
            key={t}
            className="font-mono"
            style={{
              fontSize: "0.5rem", letterSpacing: "0.15em",
              padding: "0.2rem 0.45rem",
              ...badgeStyle[t],
            }}
          >
            {badgeLabel[t]}
          </span>
        ))}
      </div>
    </div>
  );

  const body = (
    <div style={{ padding: isWide ? "2rem" : "1rem 1.25rem 1.25rem", display: "flex", flexDirection: "column", flex: 1, justifyContent: isWide ? "center" : undefined }}>
      <p className="font-mono" style={{ fontSize: "0.55rem", letterSpacing: "0.15em", color: "hsl(var(--chalk-white) / 0.3)", marginBottom: "0.5rem" }}>
        {item.date}
      </p>
      <h2
        className="font-display"
        style={{ fontSize: isWide ? "1.4rem" : "1.05rem", letterSpacing: "0.03em", textTransform: "uppercase", color: "hsl(var(--chalk-white))", lineHeight: 1.25, marginBottom: "0.5rem" }}
      >
        {item.title}
      </h2>
      <p
        className="font-mono"
        style={{ fontSize: isWide ? "0.7rem" : "0.65rem", lineHeight: 1.7, color: "hsl(var(--chalk-white) / 0.45)", flex: 1, marginBottom: "1rem" }}
      >
        {item.desc}
      </p>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {item.youtubeUrl && (
          <a
            href={item.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono"
            onClick={e => e.stopPropagation()}
            style={{ fontSize: "0.55rem", letterSpacing: "0.15em", padding: "0.4rem 0.75rem", border: "1px solid hsl(var(--neon-green))", color: "hsl(var(--neon-green))", textDecoration: "none" }}
          >
            ▶ WATCH ON YOUTUBE
          </a>
        )}
        {item.spotifyUrl && (
          <a
            href={item.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono"
            onClick={e => e.stopPropagation()}
            style={{ fontSize: "0.55rem", letterSpacing: "0.15em", padding: "0.4rem 0.75rem", border: "1px solid hsl(var(--neon-orange))", color: "hsl(var(--neon-orange))", textDecoration: "none" }}
          >
            🎙 LISTEN ON SPOTIFY
          </a>
        )}
        {item.externalUrl && (
          <a
            href={item.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono"
            onClick={e => e.stopPropagation()}
            style={{ fontSize: "0.55rem", letterSpacing: "0.15em", padding: "0.4rem 0.75rem", border: "1px solid hsl(var(--void-light))", color: "hsl(var(--chalk-white) / 0.5)", textDecoration: "none" }}
          >
            → {item.externalLabel}
          </a>
        )}
      </div>
    </div>
  );

  const cardStyle: React.CSSProperties = {
    backgroundColor: "hsl(var(--void-mid))",
    border: "1px solid hsl(var(--void-light))",
    display: "flex",
    flexDirection: isWide ? "row" : "column",
    transition: "border-color 0.2s",
    gridColumn: isWide ? "1 / -1" : undefined,
    textDecoration: "none",
    color: "inherit",
  };

  if (item.youtubeUrl && !isWide) {
    return (
      <a href={item.youtubeUrl} target="_blank" rel="noopener noreferrer" style={cardStyle}>
        {thumb}{body}
      </a>
    );
  }

  return (
    <div style={cardStyle}>
      {thumb}{body}
    </div>
  );
}

const TrainingTipsPage = () => {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const filtered = activeFilter === "all"
    ? items
    : items.filter(item => item.types.includes(activeFilter as MediaType));

  return (
    <main style={{ backgroundColor: "hsl(var(--void-black))" }}>
      <div className="pt-16" />

      {/* ── HEADER ── */}
      <header
        className="text-center py-14"
        style={{ backgroundColor: "hsl(var(--void-dark))", borderBottom: "2px solid hsl(var(--void-light))" }}
      >
        <p className="font-mono text-xs tracking-[0.25em] mb-3" style={{ color: "hsl(var(--neon-orange))" }}>
          // MEDIA
        </p>
        <h1 className="font-display text-4xl sm:text-5xl mb-4" style={{ color: "hsl(var(--chalk-white))" }}>
          Videos &amp; Podcasts
        </h1>
        <div className="w-16 h-0.5 mx-auto mb-5" style={{ backgroundColor: "hsl(var(--neon-green))" }} />
        <p className="font-mono text-xs max-w-sm mx-auto px-6" style={{ color: "hsl(var(--chalk-white) / 0.45)", lineHeight: 1.8 }}>
          Training tips, podcast appearances, and press features — everything in one place.
        </p>
      </header>

      {/* ── FILTER BAR ── */}
      <div
        style={{
          backgroundColor: "hsl(var(--void-mid))",
          borderBottom: "1px solid hsl(var(--void-light))",
          display: "flex",
          overflowX: "auto",
          padding: "0 1.5rem",
        }}
      >
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className="font-mono"
            style={{
              background: "none",
              border: "none",
              borderBottom: `2px solid ${activeFilter === f.key ? "hsl(var(--neon-green))" : "transparent"}`,
              padding: "1rem 1.25rem",
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              color: activeFilter === f.key ? "hsl(var(--neon-green))" : "hsl(var(--chalk-white) / 0.4)",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.2s",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── GRID ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 1.5rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {filtered.map(item => (
            <MediaCard key={item.id} item={item} />
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

export default TrainingTipsPage;
