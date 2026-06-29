"use client";

import { REPORT_REASONS, ReportReason } from "@/types";
import { X } from "lucide-react";
import { useState } from "react";

interface ReportModalProps {
  messageId: string | null;
  reportedUserId: string | null;
  onSubmit: (reason: ReportReason, description: string) => void;
  onClose: () => void;
}

export default function ReportModal({
  messageId,
  reportedUserId,
  onSubmit,
  onClose,
}: ReportModalProps) {
  const [reason, setReason] = useState<ReportReason | "">("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;
    setLoading(true);
    onSubmit(reason, description);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1e2128] rounded-2xl w-full max-w-sm mx-4 border border-gray-700 shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Denunciar</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-700 text-gray-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Motivo
            </label>
            <div className="grid grid-cols-2 gap-2">
              {REPORT_REASONS.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setReason(r.value)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    reason === r.value
                      ? "bg-red-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Detalhes (opcional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o que aconteceu..."
              rows={3}
              maxLength={500}
              className="w-full px-4 py-2.5 rounded-xl bg-[#13151a] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors resize-none text-sm"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!reason || loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium transition-colors"
            >
              {loading ? "Enviando..." : "Denunciar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
