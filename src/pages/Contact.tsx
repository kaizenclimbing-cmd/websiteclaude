import { useState, type FormEvent } from "react";
import { Instagram, Mail, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  comment: string;
  interests: string[];
};

const INTEREST_OPTIONS = [
  "6 WEEK PERSONALISED PLAN",
  "REMOTE COACHING",
  "CONSULTATION CALL",
  "NOT SURE",
];

const ContactPage = () => {
  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    comment: "",
    interests: [],
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleInterest = (option: string) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(option)
        ? prev.interests.filter((i) => i !== option)
        : [...prev.interests, option],
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertError } = await (supabase as any)
      .from("contact_submissions")
      .insert({
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        message: form.comment || null,
        interests: form.interests.length > 0 ? form.interests : null,
      });

    if (insertError) {
      setLoading(false);
      setError("Something went wrong. Please try again or email us directly.");
      return;
    }

    const emailPayload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      message: form.comment || undefined,
      interests: form.interests,
    };
    Promise.all([
      supabase.functions.invoke("send-contact-confirmation", { body: emailPayload }),
      supabase.functions.invoke("send-admin-notification", { body: emailPayload }),
    ]).catch((emailErr) => {
      console.warn("Email(s) failed (non-critical):", emailErr);
    });

    setLoading(false);
    setSubmitted(true);
  };

  return (
    <main>
      <div className="pt-16" style={{ backgroundColor: "hsl(var(--olive-dark))" }} />

      <section className="min-h-screen" style={{ backgroundColor: "hsl(0 0% 100%)" }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 min-h-[calc(100vh-4rem)]">

          {/* LEFT — Info */}
          <div
            className="flex flex-col justify-center px-10 py-16"
            style={{ backgroundColor: "hsl(var(--olive))" }}
          >
            <h1
              className="font-display text-4xl sm:text-5xl leading-tight mb-4 text-white"
            >
              Contact Us
            </h1>
            <p className="font-body text-base leading-relaxed text-white mb-10 max-w-sm opacity-80">
              If you are interested in a training plan or want to know more get in touch via email or use the form.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "hsl(var(--yellow))" }}
                >
                  <Mail size={18} color="hsl(var(--near-black))" />
                </div>
                <a
                  href="mailto:Info@kaizenclimbing.co.uk"
                  className="font-body text-sm hover:opacity-80 transition-opacity"
                  style={{ color: "hsl(var(--yellow))" }}
                >
                  Info@kaizenclimbing.co.uk
                </a>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "hsl(var(--yellow))" }}
                >
                  <Instagram size={18} color="hsl(var(--near-black))" />
                </div>
                <a
                  href="https://www.instagram.com/kaizenclimbing/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm hover:opacity-80 transition-opacity"
                  style={{ color: "hsl(var(--yellow))" }}
                >
                  @kaizenclimbing
                </a>
              </div>
            </div>

            <div className="mt-16 pt-8 border-t" style={{ borderColor: "hsl(var(--olive-dark))" }}>
              <p className="font-display text-lg text-white">
                KAIZEN CLIMBING COACHING
              </p>
              <p className="font-body text-xs text-white opacity-50 mt-1">
                Remote coaching. Real results.
              </p>
            </div>
          </div>

          {/* RIGHT — Form */}
          <div
            className="flex flex-col justify-center px-10 py-16"
            style={{ backgroundColor: "hsl(var(--yellow))" }}
          >
            {submitted ? (
              <div className="text-center">
                <h2 className="font-display text-4xl leading-none mb-4" style={{ color: "hsl(var(--near-black))" }}>
                  MESSAGE SENT!
                </h2>
                <p className="font-body text-base opacity-80 mb-8 max-w-xs mx-auto" style={{ color: "hsl(var(--near-black))" }}>
                  Thanks for getting in touch. We'll be back in touch within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ firstName: "", lastName: "", email: "", comment: "", interests: [] });
                  }}
                  className="font-body font-semibold text-sm uppercase tracking-wider underline"
                  style={{ color: "hsl(var(--near-black))" }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="font-display text-3xl sm:text-4xl leading-tight mb-6" style={{ color: "hsl(var(--near-black))" }}>
                  GET IN TOUCH
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-body text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "hsl(var(--near-black))" }}>
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      className="w-full px-4 py-3 font-body text-sm outline-none focus:ring-2 bg-white"
                      style={{ color: "hsl(var(--near-black))", border: "2px solid hsl(var(--near-black))" }}
                    />
                  </div>
                  <div>
                    <label className="block font-body text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "hsl(var(--near-black))" }}>
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      className="w-full px-4 py-3 font-body text-sm outline-none focus:ring-2 bg-white"
                      style={{ color: "hsl(var(--near-black))", border: "2px solid hsl(var(--near-black))" }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-body text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "hsl(var(--near-black))" }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 font-body text-sm outline-none focus:ring-2 bg-white"
                    style={{ color: "hsl(var(--near-black))", border: "2px solid hsl(var(--near-black))" }}
                  />
                </div>

                <div>
                  <label className="block font-body text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "hsl(var(--near-black))" }}>
                    Comment
                  </label>
                  <textarea
                    rows={4}
                    value={form.comment}
                    onChange={(e) => setForm({ ...form, comment: e.target.value })}
                    className="w-full px-4 py-3 font-body text-sm outline-none focus:ring-2 bg-white resize-none"
                    style={{ color: "hsl(var(--near-black))", border: "2px solid hsl(var(--near-black))" }}
                  />
                </div>

                <div>
                  <p className="font-body text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "hsl(var(--near-black))" }}>
                    I'm interested in:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {INTEREST_OPTIONS.map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => toggleInterest(option)}
                      >
                        <div
                          className="w-5 h-5 flex-shrink-0 flex items-center justify-center transition-colors duration-150"
                          style={{
                            border: "2px solid hsl(var(--near-black))",
                            backgroundColor: form.interests.includes(option)
                              ? "hsl(var(--near-black))"
                              : "white",
                          }}
                        >
                          {form.interests.includes(option) && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4L3.5 6.5L9 1" stroke="hsl(var(--yellow))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <span className="font-body text-xs font-medium select-none" style={{ color: "hsl(var(--near-black))" }}>
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {error && (
                  <p className="font-body text-xs text-red-700">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 font-display text-xl tracking-wider transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-60"
                  style={{
                    backgroundColor: "hsl(var(--near-black))",
                    color: "hsl(var(--yellow))",
                  }}
                >
                  {loading && <Loader2 size={20} className="animate-spin" />}
                  {loading ? "SENDING..." : "SUBMIT"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
