import { NextResponse } from "next/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase-constants";

export const dynamic = "force-dynamic";

export function GET() {
  const anonKey = SUPABASE_ANON_KEY || "";

  return NextResponse.json({
    supabaseUrlPresent: Boolean(SUPABASE_URL),
    supabaseUrl: SUPABASE_URL || null,
    anonKeyPresent: Boolean(anonKey),
    anonKeyLength: anonKey.length,
    anonKeyPrefix: anonKey ? anonKey.slice(0, 12) : null,
    anonKeySuffix: anonKey ? anonKey.slice(-12) : null,
  });
}
