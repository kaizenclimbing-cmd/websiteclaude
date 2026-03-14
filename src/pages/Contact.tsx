import { useState, type FormEvent } from "react";
import { Instagram, Mail } from "lucide-react";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  comment: string;
  interests: string[];
};

const INTEREST_OPTIONS = [
  "6 Week Personalised Plan",
  "Remote Coaching",
  "Consultation Call",
  "Not Sure",
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

  const toggleInterest = (option: string) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(option)
        ? prev.interests.filter((i) => i !== option)
        : [...prev.interests, option],
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Contact form submission:", form);
    setSubmitted(true);
  };

  return (
    <main>
      {/* ── HEADER SPACER ── */}
      <div
        className="pt-16"
        style={{ backgroundColor: "hsl(var(--charcoal))" }}
      />

      {/* ── MAIN CONTENT ── */}
      <section className="section-white py-0 min-h-screen">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 min-h-[calc(100vh-4rem)]">
          {/* LEFT — Info */}
          <div
            className="flex flex-col justify-center px-10 py-16"
            style={{ backgroundColor: "hsl(var(--golden-dark))" }}
          >
            <h1
              className="font-display text-6xl sm:text-7xl leading-none mb-6"
              style={{ color: "hsl(var(--golden))" }}
            >
              GET IN TOUCH
            </h1>
            <p className="font-body text-base leading-relaxed text-white mb-10 max-w-sm opacity-90">
              Ready to start climbing stronger? Have a question about coaching or which plan is right for you? Drop us a message and we'll get back to you within 24 hours.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "hsl(var(--golden))" }}
                >
                  <Mail size={18} color="hsl(var(--charcoal))" />
                </div>
                <a
                  href="mailto:Info@kaizenclimbing.co.uk"
                  className="font-body text-sm text-white hover:text-golden transition-colors duration-200"
                  style={{ color: "hsl(var(--golden))" }}
                >
                  Info@kaizenclimbing.co.uk
                </a>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "hsl(var(--golden))" }}
                >
                  <Instagram size={18} color="hsl(var(--charcoal))" />
                </div>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm transition-colors duration-200"
                  style={{ color: "hsl(var(--golden))" }}
                >
                  @kaizenclimbingcoaching
                </a>
              </div>
            </div>

            <div
              className="mt-16 pt-8 border-t"
              style={{ borderColor: "hsl(var(--golden-deep))" }}
            >
              <p
                className="font-display text-2xl"
                style={{ color: "hsl(var(--golden))" }}
              >
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
            style={{ backgroundColor: "hsl(var(--golden))" }}
          >
            {submitted ? (
              <div className="text-center">
                <h2 className="font-display text-5xl leading-none text-charcoal mb-4">
                  MESSAGE SENT!
                </h2>
                <p className="font-body text-base text-charcoal opacity-80 mb-8 max-w-xs mx-auto">
                  Thanks for getting in touch. We'll be back in touch within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="font-body font-semibold text-sm uppercase tracking-wider underline text-charcoal"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="font-display text-5xl leading-none text-charcoal mb-6">
                  START YOUR JOURNEY
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-body text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      className="w-full px-4 py-3 font-body text-sm text-charcoal outline-none focus:ring-2 focus:ring-golden-dark bg-white"
                      style={{ border: "2px solid hsl(var(--golden-dark))" }}
                    />
                  </div>
                  <div>
                    <label className="block font-body text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      className="w-full px-4 py-3 font-body text-sm text-charcoal outline-none focus:ring-2 focus:ring-golden-dark bg-white"
                      style={{ border: "2px solid hsl(var(--golden-dark))" }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-body text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 font-body text-sm text-charcoal outline-none focus:ring-2 focus:ring-golden-dark bg-white"
                    style={{ border: "2px solid hsl(var(--golden-dark))" }}
                  />
                </div>

                <div>
                  <label className="block font-body text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    value={form.comment}
                    onChange={(e) => setForm({ ...form, comment: e.target.value })}
                    className="w-full px-4 py-3 font-body text-sm text-charcoal outline-none focus:ring-2 focus:ring-golden-dark bg-white resize-none"
                    style={{ border: "2px solid hsl(var(--golden-dark))" }}
                    placeholder="Tell us about your climbing goals..."
                  />
                </div>

                <div>
                  <p className="font-body text-xs font-semibold uppercase tracking-wider text-charcoal mb-2">
                    I'm interested in:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {INTEREST_OPTIONS.map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <div
                          className="w-5 h-5 flex-shrink-0 flex items-center justify-center transition-colors duration-150"
                          style={{
                            border: "2px solid hsl(var(--golden-dark))",
                            backgroundColor: form.interests.includes(option)
                              ? "hsl(var(--golden-dark))"
                              : "white",
                          }}
                          onClick={() => toggleInterest(option)}
                        >
                          {form.interests.includes(option) && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4L3.5 6.5L9 1" stroke="hsl(var(--golden))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <span
                          className="font-body text-xs font-medium text-charcoal select-none"
                          onClick={() => toggleInterest(option)}
                        >
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 font-display text-2xl tracking-wider transition-all duration-200"
                  style={{
                    backgroundColor: "hsl(var(--golden-dark))",
                    color: "hsl(var(--golden))",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor = "hsl(var(--charcoal))";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor = "hsl(var(--golden-dark))";
                  }}
                >
                  SUBMIT
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
