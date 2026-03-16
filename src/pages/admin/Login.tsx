import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError("// ERROR: Invalid credentials. Access denied.");
    } else {
      navigate("/admin");
    }
  };

  const inputStyle = {
    backgroundColor: "hsl(var(--void-black))",
    color: "hsl(var(--chalk-white))",
    border: "2px solid hsl(var(--void-light))",
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "14px",
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundColor: "hsl(var(--void-black))",
        backgroundImage: `
          linear-gradient(hsl(var(--neon-green) / 0.04) 1px, transparent 1px),
          linear-gradient(90deg, hsl(var(--neon-green) / 0.04) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }}
    >
      <div
        className="w-full max-w-sm px-8 py-10"
        style={{
          backgroundColor: "hsl(var(--void-dark))",
          border: "3px solid hsl(var(--neon-green))",
        }}
      >
        <p
          className="font-mono text-xs tracking-[0.3em] mb-1"
          style={{ color: "hsl(var(--neon-orange))" }}
        >
          // ADMIN_PORTAL.EXE
        </p>
        <p
          className="font-display text-3xl tracking-wider mb-1 glow-green"
          style={{ color: "hsl(var(--neon-green))" }}
        >
          KAIZEN
        </p>
        <p
          className="font-mono text-xs uppercase tracking-widest mb-10"
          style={{ color: "hsl(var(--chalk-white) / 0.4)" }}
        >
          Restricted Access
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block font-mono text-xs font-semibold uppercase tracking-wider mb-1"
              style={{ color: "hsl(var(--neon-green))" }}
            >
              &gt; Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 outline-none focus:ring-2 focus:ring-neon-green"
              style={inputStyle}
            />
          </div>

          <div>
            <label
              className="block font-mono text-xs font-semibold uppercase tracking-wider mb-1"
              style={{ color: "hsl(var(--neon-green))" }}
            >
              &gt; Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 outline-none focus:ring-2 focus:ring-neon-green"
              style={inputStyle}
            />
          </div>

          {error && (
            <p className="font-mono text-xs" style={{ color: "hsl(var(--neon-orange))" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 font-display text-xl tracking-wider transition-all duration-150 disabled:opacity-60 mt-2"
            style={{
              backgroundColor: loading ? "hsl(var(--void-mid))" : "hsl(var(--neon-green))",
              color: "hsl(var(--void-black))",
              clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)",
            }}
          >
            {loading ? "AUTHENTICATING..." : "SIGN IN"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default AdminLogin;
