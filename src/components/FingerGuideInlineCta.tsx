import { useEffect, useState } from "react";
import FingerGuideLeadForm from "@/components/FingerGuideLeadForm";
import { isFingerGuideSubscribed, type FingerGuideSource } from "@/lib/fingerGuideLead";

type Props = {
  source: Extract<FingerGuideSource, "inline_home" | "inline_training">;
};

export default function FingerGuideInlineCta({ source }: Props) {
  const [subscribed, setSubscribed] = useState(isFingerGuideSubscribed);

  useEffect(() => {
    setSubscribed(isFingerGuideSubscribed());
  }, []);

  return (
    <section
      className="border-y-2"
      style={{
        backgroundColor: "hsl(var(--void-mid))",
        borderColor: "hsl(var(--neon-green) / 0.35)",
      }}
    >
      <div className="max-w-3xl mx-auto px-6 py-10">
        <p
          className="font-mono text-[0.6rem] tracking-[0.2em] mb-2"
          style={{ color: "hsl(var(--neon-orange))" }}
        >
          // FREE DOWNLOAD
        </p>
        <h2 className="font-display text-2xl sm:text-3xl mb-3" style={{ color: "hsl(var(--chalk-white))" }}>
          Free finger training guide
        </h2>
        {subscribed ? (
          <p className="font-mono text-sm" style={{ color: "hsl(var(--neon-green))" }}>
            You&apos;re on the list — we&apos;ll send the guide to your inbox shortly.
          </p>
        ) : (
          <>
            <p className="font-mono text-sm leading-relaxed mb-6" style={{ color: "hsl(var(--chalk-white) / 0.5)" }}>
              Get the guide by email — structured ideas you can use in your own training, whether you coach yourself or
              train with us.
            </p>
            <FingerGuideLeadForm source={source} onSuccess={() => setSubscribed(true)} />
          </>
        )}
      </div>
    </section>
  );
}
