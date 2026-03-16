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
      setError("Invalid email or password.");
    } else {
      navigate("/admin");
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "hsl(var(--charcoal))" }}
    >
      <div className="w-full max-w-sm px-8">
        <p
          className="font-display text-4xl tracking-wider mb-1"
          style={{ color: "hsl(var(--golden))" }}
        >
          KAIZEN
        </p>
        <p className="font-body text-xs uppercase tracking-widest text-white opacity-40 mb-10">
          Admin Portal
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block font-body text-xs font-semibold uppercase tracking-wider mb-1"
              style={{ color: "hsl(var(--golden))" }}
            >
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 font-body text-sm outline-none focus:ring-2 bg-white text-near-black"
              style={{ border: "2px solid hsl(var(--golden-dark))" }}
            />
          </div>

          <div>
            <label
              className="block font-body text-xs font-semibold uppercase tracking-wider mb-1"
              style={{ color: "hsl(var(--golden))" }}
            >
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 font-body text-sm outline-none focus:ring-2 bg-white text-near-black"
              style={{ border: "2px solid hsl(var(--golden-dark))" }}
            />
          </div>

          {error && (
            <p className="font-body text-xs text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 font-display text-2xl tracking-wider transition-all duration-200 disabled:opacity-60"
            style={{
              backgroundColor: "hsl(var(--golden))",
              color: "hsl(var(--charcoal))",
            }}
            onMouseEnter={(e) => {
              if (!loading) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "hsl(var(--golden-dark))";
              if (!loading) (e.currentTarget as HTMLButtonElement).style.color = "hsl(var(--golden))";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "hsl(var(--golden))";
              (e.currentTarget as HTMLButtonElement).style.color = "hsl(var(--charcoal))";
            }}
          >
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default AdminLogin;
