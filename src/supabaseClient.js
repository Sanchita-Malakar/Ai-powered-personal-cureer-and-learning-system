import { createClient } from "@supabase/supabase-js";

// You can replace these with your project credentials directly or keep them mapped to your .env.local variables
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co";
// Normalize the URL so that accidental /rest/v1 suffixes or trailing slashes don't break auth
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes("your-project.supabase.co") &&
  !supabaseAnonKey.includes("your-anon-key")
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Provide signup alias for signUp to support both call conventions
if (supabase?.auth && !supabase.auth.signup) {
  supabase.auth.signup = supabase.auth.signUp.bind(supabase.auth);
}
