import { createClient } from "@supabase/supabase-js";

import { hasSupabaseConfig } from "@/lib/invitation-story";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = hasSupabaseConfig(supabaseUrl, supabaseAnonKey)
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;
