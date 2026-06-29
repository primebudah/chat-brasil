import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";
import { assertSupabaseConfig } from "@/lib/supabase-constants";

let client: SupabaseClient | null = null;

export function createClient() {
  if (client) return client;

  const { url, anonKey } = assertSupabaseConfig();

  client = createSupabaseClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "implicit",
    },
    global: {
      headers: {
        apikey: anonKey,
      },
    },
  });

  return client;
}
