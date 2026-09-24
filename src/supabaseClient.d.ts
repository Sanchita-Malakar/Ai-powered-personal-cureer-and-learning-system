import { SupabaseClient } from "@supabase/supabase-js";

export interface SupabaseClientWithSignup extends SupabaseClient {
  auth: SupabaseClient["auth"] & {
    signup: SupabaseClient["auth"]["signUp"];
  };
}

export declare const supabase: SupabaseClientWithSignup;
export declare const isSupabaseConfigured: boolean;
