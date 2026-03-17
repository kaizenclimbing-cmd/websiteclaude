import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export default function BookPage() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "training-consultations-2025" });
      cal("ui", {
        theme: "dark",
        cssVarsPerTheme: {
          light: { "cal-brand": "#E0B755" },
          dark: { "cal-brand": "#E0B755" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <main
      className="min-h-screen w-full"
      style={{ backgroundColor: "hsl(var(--void-black))" }}
    >
      <Cal
        namespace="training-consultations-2025"
        calLink="kaizenclimbing/training-consultations-2025"
        style={{ width: "100%", height: "100vh", overflow: "scroll" }}
        config={{
          layout: "month_view",
          useSlotsViewOnSmallScreen: "true",
          theme: "dark",
        }}
      />
    </main>
  );
}
