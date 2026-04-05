import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Mode = "signup" | "login" | "forgot";

const labelCls = "block font-body text-xs font-semibold uppercase tracking-wider mb-1.5";
const inputCls =
  "w-full px-4 py-3 font-body text-sm outline-none focus:ring-2 bg-[#1a1a1a] text-white placeholder-white/30 border border-white/10 focus:border-golden focus:ring-golden/20";

export default function ConsultationAuth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkEmail, setCheckEmail] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  const switchMode = (next: Mode) => { setMode(next); setError(""); setCheckEmail(false); setResetSent(false); };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "forgot") {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (resetError) {
        setError(resetError.message);
      } else {
        setResetSent(true);
      }
    } else if (mode === "signup") {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/consultation/next` },
      });
      if (signUpError) {
        setError(signUpError.message);
      } else if (data.user && data.user.identities && data.user.identities.length === 0) {
        setMode("login");
        setError("An account with this email already exists. Please sign in instead.");
      } else {
        setCheckEmail(true);
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(signInError.message);
      } else {
        navigate("/consultation/next");
      }
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setOauthLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/consultation/oauth-callback`,
      },
    });

    if (error) {
      setError(error.message);
      setOauthLoading(false);
    }
  };

  const titles: Record<Mode, string> = {
    signup: "CREATE ACCOUNT",
    login: "SIGN IN",
    forgot: "RESET PASSWORD",
  };

  const subtitles: Record<Mode, string> = {
    signup: "Create a free account to start your consultation. Your progress will be saved across devices.",
    login: "Welcome back — sign in to continue your consultation.",
    forgot: "Enter your email and we'll send you a link to reset your password.",
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 py-16"
      style={{ backgroundColor: "hsl(var(--charcoal))" }}
    >
      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-16 lg:gap-24 items-start lg:items-center">

        {/* ── Left: context panel ── */}
        <div className="flex-1 lg:max-w-sm">
          <p
            className="font-mono text-xs tracking-[0.3em] mb-6"
            style={{ color: "hsl(var(--golden) / 0.5)" }}
          >
            // KAIZEN CLIMBING COACHING
          </p>
          <h2
            className="font-display text-5xl sm:text-6xl leading-none mb-6"
            style={{ color: "hsl(var(--golden))" }}
          >
            HOW IT WORKS
          </h2>
          <p className="font-body text-sm text-white/55 leading-relaxed mb-10">
            I work with a small number of athletes at a time. Before anything is committed, we go through a short process to make sure we're the right fit.
          </p>

          <div className="space-y-8">
            {[
              {
                num: "01",
                title: "Tell me about your climbing",
                body: "Fill out a short form — your goals, current level, and what you're trying to improve. Takes about 5 minutes.",
              },
              {
                num: "02",
                title: "I review your application",
                body: "I'll look everything over and get back to you within 72 hours. If it's a good fit, I'll unlock the next step.",
              },
              {
                num: "03",
                title: "Payment & plan starts",
                body: "Once accepted, you'll receive payment details. After payment is confirmed, we schedule your onboarding call and your personalised plan begins.",
              },
            ].map(({ num, title, body }) => (
              <div key={num} className="flex gap-5">
                <span
                  className="font-display text-4xl leading-none flex-shrink-0 w-10"
                  style={{ color: "hsl(var(--golden) / 0.3)" }}
                >
                  {num}
                </span>
                <div>
                  <p className="font-display text-lg leading-tight mb-1" style={{ color: "hsl(var(--golden))" }}>
                    {title}
                  </p>
                  <p className="font-body text-sm text-white/45 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>

          <div
            className="mt-10 pt-8 border-t"
            style={{ borderColor: "hsl(var(--golden) / 0.15)" }}
          >
            <p className="font-body text-xs text-white/30 leading-relaxed">
              Creating an account lets you save your progress and pick up where you left off. No payment is required to submit your application.
            </p>
          </div>
        </div>

        {/* ── Right: form panel ── */}
        <div className="w-full lg:w-[400px] flex-shrink-0">
          <h1
            className="font-display text-4xl sm:text-5xl leading-none mb-2"
            style={{ color: "hsl(var(--golden))" }}
          >
            {titles[mode]}
          </h1>
          <div className="w-12 h-0.5 mt-4 mb-4" style={{ backgroundColor: "hsl(var(--golden))" }} />
          <p className="font-body text-sm text-white/50 mb-8 leading-relaxed">
            {subtitles[mode]}
          </p>

        {/* Signup: check-your-email confirmation */}
        {checkEmail ? (
          <div
            className="text-center py-10 px-6 border"
            style={{ borderColor: "hsl(var(--golden) / 0.3)", backgroundColor: "hsl(var(--golden) / 0.05)" }}
          >
            <h2 className="font-display text-3xl leading-none mb-4" style={{ color: "hsl(var(--golden))" }}>
              CHECK YOUR EMAIL
            </h2>
            <p className="font-body text-sm text-white/60 leading-relaxed">
              We've sent a confirmation link to <span className="text-white/90">{email}</span>.
              Click it to verify your account, then come back here to sign in.
            </p>
            <button
              onClick={() => switchMode("login")}
              className="mt-6 font-body text-xs uppercase tracking-wider underline"
              style={{ color: "hsl(var(--golden))" }}
            >
              I've verified — sign in
            </button>
          </div>

        /* Forgot: reset email sent confirmation */
        ) : resetSent ? (
          <div
            className="text-center py-10 px-6 border"
            style={{ borderColor: "hsl(var(--golden) / 0.3)", backgroundColor: "hsl(var(--golden) / 0.05)" }}
          >
            <h2 className="font-display text-3xl leading-none mb-4" style={{ color: "hsl(var(--golden))" }}>
              CHECK YOUR EMAIL
            </h2>
            <p className="font-body text-sm text-white/60 leading-relaxed">
              A reset link has been sent to <span className="text-white/90">{email}</span>.
              Click it to set a new password.
            </p>
            <button
              onClick={() => switchMode("login")}
              className="mt-6 font-body text-xs uppercase tracking-wider underline"
              style={{ color: "hsl(var(--golden))" }}
            >
              Back to sign in
            </button>
          </div>

        /* Main form */
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={labelCls} style={{ color: "hsl(var(--golden))" }}>
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
                placeholder="you@email.com"
                autoComplete="email"
              />
            </div>

            {mode !== "forgot" && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={labelCls} style={{ color: "hsl(var(--golden))" }}>
                    Password
                  </label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => switchMode("forgot")}
                      className="font-body text-xs text-white/40 hover:text-white/70 transition-colors underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputCls} pr-12`}
                    placeholder="Min. 8 characters"
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {error && <p className="font-body text-xs text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 font-display text-2xl tracking-wider transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-60"
              style={{ backgroundColor: "hsl(var(--golden))", color: "hsl(var(--charcoal))" }}
              onMouseEnter={(e) => {
                if (!loading) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "hsl(var(--golden-dark))";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "hsl(var(--golden))";
              }}
            >
              {loading && <Loader2 size={20} className="animate-spin" />}
              {loading ? "..." : mode === "signup" ? "CREATE ACCOUNT" : mode === "login" ? "SIGN IN" : "SEND RESET LINK"}
            </button>

            <p className="text-center font-body text-xs text-white/40 pt-2">
              {mode === "forgot" ? (
                <>
                  Remember your password?{" "}
                  <button type="button" onClick={() => switchMode("login")} className="underline" style={{ color: "hsl(var(--golden))" }}>
                    Sign in
                  </button>
                </>
              ) : mode === "signup" ? (
                <>
                  Already have an account?{" "}
                  <button type="button" onClick={() => switchMode("login")} className="underline" style={{ color: "hsl(var(--golden))" }}>
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <button type="button" onClick={() => switchMode("signup")} className="underline" style={{ color: "hsl(var(--golden))" }}>
                    Create one
                  </button>
                </>
              )}
            </p>
          </form>
        )}

        {/* OAuth */}
        {!checkEmail && !resetSent && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="font-body text-[10px] tracking-[0.2em] uppercase text-white/40">
                OR CONTINUE WITH
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={oauthLoading}
              className="w-full py-3 font-body text-sm tracking-wider border border-white/15 flex items-center justify-center gap-2 rounded-sm bg-[#111111] hover:bg-[#181818] transition-colors disabled:opacity-60"
            >
              {oauthLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Connecting to Google...
                </>
              ) : (
                <>
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-[2px] bg-white">
                    <svg viewBox="0 0 48 48" className="h-4 w-4">
                      <path
                        fill="#EA4335"
                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.02 17.74 9.5 24 9.5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M46.98 24.55c0-1.57-.14-3.09-.39-4.55H24v9.02h12.94c-.56 2.9-2.25 5.36-4.79 7.01l7.73 6c4.52-4.18 7.1-10.34 7.1-17.48z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M10.54 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.12.79-4.54l-7.98-6.19A23.89 23.89 0 0 0 0 24c0 3.82.92 7.42 2.56 10.63l7.98-6.04z"
                      />
                      <path
                        fill="#34A853"
                        d="M24 48c6.48 0 11.93-2.13 15.9-5.86l-7.73-6c-2.15 1.45-4.92 2.3-8.17 2.3-6.26 0-11.57-4.22-13.47-9.85l-7.98 6.04C6.51 42.62 14.62 48 24 48z"
                      />
                      <path fill="none" d="M0 0h48v48H0z" />
                    </svg>
                  </span>
                  <span>Continue with Google</span>
                </>
              )}
            </button>
          </div>
        )}
        </div> {/* end right panel */}
      </div> {/* end flex container */}
    </main>
  );
}
