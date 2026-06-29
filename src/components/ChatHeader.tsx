"use client";

import { Profile } from "@/types";
import { User, Flag, Settings, Bell, BarChart3 } from "lucide-react";

interface ChatHeaderProps {
  profile: Profile;
  onlineCount: number;
  notificationCount: number;
  onOpenProfile: () => void;
  onOpenReports: () => void;
  onOpenSettings: () => void;
  onOpenNotifications: () => void;
}

export default function ChatHeader({
  profile,
  onlineCount,
  notificationCount,
  onOpenProfile,
  onOpenReports,
  onOpenSettings,
  onOpenNotifications,
}: ChatHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#1a1d23] border-b border-gray-800 px-4 py-3 pt-[calc(0.75rem+env(safe-area-inset-top))] flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-lg">🇧🇷</span>
          <h1 className="text-base font-bold text-white">
            Chat <span className="text-cyan-400">Brasil</span>
          </h1>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-600/20 border border-cyan-600/30">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs text-cyan-400 font-medium">
            {Math.max(15, onlineCount + 15)} online
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500 mr-2 hidden sm:block">
          {profile.nickname}
        </span>
        <button
          onClick={onOpenNotifications}
          className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors relative"
          title="Notificações"
        >
          <Bell size={18} />
          {notificationCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>
        <button
          onClick={onOpenProfile}
          className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          title="Perfil"
        >
          <User size={18} />
        </button>
        {profile.is_admin && (
          <a
            href="/admin"
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
            title="Painel Admin"
          >
            <BarChart3 size={18} />
          </a>
        )}
        <button
          onClick={onOpenReports}
          className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          title="Denúncias"
        >
          <Flag size={18} />
        </button>
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          title="Configurações"
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
}
