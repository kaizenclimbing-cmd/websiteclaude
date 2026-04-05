import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";
import FingerGuideLeadForm from "@/components/FingerGuideLeadForm";
import {
  isFingerGuideSubscribed,
  isFingerGuideDismissedThisSession,
  setFingerGuideDismissedThisSession,
} from "@/lib/fingerGuideLead";

const SHOW_PATHS = new Set(["/", "/training-tips"]);
const SCROLL_THRESHOLD = 0.32;
const DELAY_MS = 10_000;

export default function FingerGuideSlideUp() {
  const { pathname } = useLocation();
  const allowed = SHOW_PATHS.has(pathname);

  const [subscribed, setSubscribed] = useState(isFingerGuideSubscribed);
  const [dismissedSession, setDismissedSession] = useState(isFingerGuideDismissedThisSession);
  const [triggered, setTriggered] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSubscribed(isFingerGuideSubscribed());
    setDismissedSession(isFingerGuideDismissedThisSession());
    if (!SHOW_PATHS.has(pathname)) setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!allowed || subscribed || dismissedSession) return;
    const t = window.setTimeout(() => setTriggered(true), DELAY_MS);
    return () => window.clearTimeout(t);
  }, [allowed, subscribed, dismissedSession]);

  useEffect(() => {
    if (!allowed || subscribed || dismissedSession) return;
    const onScroll = () => {
      const el = document.documentElement;
      const scrollable = el.scrollHeight - el.clientHeight;
      if (scrollable <= 0) return;
      const ratio = el.scrollTop / scrollable;
      if (ratio >= SCROLL_THRESHOLD) setTriggered(true);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [allowed, subscribed, dismissedSession]);

  useEffect(() => {
    if (triggered && allowed && !subscribed && !dismissedSession) setOpen(true);
  }, [triggered, allowed, subscribed, dismissedSession]);

  const handleClose = useCallback(() => {
    setFingerGuideDismissedThisSession();
    setDismissedSession(true);
    setOpen(false);
  }, []);

  const handleSuccess = useCallback(() => {
    setSubscribed(true);
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Close"
        className="fixed inset-0 z-[60] bg-black/50"
        onClick={handleClose}
      />
      <div
        className="fixed bottom-0 left-0 right-0 z-[61] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] animate-in slide-in-from-bottom-4 duration-300"
        style={{ pointerEvents: "none" }}
      >
        <div
          className="relative mx-auto max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl"
          style={{
            pointerEvents: "auto",
            backgroundColor: "hsl(var(--void-dark))",
            border: "1px solid hsl(var(--neon-green) / 0.45)",
            borderBottom: "none",
            borderRadius: "4px 4px 0 0",
          }}
        >
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 opacity-50 hover:opacity-100 transition-opacity p-1"
            aria-label="Dismiss"
          >
            <X size={20} style={{ color: "hsl(var(--chalk-white))" }} />
          </button>

          <div className="p-6 pr-14">
            <p
              className="font-mono text-[0.6rem] tracking-[0.2em] mb-2"
              style={{ color: "hsl(var(--neon-orange))" }}
            >
              // FREE RESOURCE
            </p>
            <h2 className="font-display text-xl sm:text-2xl leading-tight mb-2" style={{ color: "hsl(var(--chalk-white))" }}>
              Finger training guide
            </h2>
            <p className="font-mono text-xs leading-relaxed mb-5" style={{ color: "hsl(var(--chalk-white) / 0.5)" }}>
              Practical principles and exercises to train fingers smarter — straight to your inbox.
            </p>
            <FingerGuideLeadForm source="slide_up" compact onSuccess={handleSuccess} />
          </div>
        </div>
      </div>
    </>
  );
}
