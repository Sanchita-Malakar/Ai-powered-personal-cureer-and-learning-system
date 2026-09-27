import { supabase, isSupabaseConfigured } from "@/supabaseClient";

/**
 * Client-side fetch helper that attaches the authenticated Supabase Bearer token
 * to guarantee strict multi-tenant isolation on the server.
 */
export async function authenticatedFetch(
  input: string | URL,
  init?: RequestInit
): Promise<Response> {
  const headers = new Headers(init?.headers);

  // If Supabase is configured, attach JWT Bearer token
  if (isSupabaseConfigured) {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    } catch {
      // Session fetch error fallback
    }
  }

  // Ensure Content-Type is application/json for requests with JSON body
  if (
    init?.body &&
    typeof init.body === "string" &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(input, {
    ...init,
    headers,
  });
}
