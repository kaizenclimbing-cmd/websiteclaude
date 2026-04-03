import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function ConsultationOAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      if (session) {
        navigate("/consultation/next", { replace: true });
      } else {
        navigate("/consultation/auth", { replace: true });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      if (session) {
        navigate("/consultation/next", { replace: true });
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "hsl(var(--charcoal))" }}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-8 h-8 border-2 animate-spin"
          style={{
            borderColor: "hsl(var(--golden))",
            borderTopColor: "transparent",
          }}
        />
        <p className="font-body text-xs text-white/60 tracking-wide uppercase">
          Completing sign-in with Google…
        </p>
      </div>
    </main>
  );
}

