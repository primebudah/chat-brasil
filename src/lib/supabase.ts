import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hezriywwopilrjcpckio.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhlenJpeXd3b3BpbHJqY3Bja2lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2ODk2NDMsImV4cCI6MjA5ODI2NTY0M30.uyJ6MmaTmF-7hL62q72t0IT3x4qBuFiaNbfcpBJFYr4";

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
