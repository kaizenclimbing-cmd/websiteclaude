import { useState } from "react";
import { Link } from "react-router-dom";

// ─── TRAINING CONTENT TYPES ───────────────────────────────────────────────────

type MediaType = "video" | "podcast" | "featured";

interface MediaItem {
  id: string;
  title: string;
  desc: string;
  date: string;
  types: MediaType[];
  youtubeId?: string;
  spotifyUrl?: string;
  externalUrl?: string;
  externalLabel?: string;
  wide?: boolean;
  spotifyThumb?: boolean;
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
    spotifyUrl: SPOTIFY_SHOW,
  },
  {
    id: "bouldering-qa",
    title: "Get Better at Bouldering — Q&A with an Olympic Coach",
    desc: "8 training questions answered directly — technique, strength, periodisation, and what most boulderers are getting wrong.",
    date: "NOV 2024",
    types: ["video"],
    youtubeId: "QovM_THXvMs",
  },
];

const TRAINING_FILTERS = [
  { key: "all", label: "ALL" },
  { key: "video", label: "▶ VIDEOS" },
  { key: "podcast", label: "🎙 PODCAST" },
  { key: "featured", label: "★ FEATURED" },
] as const;

type TrainingFilterKey = typeof TRAINING_FILTERS[number]["key"];

const badgeStyle: Record<MediaType, React.CSSProperties> = {
  video:    { color: "hsl(var(--neon-green))",  border: "1px solid hsl(var(--neon-green))",  backgroundColor: "hsl(var(--void-black))" },
  podcast:  { color: "hsl(var(--neon-orange))", border: "1px solid hsl(var(--neon-orange))", backgroundColor: "hsl(var(--void-black))" },
  featured: { color: "hsl(205 12% 65%)",        border: "1px solid hsl(205 12% 42%)",        backgroundColor: "hsl(var(--void-black))" },
};

const badgeLabel: Record<MediaType, string> = {
  video: "VIDEO", podcast: "PODCAST", featured: "FEATURED",
};

// ─── CLIMBING DATA ────────────────────────────────────────────────────────────

type ClimbingSection = "sends" | "press" | "podcasts";

const AS_SEEN_IN = [
  { label: "UKClimbing", url: "https://www.ukclimbing.com/news/athletes/buster-martin-73842" },
  { label: "BMC", url: "https://www.thebmc.co.uk/buster-martin-climbs-first-ley" },
  { label: "Climbing Mag", url: "https://www.climbing.com/news/hubble-or-action-directe-the-first-9a-buster-martin/" },
  { label: "Planet Mountain", url: "https://www.planetmountain.com/en/news/climbing/buster-martin-climbing-action-directe-frankenjura.html" },
  { label: "GearJunkie", url: "https://gearjunkie.com/news/video-buster-martin-action-directe" },
  { label: "Gripped", url: "https://gripped.com/news/action-directe-5-14d-sent-by-top-u-k-climber/" },
  { label: "8a.nu", url: "https://www.8a.nu/user/buster-martin" },
];

interface Send {
  id: string;
  route: string;
  grade: string;
  location: string;
  year: string;
  desc: string;
  youtubeId: string;
}

