import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Mail, Calendar, Tag } from "lucide-react";

type Submission = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  message: string | null;
  interests: string[] | null;
  submitted_at: string;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setAdminEmail(user.email ?? "");
    });

    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("submitted_at", { ascending: false });

    if (!error && data) setSubmissions(data as Submission[]);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "hsl(var(--charcoal))" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b"
        style={{
          backgroundColor: "hsl(var(--golden-dark))",
          borderColor: "hsl(var(--golden-deep))",
        }}
      >
        <div>
          <span
            className="font-display text-2xl tracking-wider"
            style={{ color: "hsl(var(--golden))" }}
          >
            KAIZEN
          </span>
          <span className="font-body text-xs text-white opacity-50 ml-3 uppercase tracking-widest">
            Enquiries
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-body text-xs text-white opacity-50 hidden sm:block">
            {adminEmail}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-wider px-3 py-2 transition-colors duration-200"
            style={{ color: "hsl(var(--golden))" }}
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-baseline justify-between mb-8">
          <h1
            className="font-display text-5xl tracking-wider"
            style={{ color: "hsl(var(--golden))" }}
          >
            ALL ENQUIRIES
          </h1>
          <span className="font-body text-sm text-white opacity-40">
            {submissions.length} total
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div
              className="w-8 h-8 border-2 animate-spin"
              style={{
                borderColor: "hsl(var(--golden))",
                borderTopColor: "transparent",
              }}
            />
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-body text-white opacity-30">
              No enquiries yet. Share the contact form and they'll appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="p-6 border"
                style={{
                  backgroundColor: "hsl(var(--golden-dark))",
                  borderColor: "hsl(var(--golden-deep))",
                }}
              >
                {/* Top row */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <p
                      className="font-display text-2xl tracking-wider"
                      style={{ color: "hsl(var(--golden))" }}
                    >
                      {sub.first_name} {sub.last_name}
                    </p>
                    <a
                      href={`mailto:${sub.email}`}
                      className="flex items-center gap-1.5 font-body text-sm text-white opacity-70 hover:opacity-100 transition-opacity mt-0.5"
                    >
                      <Mail size={12} />
                      {sub.email}
                    </a>
                  </div>
                  <div
                    className="flex items-center gap-1.5 font-body text-xs text-white opacity-50 mt-1"
                  >
                    <Calendar size={12} />
                    {formatDate(sub.submitted_at)}
                  </div>
                </div>

                {/* Interests */}
                {sub.interests && sub.interests.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {sub.interests.map((interest) => (
                      <span
                        key={interest}
                        className="flex items-center gap-1 font-body text-xs font-semibold uppercase tracking-wider px-2.5 py-1"
                        style={{
                          backgroundColor: "hsl(var(--golden))",
                          color: "hsl(var(--charcoal))",
                        }}
                      >
                        <Tag size={10} />
                        {interest}
                      </span>
                    ))}
                  </div>
                )}

                {/* Message */}
                {sub.message && (
                  <p className="font-body text-sm text-white opacity-70 leading-relaxed border-t pt-4"
                    style={{ borderColor: "hsl(var(--golden-deep))" }}
                  >
                    "{sub.message}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminDashboard;
