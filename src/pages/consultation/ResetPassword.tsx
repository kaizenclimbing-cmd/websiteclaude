import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const labelCls = "block font-body text-xs font-semibold uppercase tracking-wider mb-1.5";
const inputCls =
  "w-full px-4 py-3 font-body text-sm outline-none focus:ring-2 bg-[#1a1a1a] text-white placeholder-white/30 border border-white/10 focus:border-golden focus:ring-golden/20";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [isRecovery, setIsRecovery] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Supabase puts the recovery token in the URL hash — listen for the session event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setIsRecovery(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
    } else {
      setDone(true);
      setTimeout(() => navigate("/consultation/next"), 2500);
    }
    setLoading(false);
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 py-16"
      style={{ backgroundColor: "hsl(var(--charcoal))" }}
    >
      <div className="w-full max-w-md">
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
          {done ? "PASSWORD SET" : "NEW PASSWORD"}
        </h1>
        <div className="w-16 h-0.5 mx-auto mt-4 mb-10" style={{ backgroundColor: "hsl(var(--golden))" }} />

        {done ? (
          <p className="text-center font-body text-sm text-white/60">
            Password updated. Redirecting you now…
          </p>
        ) : !isRecovery ? (
          <p className="text-center font-body text-sm text-white/50">
            This link has expired or is invalid. Please request a new one from the{" "}
            <a href="/consultation/auth" style={{ color: "hsl(var(--golden))" }} className="underline">
              sign-in page
            </a>.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={labelCls} style={{ color: "hsl(var(--golden))" }}>
                New password
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
                  autoComplete="new-password"
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
            >
              {loading && <Loader2 size={20} className="animate-spin" />}
              {loading ? "..." : "SET PASSWORD"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
