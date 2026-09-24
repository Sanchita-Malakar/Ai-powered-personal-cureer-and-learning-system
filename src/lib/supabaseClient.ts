import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith("http") &&
    !supabaseUrl.includes("placeholder")
);

// Fallback dummy client in case environment variables are missing during static analysis
let clientInstance: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch (err) {
    console.warn("Failed to initialize Supabase client:", err);
  }
}

// Fallback proxy to prevent runtime crashes if Supabase is unconfigured or blocked
export const supabase: SupabaseClient =
  clientInstance ||
  (new Proxy(
    {},
    {
      get(_target, prop) {
        if (prop === "auth") {
          return {
            getSession: async () => ({ data: { session: null }, error: null }),
            getUser: async () => ({ data: { user: null }, error: null }),
            signInWithPassword: async () => ({
              data: { user: null, session: null },
              error: new Error("Supabase is not configured yet. You can sign in using Quick Demo Access!"),
            }),
            signUp: async () => ({
              data: { user: null, session: null },
              error: new Error("Supabase is not configured yet. You can register using Quick Demo Access!"),
            }),
            signInWithOAuth: async () => ({
              data: null,
              error: new Error("OAuth requires configured Supabase credentials."),
            }),
            signOut: async () => ({ error: null }),
            onAuthStateChange: () => ({
              data: { subscription: { unsubscribe: () => {} } },
            }),
            resetPasswordForEmail: async () => ({
              data: {},
              error: null,
            }),
          };
        }
        return () => ({
          select: () => ({ data: [], error: null }),
          insert: () => ({ data: [], error: null }),
          update: () => ({ data: [], error: null }),
          delete: () => ({ data: [], error: null }),
        });
      },
    }
  ) as unknown as SupabaseClient);
