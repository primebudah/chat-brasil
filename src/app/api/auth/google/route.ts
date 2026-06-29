import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { assertSupabaseConfig } from "@/lib/supabase-constants";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  const { url, anonKey } = assertSupabaseConfig();
  const supabase = createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        apikey: anonKey,
      },
    },
  });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error || !data.url) {
    return NextResponse.json(
      { message: error?.message || "Unable to create Google login URL" },
      { status: 500 }
    );
  }

  return NextResponse.redirect(data.url);
}
