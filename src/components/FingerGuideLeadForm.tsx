import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import {
  submitFingerGuideLead,
  isValidLeadEmail,
  setFingerGuideSubscribed,
  type FingerGuideSource,
} from "@/lib/fingerGuideLead";

type Props = {
  source: FingerGuideSource;
  onSuccess?: () => void;
  /** Tighter layout for bottom sheet */
  compact?: boolean;
};

export default function FingerGuideLeadForm({ source, onSuccess, compact }: Props) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!consent) {
      setError("Please tick the box to continue.");
      return;
    }
    if (!isValidLeadEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    const { error: submitError } = await submitFingerGuideLead(email, source);
    setLoading(false);
    if (submitError) {
      setError(submitError);
      return;
    }
    setFingerGuideSubscribed();
    setDone(true);
    onSuccess?.();
  };

  if (done) {
    return (
      <p
        className="font-mono text-xs leading-relaxed"
        style={{ color: "hsl(var(--neon-green))" }}
      >
        Thanks — we&apos;ll email you the guide shortly. If you don&apos;t see it, check spam.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? "space-y-3" : "space-y-4"}>
      <div>
        <label
          className="block font-mono text-[0.55rem] tracking-wider uppercase mb-1.5"
          style={{ color: "hsl(var(--chalk-white) / 0.5)" }}
          htmlFor={`finger-guide-email-${source}`}
        >
          Email
        </label>
        <input
          id={`finger-guide-email-${source}`}
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          className="w-full px-4 py-3 font-mono text-sm outline-none focus:ring-2 focus:ring-neon-green"
          style={{
            backgroundColor: "hsl(var(--void-black))",
            color: "hsl(var(--chalk-white))",
            border: "1px solid hsl(var(--void-light))",
          }}
          placeholder="you@email.com"
        />
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(ev) => setConsent(ev.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-[hsl(var(--neon-green))]"
        />
        <span className="font-mono text-[0.65rem] leading-relaxed" style={{ color: "hsl(var(--chalk-white) / 0.55)" }}>
          I agree to receive the free finger training guide by email and occasional emails about coaching offers. See{" "}
          <Link to="/terms" className="underline hover:opacity-80" style={{ color: "hsl(var(--neon-orange))" }}>
            Terms &amp; Conditions
          </Link>
          .
        </span>
      </label>

      {error && <p className="font-mono text-xs text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 font-display text-sm tracking-wider py-3.5 transition-all duration-150 disabled:opacity-60"
        style={{ backgroundColor: "hsl(var(--neon-green))", color: "hsl(var(--void-black))" }}
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : "Send me the guide"}
      </button>
    </form>
  );
}