const SENDS: Send[] = [
  { id: "bat-route", route: "Bat Route", grade: "8c", location: "Malham Cove, UK", year: "2013", desc: "Youngest Briton to climb 8c at the time — 14 attempts across five sessions at age 16.", youtubeId: "FqxOvlhyBj0" },
  { id: "rainshadow", route: "Rainshadow", grade: "9a", location: "Malham Cove, UK", year: "2018", desc: "The comeback send. After a four-year break from climbing, Rainshadow 9a was the statement that Buster was back — and stronger.", youtubeId: "FqxOvlhyBj0" },
  { id: "first-ley", route: "First Ley", grade: "9a+", location: "Margalef, Spain", year: "2019", desc: "Chris Sharma's Margalef testpiece. The second Briton to tick a confirmed 9a+ — a landmark moment in British sport climbing.", youtubeId: "FqxOvlhyBj0" },
  { id: "hubble", route: "Hubble", grade: "9a", location: "Raven Tor, Peak District, UK", year: "2020", desc: "Ben Moon's 1990 masterpiece — widely considered the world's first 9a. More boulder problem than route. Only the 10th ascent ever made.", youtubeId: "lfL9_r5SIDA" },
  { id: "persian-dawn", route: "Persian Dawn", grade: "8c+ FA", location: "Raven Tor, Peak District, UK", year: "2021", desc: "First ascent — a direct finish to Make It Funky at Raven Tor. One of the hardest routes established on this iconic limestone wall.", youtubeId: "FqxOvlhyBj0" },
  { id: "action-directe", route: "Action Directe", grade: "9a", location: "Frankenjura, Germany", year: "2022", desc: "Wolfgang Güllich's 1991 vision. First British ascent in just five days. One of only two people alongside Alex Megos to have climbed both Hubble and Action Directe.", youtubeId: "UfZhJw3JKXM" },
  { id: "super-crackinette", route: "Super Crackinette", grade: "9a+", location: "Saint Léger du Ventoux, France", year: "2024", desc: "One of the most coveted 9a+ routes in Europe — combining raw power and precision on perfect limestone.", youtubeId: "UfZhJw3JKXM" },
];

interface PressItem {
  id: string; outlet: string; title: string; desc: string; date: string; url: string;
}

const PRESS: PressItem[] = [
  { id: "bmc-first-ley", outlet: "BMC", title: "Buster Martin — Second Brit to Climb 9a+", desc: "Interview with the BMC following the First Ley 9a+ ascent — a landmark moment for British sport climbing.", date: "NOV 2019", url: "https://www.thebmc.co.uk/buster-martin-climbs-first-ley" },
  { id: "gearjunkie-ad", outlet: "GearJunkie", title: "Watch Buster Martin Climb Iconic 'Action Directe' (5.14d)", desc: "Mainstream outdoor media coverage of the Action Directe send, reaching well beyond the climbing community.", date: "OCT 2022", url: "https://gearjunkie.com/news/video-buster-martin-action-directe" },
  { id: "climbing-hubble-debate", outlet: "Climbing Magazine", title: "Was 'Hubble' or 'Action Directe' the First 9a? Buster Martin Weighs In", desc: "Buster makes the case that Hubble pre-dates Action Directe as the world's first 9a — a debate that made waves across global climbing media.", date: "2022", url: "https://www.climbing.com/news/hubble-or-action-directe-the-first-9a-buster-martin/" },
  { id: "lacrux-profile", outlet: "Lacrux", title: "First Hubble, Now Action Directe: What Buster Martin Says About the 9a Classics", desc: "In-depth profile exploring what it means to be one of very few people globally to have climbed both routes.", date: "2022", url: "https://www.lacrux.com/en/klettern/first-hubble-now-action-direct-thats-what-buster-martin-says-about-the-9a-classics/" },
  { id: "fanatic-profile", outlet: "Fanatic Climbing", title: "Buster Martin — Britain's New Gun", desc: "Bilingual French/English profile establishing Buster as a new force in British sport climbing. One of the most thorough character profiles in the archive.", date: "2022", url: "https://fanatic-climbing.com/buster-martin-la-releve-britannique-buster-martin-britains-new-gun/" },
  { id: "ukc-super-crackinette", outlet: "UKClimbing", title: "Interview: Buster Martin on Super Crackinette 9a+", desc: "The most recent comprehensive interview — Super Crackinette, training philosophy, and what drives him as a climber and coach.", date: "DEC 2024", url: "https://www.ukclimbing.com/news/2024/12/buster_martin_talks_about_his_ascent_of_super_crackinette_9a+-73862" },
];

interface PodcastItem {
  id: string; show: string; title: string; desc: string; date: string; url: string; spotifyEpisodeId?: string;
}

