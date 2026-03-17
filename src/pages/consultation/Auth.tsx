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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "signup") {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/consultation/next` },
      });
      if (signUpError) {
        setError(signUpError.message);
      } else if (data.user && data.user.identities && data.user.identities.length === 0) {
        // Account already exists — silently switch to login
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

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 py-16"
      style={{ backgroundColor: "hsl(var(--charcoal))" }}
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <p
          className="font-mono text-xs tracking-[0.3em] text-center mb-4"
          style={{ color: "hsl(var(--golden) / 0.5)" }}
        >
          // KAIZEN CLIMBING COACHING
        </p>
        <h1
          className="font-display text-5xl sm:text-6xl leading-none mb-2 text-center"
          style={{ color: "hsl(var(--golden))" }}
        >
          {mode === "signup" ? "CREATE ACCOUNT" : "SIGN IN"}
        </h1>
        <div
          className="w-16 h-0.5 mx-auto mt-4 mb-4"
          style={{ backgroundColor: "hsl(var(--golden))" }}
        />
        <p className="font-body text-sm text-center text-white/50 mb-10 leading-relaxed">
          {mode === "signup"
            ? "Create a free account to start your consultation. Your progress will be saved across devices."
            : "Welcome back — sign in to continue your consultation."}
        </p>

        {checkEmail ? (
          <div
            className="text-center py-10 px-6 border"
            style={{ borderColor: "hsl(var(--golden) / 0.3)", backgroundColor: "hsl(var(--golden) / 0.05)" }}
          >
            <h2
              className="font-display text-3xl leading-none mb-4"
              style={{ color: "hsl(var(--golden))" }}
            >
              CHECK YOUR EMAIL
            </h2>
            <p className="font-body text-sm text-white/60 leading-relaxed">
              We've sent a confirmation link to <span className="text-white/90">{email}</span>.
              Click it to verify your account, then come back here to sign in.
            </p>
            <button
              onClick={() => { setCheckEmail(false); setMode("login"); }}
              className="mt-6 font-body text-xs uppercase tracking-wider underline"
              style={{ color: "hsl(var(--golden))" }}
            >
              I've verified — sign in
            </button>
          </div>
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

            <div>
              <label className={labelCls} style={{ color: "hsl(var(--golden))" }}>
                Password
              </label>
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

            {error && <p className="font-body text-xs text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 font-display text-2xl tracking-wider transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-60"
              style={{ backgroundColor: "hsl(var(--golden))", color: "hsl(var(--charcoal))" }}
              onMouseEnter={(e) => {
                if (!loading)
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "hsl(var(--golden-dark))";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "hsl(var(--golden))";
              }}
            >
              {loading && <Loader2 size={20} className="animate-spin" />}
              {loading ? "..." : mode === "signup" ? "CREATE ACCOUNT" : "SIGN IN"}
            </button>

            <p className="text-center font-body text-xs text-white/40 pt-2">
              {mode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError(""); }}
                className="underline"
                style={{ color: "hsl(var(--golden))" }}
              >
                {mode === "signup" ? "Sign in" : "Create one"}
              </button>
            </p>
          </form>
        )}
      </div>
    </main>
  );
}
