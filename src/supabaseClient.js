import { createClient } from "@supabase/supabase-js";

// Replace these variables with your Supabase project credentials:
const SUPABASE_URL = "https://yhxetuhosauhlyxjeytc.supabase.co";
const SUPABASE_PUBLIC_KEY = "sb_publishable_iA1DfFRpF6ztU2ABmJlWvg_1dhX_iXq";

// Initialize the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);

export default supabase;
