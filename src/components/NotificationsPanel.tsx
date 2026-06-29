"use client";

import { X, AtSign, Reply } from "lucide-react";

export interface Notification {
  id: string;
  type: "mention" | "reply";
  fromNickname: string;
  messageId: string;
  preview: string;
  timestamp: string;
  read: boolean;
}

interface NotificationsPanelProps {
  notifications: Notification[];
  onClose: () => void;
  onClickNotification: (messageId: string) => void;
  onClearAll: () => void;
}

export default function NotificationsPanel({
  notifications,
  onClose,
  onClickNotification,
  onClearAll,
}: NotificationsPanelProps) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-16 px-4">
      <div className="w-full max-w-sm bg-[#1a1d23] rounded-2xl border border-gray-700 shadow-2xl max-h-[70vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <h3 className="text-sm font-semibold text-white">Notificações</h3>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-[11px] text-gray-500 hover:text-gray-300 transition-colors"
              >
                Limpar tudo
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-gray-500">Nenhuma notificação</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {notifications.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => onClickNotification(notif.messageId)}
                  className={`w-full text-left px-4 py-3 hover:bg-[#2b2d31] transition-colors ${
                    !notif.read ? "bg-cyan-500/5" : ""
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`mt-0.5 p-1 rounded ${
                      notif.type === "mention" ? "bg-yellow-500/20 text-yellow-400" : "bg-cyan-500/20 text-cyan-400"
                    }`}>
                      {notif.type === "mention" ? <AtSign size={14} /> : <Reply size={14} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-300">
                        <span className="font-semibold text-white">{notif.fromNickname}</span>
                        {notif.type === "mention" ? " marcou você" : " respondeu você"}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate mt-0.5">
                        {notif.preview}
                      </p>
                      <p className="text-[10px] text-gray-600 mt-0.5">
                        {formatTime(notif.timestamp)}
                      </p>
                    </div>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "agora";
  if (diffMin < 60) return `${diffMin}min atrás`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h atrás`;
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}
