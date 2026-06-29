"use client";

import { Profile } from "@/types";
import { X, LogOut, Trash2, Sun, Moon } from "lucide-react";
import { useState } from "react";

interface SettingsModalProps {
  profile: Profile;
  onClose: () => void;
  onUpdateNick: (newNick: string) => Promise<boolean>;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

export default function SettingsModal({
  profile,
  onClose,
  onUpdateNick,
  onLogout,
  onDeleteAccount,
}: SettingsModalProps) {
  const [nickname, setNickname] = useState(profile.nickname);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const handleSaveNick = async () => {
    setError("");
    const trimmed = nickname.trim();
    if (trimmed.length < 3) {
      setError("Mínimo 3 caracteres");
      return;
    }
    if (trimmed.length > 20) {
      setError("Máximo 20 caracteres");
      return;
    }
    if (trimmed === profile.nickname) return;

    setSaving(true);
    const success = await onUpdateNick(trimmed);
    if (!success) {
      setError("Apelido já em uso ou erro ao salvar");
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1e2128] rounded-2xl w-full max-w-sm mx-4 border border-gray-700 shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Configurações</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-700 text-gray-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Edit nickname */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Apelido
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setError("");
                }}
                maxLength={20}
                className="flex-1 px-3 py-2 rounded-lg bg-[#13151a] border border-gray-700 text-white text-sm focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleSaveNick}
                disabled={saving || nickname.trim() === profile.nickname}
                className="px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm font-medium transition-colors"
              >
                {saving ? "..." : "Salvar"}
              </button>
            </div>
            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
          </div>

          {/* Theme toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Tema
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme("dark")}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  theme === "dark"
                    ? "bg-gray-700 text-white"
                    : "bg-[#13151a] text-gray-500 hover:text-gray-300"
                }`}
              >
                <Moon size={14} />
                Escuro
              </button>
              <button
                onClick={() => setTheme("light")}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  theme === "light"
                    ? "bg-gray-700 text-white"
                    : "bg-[#13151a] text-gray-500 hover:text-gray-300"
                }`}
              >
                <Sun size={14} />
                Claro
              </button>
            </div>
            <p className="text-[10px] text-gray-600 mt-1">
              Tema claro disponível em breve
            </p>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium transition-colors"
          >
            <LogOut size={16} />
            Sair da conta
          </button>

          {/* Delete account */}
          {!showDelete ? (
            <button
              onClick={() => setShowDelete(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 font-medium transition-colors text-sm"
            >
              <Trash2 size={14} />
              Excluir conta
            </button>
          ) : (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
              <p className="text-xs text-red-300 mb-2">
                Tem certeza? Esta ação é irreversível.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDelete(false)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 text-xs"
                >
                  Cancelar
                </button>
                <button
                  onClick={onDeleteAccount}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium"
                >
                  Excluir
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
