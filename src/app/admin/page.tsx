import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Calendar, TrendingUp } from "lucide-react";

function timeSince(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "agora";
  if (diffMin < 60) return `${diffMin}min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD}d`;
}

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    redirect("/");
  }

  // Helper for Japan timezone
  const getJstStartOfDay = () => {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date());
    const y = parts.find((p) => p.type === "year")?.value;
    const m = parts.find((p) => p.type === "month")?.value;
    const d = parts.find((p) => p.type === "day")?.value;
    return new Date(`${y}-${m}-${d}T00:00:00+09:00`).toISOString();
  };

  const seedIdPrefix = "10000000-0000-0000-0000-0000000000";
  const todayStart = getJstStartOfDay();
  const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  // Reset: only count users registered from today JST onwards
  const resetDate = todayStart;

  const baseQuery = () =>
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .not("id", "like", `${seedIdPrefix}%`)
      .gte("created_at", resetDate);

  const { count: totalCount } = await baseQuery();

  const { count: todayCount } = await baseQuery().gte("created_at", todayStart);

  const { count: weekCount } = await baseQuery().gte("created_at", weekStart);

  const { data: recentProfiles } = await supabase
    .from("profiles")
    .select("id, nickname, created_at, message_count, is_banned, is_muted")
    .not("id", "like", `${seedIdPrefix}%`)
    .gte("created_at", resetDate)
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="min-h-screen bg-[#13151a] text-gray-100">
      <header className="sticky top-0 z-40 bg-[#1a1d23] border-b border-gray-800 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            Voltar ao chat
          </Link>
          <h1 className="text-lg font-bold text-white">Painel Admin</h1>
          <span className="text-xs text-gray-500">{user.email}</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1e2127] border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-cyan-600/20 text-cyan-400">
                <Calendar size={20} />
              </div>
              <span className="text-sm text-gray-400">Cadastros hoje</span>
            </div>
            <p className="text-3xl font-bold text-white">{todayCount ?? 0}</p>
          </div>

          <div className="bg-[#1e2127] border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-600/20 text-purple-400">
                <TrendingUp size={20} />
              </div>
              <span className="text-sm text-gray-400">Esta semana</span>
            </div>
            <p className="text-3xl font-bold text-white">{weekCount ?? 0}</p>
          </div>

          <div className="bg-[#1e2127] border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-600/20 text-green-400">
                <Users size={20} />
              </div>
              <span className="text-sm text-gray-400">Total de cadastros</span>
            </div>
            <p className="text-3xl font-bold text-white">{totalCount ?? 0}</p>
          </div>
        </div>

        <div className="bg-[#1e2127] border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800">
            <h2 className="font-semibold text-white">Últimos cadastros</h2>
          </div>
          <div className="divide-y divide-gray-800">
            {(recentProfiles || []).length === 0 && (
              <div className="px-5 py-6 text-sm text-gray-500">
                Nenhum cadastro encontrado.
              </div>
            )}
            {(recentProfiles || []).map((p) => (
              <div key={p.id} className="px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-white">
                    {p.nickname?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-200">{p.nickname || "Anônimo"}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(p.created_at).toLocaleString("pt-BR", { timeZone: "Asia/Tokyo" })}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {p.message_count ?? 0} mensagens · {timeSince(p.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {p.is_banned && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-red-500/20 text-red-400">
                      Banido
                    </span>
                  )}
                  {p.is_muted && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-yellow-500/20 text-yellow-400">
                      Mutado
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
