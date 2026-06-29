import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { assertSupabaseConfig } from "@/lib/supabase-constants";

export function createClient() {
  const { url, anonKey } = assertSupabaseConfig();

  return createSupabaseClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    global: {
      headers: {
        apikey: anonKey,
      },
    },
  });
}