const CLIMBING_PODCASTS: PodcastItem[] = [
  { id: "power-company", show: "Power Company Climbing", title: "Hubble vs. Action Directe — The World's First 9a, feat. Alex Megos & Buster Martin", desc: "Buster and Alex Megos — the only two climbers to have done both — debate the question, with cameos from Ben Moon, Adam Ondra, and Steve McClure.", date: "2022", url: "https://powercompanyclimbing.podbean.com/e/hubble-vs-action-directe-the-world-s-first-14d-9a-featuring-alex-megos-and-buster-martin/" },
  { id: "careless-talk", show: "Careless Talk Climbing Podcast", title: "Episode 24 — Action Directe, Hubble, Coaching & Injury Recovery", desc: "Full-length interview covering the biggest ascents, the Kaizen Climbing coaching setup, and navigating serious injury rehabilitation.", date: "DEC 2022", url: "https://open.spotify.com/episode/5W9M6ROWRu6DX2Sq8egI07", spotifyEpisodeId: "5W9M6ROWRu6DX2Sq8egI07" },
  { id: "baffle-days", show: "Baffle Days Podcast", title: "Buster Martin — Action Directe, Finger Injury Recovery & Pocket Training", desc: "1 hour 40 minutes on training for Action Directe, pocket climbing methodology, recovering from finger injuries, and building Kaizen Climbing.", date: "JUN 2023", url: "https://podcasts.apple.com/us/podcast/buster-martin-action-directe-finger-injury-recovery/id1447757624?i=1000616926180" },
  { id: "written-in-stone", show: "Written in Stone: Climbing History Podcast", title: "Buster Martin on Ben Moon and Hubble", desc: "Ben Moon's climbing legacy, Hubble's place in history, and what it means to be the second person to climb both Hubble and Action Directe.", date: "NOV 2023", url: "https://written-in-stone.podbean.com/e/buster-martin-on-ben-moon-and-hubble/" },
];

