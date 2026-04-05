import { supabase } from "@/integrations/supabase/client";

export type FingerGuideSource = "slide_up" | "inline_home" | "inline_training";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidLeadEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim().toLowerCase());
}

export async function submitFingerGuideLead(
  email: string,
  source: FingerGuideSource
): Promise<{ error: string | null }> {
  const trimmed = email.trim().toLowerCase();
  if (!isValidLeadEmail(trimmed)) {
    return { error: "Please enter a valid email address." };
  }

  const { error } = await supabase.from("finger_guide_leads").insert({
    email: trimmed,
    consent_marketing: true,
    source,
  });

  if (error) {
    return { error: error.message || "Something went wrong. Please try again." };
  }
  return { error: null };
}

export const FINGER_GUIDE_SUBSCRIBED_KEY = "kaizen_finger_guide_subscribed_v1";
export const FINGER_GUIDE_DISMISS_SESSION_KEY = "kaizen_finger_guide_dismiss_session_v1";

export function isFingerGuideSubscribed(): boolean {
  try {
    if (localStorage.getItem(FINGER_GUIDE_SUBSCRIBED_KEY) === "1") return true;
    // Visitors arriving from the guide email (?ref=guide) already have it — suppress all CTAs
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("ref") === "guide") {
      setFingerGuideSubscribed(); // persist so it survives navigation within the session
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function setFingerGuideSubscribed(): void {
  try {
    localStorage.setItem(FINGER_GUIDE_SUBSCRIBED_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function isFingerGuideDismissedThisSession(): boolean {
  try {
    return sessionStorage.getItem(FINGER_GUIDE_DISMISS_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function setFingerGuideDismissedThisSession(): void {
  try {
    sessionStorage.setItem(FINGER_GUIDE_DISMISS_SESSION_KEY, "1");
  } catch {
    /* ignore */
  }
}
