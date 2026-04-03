import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const checkAdmin = async (s: Session | null) => {
      setSession(s);
      if (!s) { setIsAdmin(false); return; }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", s.user.id)
        .eq("role", "admin")
        .single();
      setIsAdmin(!!data);
    };

    supabase.auth.getSession().then(({ data: { session: s } }) => checkAdmin(s));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      checkAdmin(s);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined || isAdmin === undefined) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "hsl(var(--charcoal))" }}
      >
        <div
          className="w-8 h-8 border-2 animate-spin"
          style={{
            borderColor: "hsl(var(--golden))",
            borderTopColor: "transparent",
          }}
        />
      </div>
    );
  }

  if (!session) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
