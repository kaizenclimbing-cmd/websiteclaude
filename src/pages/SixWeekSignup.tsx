import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { CheckCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const labelCls = "block font-body text-xs font-semibold uppercase tracking-wider mb-1.5";
const inputCls =
  "w-full px-4 py-3 font-body text-sm outline-none focus:ring-2 bg-[#1a1a1a] text-white placeholder-white/30 border border-white/10 focus:border-golden focus:ring-golden/20";

export default function SixWeekSignup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id") ?? "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkEmail, setCheckEmail] = useState(false);

  // If no session_id in URL something went wrong
  if (!sessionId) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "hsl(var(--charcoal))" }}>
        <div className="max-w-md w-full text-center">
          <p className="font-body text-white/60 mb-4">Missing payment session. Please try again.</p>
          <Link to="/plans/6-week" className="font-mono text-xs underline" style={{ color: "hsl(var(--neon-orange))" }}>
            ← Back to 6 Week Plan
          </Link>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/consultation/form?plan=six_week_peak&session_id=${sessionId}`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Account already exists — sign them in and redirect
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError("An account with this email already exists. Please check your password.");
        setLoading(false);
        return;
      }
      navigate(`/consultation/form?plan=six_week_peak&session_id=${sessionId}`);
      return;
    }

    // New account — needs email confirmation
    setCheckEmail(true);
    setLoading(false);
  };

  if (checkEmail) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "hsl(var(--charcoal))" }}>
        <div className="max-w-md w-full text-center">
          <CheckCircle size={40} className="mx-auto mb-6" style={{ color: "hsl(var(--neon-orange))" }} />
          <h1 className="font-display text-3xl leading-none mb-4" style={{ color: "hsl(var(--chalk-white))" }}>
            CHECK YOUR EMAIL
          </h1>
          <p className="font-body text-sm leading-relaxed" style={{ color: "hsl(var(--chalk-white) / 0.6)" }}>
            We've sent a confirmation link to <span className="text-white font-semibold">{email}</span>.
            Click it to confirm your account and continue to your consultation form.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16" style={{ backgroundColor: "hsl(var(--charcoal))" }}>
      <div className="w-full max-w-md">

        {/* Payment confirmed badge */}
        <div
          className="flex items-center gap-3 px-4 py-3 mb-8"
          style={{ backgroundColor: "hsl(var(--neon-orange) / 0.1)", border: "1px solid hsl(var(--neon-orange) / 0.3)" }}
        >
          <CheckCircle size={16} style={{ color: "hsl(var(--neon-orange))" }} className="flex-shrink-0" />
          <p className="font-mono text-xs" style={{ color: "hsl(var(--neon-orange))" }}>
            Payment confirmed — create your account to continue
          </p>
        </div>

        <p className="font-mono text-xs tracking-[0.25em] mb-2" style={{ color: "hsl(var(--neon-orange))" }}>
          // 6 WEEK PEAK PLAN
        </p>
        <h1 className="font-display text-3xl leading-none mb-8" style={{ color: "hsl(var(--chalk-white))" }}>
          CREATE YOUR ACCOUNT
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={labelCls} style={{ color: "hsl(var(--chalk-white) / 0.6)" }}>Email</label>
            <input
              type="email"
              className={inputCls}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              autoFocus
            />
          </div>

          <div>
            <label className={labelCls} style={{ color: "hsl(var(--chalk-white) / 0.6)" }}>Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={inputCls}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a password"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-70 transition-opacity"
              >
                {showPassword ? <EyeOff size={16} className="text-white" /> : <Eye size={16} className="text-white" />}
              </button>
            </div>
          </div>

          {error && <p className="font-mono text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 font-display text-sm tracking-wider py-4 transition-all duration-150 disabled:opacity-60 mt-2"
            style={{ backgroundColor: "hsl(var(--neon-orange))", color: "hsl(var(--chalk-white))" }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : "CREATE ACCOUNT & CONTINUE →"}
          </button>
        </form>

        <p className="font-mono text-xs mt-6 text-center" style={{ color: "hsl(var(--chalk-white) / 0.35)" }}>
          Already have an account?{" "}
          <Link
            to={`/consultation/auth?redirect=/consultation/form?plan=six_week_peak%26session_id=${sessionId}`}
            className="underline hover:opacity-80 transition-opacity"
            style={{ color: "hsl(var(--neon-orange) / 0.7)" }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
