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

  const inputStyle = {
    backgroundColor: "hsl(var(--void-black))",
    color: "hsl(var(--chalk-white))",
    border: "2px solid hsl(var(--void-light))",
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "13px",
  };

  return (
    <main style={{ backgroundColor: "hsl(var(--void-black))" }}>
      <div className="pt-16" />

      <section className="min-h-screen">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 min-h-[calc(100vh-4rem)]">

          {/* LEFT — Info */}
          <div
            className="flex flex-col justify-center px-10 py-16"
            style={{
              backgroundColor: "hsl(var(--void-dark))",
              borderRight: "2px solid hsl(var(--neon-green))",
            }}
          >
            <p
              className="font-mono text-xs tracking-[0.25em] mb-3"
              style={{ color: "hsl(var(--neon-orange))" }}
            >
              // CONTACT
            </p>
            <h1
              className="font-display text-4xl sm:text-5xl leading-tight mb-4"
              style={{ color: "hsl(var(--chalk-white))" }}
            >
              Contact Us
            </h1>
            <p
              className="font-mono text-sm leading-relaxed mb-6 max-w-sm"
              style={{ color: "hsl(var(--chalk-white) / 0.6)" }}
            >
              If you are interested in a training plan or want to know more get in touch via email or use the form.
            </p>

            <div
              className="px-5 py-4 mb-8"
              style={{
                border: "1px solid hsl(var(--neon-orange) / 0.5)",
                backgroundColor: "hsl(var(--void-black))",
                borderLeft: "3px solid hsl(var(--neon-orange))",
              }}
            >
              <p
                className="font-display text-xs mb-1"
                style={{ color: "hsl(var(--neon-orange))" }}
              >
                FREE CONSULTATION CALL
              </p>
              <p
                className="font-mono text-xs leading-relaxed"
                style={{ color: "hsl(var(--chalk-white) / 0.55)" }}
              >
                Not sure which plan is right for you? We offer a free initial call to talk through your goals and find the best fit — no commitment required.
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "hsl(var(--neon-green))" }}
                >
                  <Mail size={18} color="hsl(var(--void-black))" />
                </div>
                <a
                  href="mailto:Info@kaizenclimbing.co.uk"
                  className="font-mono text-sm hover:opacity-80 transition-opacity"
                  style={{ color: "hsl(var(--neon-green))" }}
                >
                  Info@kaizenclimbing.co.uk
                </a>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "hsl(var(--neon-orange))" }}
                >
                  <Instagram size={18} color="hsl(var(--chalk-white))" />
                </div>
                <a
                  href="https://www.instagram.com/kaizenclimbing/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm hover:opacity-80 transition-opacity"
                  style={{ color: "hsl(var(--neon-orange))" }}
                >
                  @kaizenclimbing
                </a>
              </div>
            </div>

            <div
              className="mt-16 pt-8 border-t"
              style={{ borderColor: "hsl(var(--void-light))" }}
            >
              <p className="font-display text-base" style={{ color: "hsl(var(--chalk-white))" }}>
                KAIZEN CLIMBING COACHING
              </p>
              <p className="font-mono text-xs mt-1" style={{ color: "hsl(var(--chalk-white) / 0.4)" }}>
                Remote coaching. Real results.
              </p>
            </div>
          </div>

          {/* RIGHT — Form */}
          <div
            className="flex flex-col justify-center px-10 py-16"
            style={{ backgroundColor: "hsl(var(--void-mid))" }}
          >
            {submitted ? (
              <div className="text-center">
                <p
                  className="font-mono text-xs tracking-[0.25em] mb-4"
                  style={{ color: "hsl(var(--neon-green))" }}
                >
                  // MESSAGE SENT
                </p>
                <h2
                  className="font-display text-4xl leading-none mb-4"
                  style={{ color: "hsl(var(--neon-green))" }}
                >
                  MESSAGE SENT!
                </h2>
                <p
                  className="font-mono text-sm mb-8 max-w-xs mx-auto"
                  style={{ color: "hsl(var(--chalk-white) / 0.6)" }}
                >
                  Thanks for getting in touch. We'll be back in touch within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ firstName: "", lastName: "", email: "", comment: "", interests: [] });
                  }}
                  className="font-mono text-xs uppercase tracking-wider underline"
                  style={{ color: "hsl(var(--neon-orange))" }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p
                  className="font-mono text-xs tracking-[0.25em] mb-2"
                  style={{ color: "hsl(var(--neon-orange))" }}
                >
                  // GET IN TOUCH
                </p>
                <h2
                  className="font-display text-3xl sm:text-4xl leading-tight mb-6"
                  style={{ color: "hsl(var(--chalk-white))" }}
                >
                  GET IN TOUCH
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block font-mono text-xs font-semibold uppercase tracking-wider mb-1"
                      style={{ color: "hsl(var(--neon-green))" }}
                    >
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      className="w-full px-4 py-3 outline-none focus:ring-2 focus:ring-neon-green"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label
                      className="block font-mono text-xs font-semibold uppercase tracking-wider mb-1"
                      style={{ color: "hsl(var(--neon-green))" }}
                    >
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      className="w-full px-4 py-3 outline-none focus:ring-2 focus:ring-neon-green"
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="block font-mono text-xs font-semibold uppercase tracking-wider mb-1"
                    style={{ color: "hsl(var(--neon-green))" }}
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 outline-none focus:ring-2 focus:ring-neon-green"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label
                    className="block font-mono text-xs font-semibold uppercase tracking-wider mb-1"
                    style={{ color: "hsl(var(--neon-green))" }}
                  >
                    Comment
                  </label>
                  <textarea
                    rows={4}
                    value={form.comment}
                    onChange={(e) => setForm({ ...form, comment: e.target.value })}
                    className="w-full px-4 py-3 outline-none focus:ring-2 focus:ring-neon-green resize-none"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <p
                    className="font-mono text-xs font-semibold uppercase tracking-wider mb-3"
                    style={{ color: "hsl(var(--neon-green))" }}
                  >
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
                            border: "2px solid hsl(var(--neon-green))",
                            backgroundColor: form.interests.includes(option)
                              ? "hsl(var(--neon-green))"
                              : "transparent",
                          }}
                        >
                          {form.interests.includes(option) && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path
                                d="M1 4L3.5 6.5L9 1"
                                stroke="hsl(var(--void-black))"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                        <span
                          className="font-mono text-xs select-none"
                          style={{ color: "hsl(var(--chalk-white) / 0.75)" }}
                        >
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {error && (
                  <p className="font-mono text-xs" style={{ color: "hsl(var(--neon-orange))" }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 font-display text-xl tracking-wider transition-all duration-150 flex items-center justify-center gap-3 disabled:opacity-60"
                  style={{
                    backgroundColor: "hsl(var(--neon-green))",
                    color: "hsl(var(--void-black))",
                    clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)",
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
