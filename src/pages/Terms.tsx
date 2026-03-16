import { Link } from "react-router-dom";

const sections = [
  {
    title: "Introduction",
    body: "Welcome to our online climbing coaching service. By using our Service, you agree to be bound by the following terms and conditions. If you do not agree to these Terms of Service, please do not use the Service.",
  },
  {
    title: "Eligibility",
    body: "The Service is intended for use by individuals who are 18 years of age or older.",
  },
  {
    title: "Service Description",
    body: "Our Service provides individuals with access to experienced climbing coaches who will provide guidance, advice, and feedback on various aspects of climbing via direct message or email support. The Service includes personalized training plans or training recommendations, and regular check-ins with your coach. Responses to messages or emails will be provided within 72 hours, but we cannot guarantee a specific response time.",
  },
  {
    title: "Payment",
    body: "The Service is provided on a 12-week minimum subscription basis. Your subscription will automatically renew every 12 weeks unless you cancel with a minimum of 14 days notice before the next renewal date.",
  },
  {
    title: "Cancellation",
    body: "To cancel your subscription, contact us at info@kaizenclimbing.co.uk. Notice must be given at least 14 days prior to the date of plan renewal.",
  },
  {
    title: "Refund Policy",
    body: "You have the right to a refund within 14 days of signing up. The cost of any work already done, such as personalised training plans, will be excluded from the refund.",
  },
  {
    title: "Governing Law",
    body: "These Terms of Service shall be governed by the laws of the United Kingdom.",
  },
  {
    title: "Contact",
    body: "info@kaizenclimbing.co.uk",
  },
];

const TermsPage = () => {
  return (
    <main style={{ backgroundColor: "hsl(var(--void-black))" }}>
      <div className="pt-16" />

      {/* Header */}
      <section
        className="pt-16 pb-12"
        style={{
          backgroundColor: "hsl(var(--void-dark))",
          borderBottom: "3px solid hsl(var(--neon-green))",
        }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <p
            className="font-mono text-xs tracking-[0.3em] mb-3"
            style={{ color: "hsl(var(--neon-orange))" }}
          >
            // TERMS_AND_CONDITIONS.TXT
          </p>
          <h1
            className="font-display text-4xl sm:text-6xl leading-tight mb-4"
            style={{ color: "hsl(var(--chalk-white))" }}
          >
            TERMS &amp;<br />
            <span style={{ color: "hsl(var(--neon-green))" }}>CONDITIONS</span>
          </h1>
        </div>
      </section>

      {/* Content */}
      <section
        className="py-16"
        style={{ backgroundColor: "hsl(var(--void-mid))" }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-8">
            {sections.map((s, i) => (
              <div
                key={i}
                className="p-6"
                style={{
                  backgroundColor: "hsl(var(--void-black))",
                  borderLeft: "3px solid hsl(var(--neon-green))",
                }}
              >
                <p
                  className="font-mono text-xs tracking-widest mb-1"
                  style={{ color: "hsl(var(--neon-orange))" }}
                >
                  [{String(i + 1).padStart(2, "0")}]
                </p>
                <h2
                  className="font-display text-lg mb-3"
                  style={{ color: "hsl(var(--neon-green))" }}
                >
                  {s.title.toUpperCase()}
                </h2>
                <p
                  className="font-mono text-sm leading-relaxed"
                  style={{ color: "hsl(var(--chalk-white) / 0.7)" }}
                >
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer
        className="py-8 text-center"
        style={{
          backgroundColor: "hsl(var(--void-dark))",
          borderTop: "1px solid hsl(var(--void-light))",
        }}
      >
        <Link
          to="/"
          className="font-mono text-xs hover:opacity-70 transition-opacity"
          style={{ color: "hsl(var(--neon-green))" }}
        >
          &lt;-- BACK TO HOME
        </Link>
        <div
          className="mt-4 font-mono text-xs"
          style={{ color: "hsl(var(--chalk-white) / 0.3)" }}
        >
          © {new Date().getFullYear()} KAIZEN_CLIMBING_COACHING // ALL RIGHTS RESERVED
        </div>
      </footer>
    </main>
  );
};

export default TermsPage;