type TopTab = "training" | "climbing";

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="font-mono" style={{ background: "none", border: "none", borderBottom: `2px solid ${active ? "hsl(var(--neon-green))" : "transparent"}`, padding: "1rem 1.25rem", fontSize: "0.6rem", letterSpacing: "0.2em", color: active ? "hsl(var(--neon-green))" : "hsl(var(--chalk-white) / 0.4)", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s" }}>
      {children}
    </button>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>{children}</div>;
}

function MediaCard({ item }: { item: MediaItem }) {
  const isWide = item.wide;
  const thumb = (
    <div style={{ position: "relative", width: isWide ? undefined : "100%", aspectRatio: (isWide || item.spotifyThumb) ? undefined : "16/9", flex: isWide ? "0 0 45%" : undefined, overflow: "hidden", backgroundColor: "hsl(var(--void-dark))", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {item.youtubeId && <iframe src={`https://www.youtube.com/embed/${item.youtubeId}?rel=0&modestbranding=1`} title={item.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ width: "100%", height: "100%", border: "none", display: "block" }} />}
      {item.spotifyThumb && <iframe src="https://open.spotify.com/embed/show/5pCUdSf6p9Q3j9lBHjnhZQ?utm_source=generator&theme=0" width="100%" height="152" frameBorder={0} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" title="Kaizen Climbing Podcast on Spotify" style={{ display: "block" }} />}
      <div style={{ position: "absolute", top: "0.6rem", left: "0.6rem", display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
        {item.types.map(t => <span key={t} className="font-mono" style={{ fontSize: "0.5rem", letterSpacing: "0.15em", padding: "0.2rem 0.45rem", ...badgeStyle[t] }}>{badgeLabel[t]}</span>)}
      </div>
    </div>
  );
  const body = (
    <div style={{ padding: isWide ? "2rem" : "1rem 1.25rem 1.25rem", display: "flex", flexDirection: "column", flex: 1, justifyContent: isWide ? "center" : undefined }}>
      <p className="font-mono" style={{ fontSize: "0.55rem", letterSpacing: "0.15em", color: "hsl(var(--chalk-white) / 0.3)", marginBottom: "0.5rem" }}>{item.date}</p>
      <h2 className="font-display" style={{ fontSize: isWide ? "1.4rem" : "1.05rem", letterSpacing: "0.03em", textTransform: "uppercase", color: "hsl(var(--chalk-white))", lineHeight: 1.25, marginBottom: "0.5rem" }}>{item.title}</h2>
      <p className="font-mono" style={{ fontSize: isWide ? "0.7rem" : "0.65rem", lineHeight: 1.7, color: "hsl(var(--chalk-white) / 0.45)", flex: 1, marginBottom: "1rem" }}>{item.desc}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {item.spotifyUrl && !item.spotifyThumb && <iframe src="https://open.spotify.com/embed/show/5pCUdSf6p9Q3j9lBHjnhZQ?utm_source=generator&theme=0" width="100%" height="80" frameBorder={0} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" title="Listen on Spotify" style={{ display: "block" }} />}
      </div>
    </div>
  );
  return <div style={{ backgroundColor: "hsl(var(--void-mid))", border: "1px solid hsl(var(--void-light))", display: "flex", flexDirection: isWide ? "row" : "column", gridColumn: isWide ? "1 / -1" : undefined }}>{thumb}{body}</div>;
}

function SendCard({ send }: { send: Send }) {
  return (
    <div style={{ backgroundColor: "hsl(var(--void-mid))", border: "1px solid hsl(var(--void-light))", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", overflow: "hidden", backgroundColor: "hsl(var(--void-dark))" }}>
        <iframe src={`https://www.youtube.com/embed/${send.youtubeId}?rel=0&modestbranding=1`} title={send.route} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ width: "100%", height: "100%", border: "none", display: "block" }} />
        <span className="font-mono" style={{ position: "absolute", top: "0.6rem", right: "0.6rem", fontSize: "0.55rem", letterSpacing: "0.15em", padding: "0.2rem 0.55rem", backgroundColor: "hsl(var(--void-black))", color: "hsl(var(--neon-green))", border: "1px solid hsl(var(--neon-green))" }}>{send.grade}</span>
      </div>
      <div style={{ padding: "1rem 1.25rem 1.25rem", display: "flex", flexDirection: "column", flex: 1 }}>
        <p className="font-mono" style={{ fontSize: "0.5rem", letterSpacing: "0.15em", color: "hsl(var(--chalk-white) / 0.3)", marginBottom: "0.4rem" }}>{send.year} · {send.location}</p>
        <h3 className="font-display" style={{ fontSize: "1.1rem", letterSpacing: "0.04em", textTransform: "uppercase", color: "hsl(var(--chalk-white))", lineHeight: 1.25, marginBottom: "0.5rem" }}>{send.route}</h3>
        <p className="font-mono" style={{ fontSize: "0.65rem", lineHeight: 1.7, color: "hsl(var(--chalk-white) / 0.45)" }}>{send.desc}</p>
      </div>
    </div>
  );
}

function PressCard({ item }: { item: PressItem }) {
  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: "hsl(var(--void-mid))", border: "1px solid hsl(var(--void-light))", display: "flex", flexDirection: "column", padding: "1.5rem", textDecoration: "none", transition: "border-color 0.2s" }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "hsl(var(--chalk-white) / 0.3)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "hsl(var(--void-light))")}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem", gap: "1rem" }}>
        <span className="font-mono" style={{ fontSize: "0.5rem", letterSpacing: "0.2em", color: "hsl(var(--neon-orange))" }}>{item.outlet.toUpperCase()}</span>
        <span className="font-mono" style={{ fontSize: "0.5rem", letterSpacing: "0.15em", color: "hsl(var(--chalk-white) / 0.25)" }}>{item.date}</span>
      </div>
      <h3 className="font-display" style={{ fontSize: "1rem", letterSpacing: "0.03em", textTransform: "uppercase", color: "hsl(var(--chalk-white))", lineHeight: 1.3, marginBottom: "0.75rem" }}>{item.title}</h3>
      <p className="font-mono" style={{ fontSize: "0.62rem", lineHeight: 1.7, color: "hsl(var(--chalk-white) / 0.4)", flex: 1 }}>{item.desc}</p>
      <span className="font-mono" style={{ fontSize: "0.5rem", letterSpacing: "0.15em", color: "hsl(var(--chalk-white) / 0.3)", marginTop: "1rem" }}>→ READ ARTICLE</span>
    </a>
  );
}

function PodcastCard({ item }: { item: PodcastItem }) {
  return (
    <div style={{ backgroundColor: "hsl(var(--void-mid))", border: "1px solid hsl(var(--void-light))", display: "flex", flexDirection: "column", padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem", gap: "1rem" }}>
        <span className="font-mono" style={{ fontSize: "0.5rem", letterSpacing: "0.2em", color: "hsl(var(--neon-orange))" }}>🎙 {item.show.toUpperCase()}</span>
        <span className="font-mono" style={{ fontSize: "0.5rem", letterSpacing: "0.15em", color: "hsl(var(--chalk-white) / 0.25)", whiteSpace: "nowrap" }}>{item.date}</span>
      </div>
      <h3 className="font-display" style={{ fontSize: "1rem", letterSpacing: "0.03em", textTransform: "uppercase", color: "hsl(var(--chalk-white))", lineHeight: 1.3, marginBottom: "0.75rem" }}>{item.title}</h3>
      <p className="font-mono" style={{ fontSize: "0.62rem", lineHeight: 1.7, color: "hsl(var(--chalk-white) / 0.4)", flex: 1, marginBottom: "1rem" }}>{item.desc}</p>
      {item.spotifyEpisodeId
        ? <iframe src={`https://open.spotify.com/embed/episode/${item.spotifyEpisodeId}?utm_source=generator&theme=0`} width="100%" height="80" frameBorder={0} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" title={item.title} style={{ display: "block" }} />
        : <a href={item.url} target="_blank" rel="noopener noreferrer" className="font-mono" style={{ fontSize: "0.5rem", letterSpacing: "0.15em", padding: "0.5rem 0.75rem", border: "1px solid hsl(var(--void-light))", color: "hsl(var(--chalk-white) / 0.5)", textDecoration: "none", alignSelf: "flex-start" }}>→ LISTEN NOW</a>
      }
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

const TrainingTipsPage = () => {
  const [topTab, setTopTab] = useState<TopTab>("training");
  const [trainingFilter, setTrainingFilter] = useState<TrainingFilterKey>("all");
  const [climbingSection, setClimbingSection] = useState<ClimbingSection>("sends");

  const filteredTraining = trainingFilter === "all"
    ? items
    : items.filter(item => item.types.includes(trainingFilter as MediaType));

  return (
    <main style={{ backgroundColor: "hsl(var(--void-black))" }}>
      <div className="pt-16" />

      {/* ── HEADER ── */}
      <header className="text-center py-14" style={{ backgroundColor: "hsl(var(--void-dark))", borderBottom: "2px solid hsl(var(--void-light))" }}>
        <p className="font-mono text-xs tracking-[0.25em] mb-3" style={{ color: "hsl(var(--neon-orange))" }}>// MEDIA</p>
        <h1 className="font-display text-4xl sm:text-5xl mb-4" style={{ color: "hsl(var(--chalk-white))" }}>
          {topTab === "training" ? "Training Tips" : "My Climbing"}
        </h1>
        <div className="w-16 h-0.5 mx-auto mb-5" style={{ backgroundColor: "hsl(var(--neon-green))" }} />
        <p className="font-mono text-xs max-w-sm mx-auto px-6" style={{ color: "hsl(var(--chalk-white) / 0.45)", lineHeight: 1.8 }}>
          {topTab === "training"
            ? "Training videos, podcast appearances, and coaching content."
            : "Hard sends, press coverage, and podcast appearances — the climbing record behind the coaching."}
        </p>
      </header>

      {/* ── TOP TABS ── */}
      <div style={{ backgroundColor: "hsl(var(--void-dark))", borderBottom: "2px solid hsl(var(--neon-green))", display: "flex", padding: "0 1.5rem" }}>
        <TabButton active={topTab === "training"} onClick={() => setTopTab("training")}>▶ TRAINING TIPS</TabButton>
        <TabButton active={topTab === "climbing"} onClick={() => setTopTab("climbing")}>⬡ MY CLIMBING</TabButton>
      </div>

      {/* ── TRAINING TAB ── */}
      {topTab === "training" && (
        <>
          <div style={{ backgroundColor: "hsl(var(--void-mid))", borderBottom: "1px solid hsl(var(--void-light))", display: "flex", overflowX: "auto", padding: "0 1.5rem" }}>
            {TRAINING_FILTERS.map(f => (
              <TabButton key={f.key} active={trainingFilter === f.key} onClick={() => setTrainingFilter(f.key)}>{f.label}</TabButton>
            ))}
          </div>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 1.5rem" }}>
            <Grid>{filteredTraining.map(item => <MediaCard key={item.id} item={item} />)}</Grid>
          </div>
        </>
      )}

      {/* ── MY CLIMBING TAB ── */}
      {topTab === "climbing" && (
        <>
          {/* As Seen In */}
          <div style={{ backgroundColor: "hsl(var(--void-dark))", borderBottom: "1px solid hsl(var(--void-light))", padding: "1.25rem 1.5rem", overflowX: "auto" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
              <span className="font-mono" style={{ fontSize: "0.5rem", letterSpacing: "0.2em", color: "hsl(var(--chalk-white) / 0.3)", whiteSpace: "nowrap" }}>AS SEEN IN</span>
              {AS_SEEN_IN.map(outlet => (
                <a key={outlet.label} href={outlet.url} target="_blank" rel="noopener noreferrer" className="font-mono"
                  style={{ fontSize: "0.6rem", letterSpacing: "0.15em", color: "hsl(var(--chalk-white) / 0.5)", textDecoration: "none", whiteSpace: "nowrap", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "hsl(var(--chalk-white))")}
                  onMouseLeave={e => (e.currentTarget.style.color = "hsl(var(--chalk-white) / 0.5)")}>
                  {outlet.label}
                </a>
              ))}
            </div>
          </div>

          {/* Sub-section tabs */}
          <div style={{ backgroundColor: "hsl(var(--void-mid))", borderBottom: "1px solid hsl(var(--void-light))", display: "flex", overflowX: "auto", padding: "0 1.5rem" }}>
            <TabButton active={climbingSection === "sends"} onClick={() => setClimbingSection("sends")}>▶ HARD SENDS</TabButton>
            <TabButton active={climbingSection === "press"} onClick={() => setClimbingSection("press")}>◈ PRESS</TabButton>
            <TabButton active={climbingSection === "podcasts"} onClick={() => setClimbingSection("podcasts")}>🎙 PODCASTS</TabButton>
          </div>

          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 1.5rem" }}>
            {climbingSection === "sends" && <Grid>{SENDS.map(s => <SendCard key={s.id} send={s} />)}</Grid>}
            {climbingSection === "press" && <Grid>{PRESS.map(p => <PressCard key={p.id} item={p} />)}</Grid>}
            {climbingSection === "podcasts" && <Grid>{CLIMBING_PODCASTS.map(p => <PodcastCard key={p.id} item={p} />)}</Grid>}
          </div>
        </>
      )}

      {/* ── FOOTER ── */}
      <footer className="py-8 text-center" style={{ backgroundColor: "hsl(var(--void-dark))", borderTop: "2px solid hsl(var(--neon-orange))" }}>
        <div className="font-mono text-xs" style={{ color: "hsl(var(--chalk-white) / 0.3)" }}>
          © {new Date().getFullYear()} Kaizen Climbing Coaching.{" "}
          <Link to="/terms" className="underline hover:opacity-70 transition-opacity">Terms & Conditions</Link>
        </div>
      </footer>
    </main>
  );
};

export default TrainingTipsPage;
