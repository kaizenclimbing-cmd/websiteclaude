import { createClient } from "npm:@supabase/supabase-js@2";

/** Replace {{token}} placeholders in an HTML string */
export function applyTokens(html: string, tokens: Record<string, string>): string {
  return Object.entries(tokens).reduce(
    (result, [key, value]) => result.replaceAll(`{{${key}}}`, value),
    html
  );
}

/** Fetch a template from the DB. Returns null if not found or on error. */
export async function fetchTemplate(
  templateId: string
): Promise<{ subject: string; html_body: string } | null> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) return null;

  const supabase = createClient(supabaseUrl, serviceKey);
  const { data, error } = await supabase
    .from("email_templates")
    .select("subject, html_body")
    .eq("template_id", templateId)
    .single();

  if (error || !data) return null;
  return data as { subject: string; html_body: string };
}
