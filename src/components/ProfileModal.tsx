"use client";

import { Profile } from "@/types";
import { X, MessageCircle, Heart, Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ProfileModalProps {
  profile: Profile;
  isOwn: boolean;
  onClose: () => void;
}

export default function ProfileModal({ profile, isOwn, onClose }: ProfileModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1e2128] rounded-2xl w-full max-w-sm mx-4 border border-gray-700 shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">
            {isOwn ? "Meu Perfil" : "Perfil"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-700 text-gray-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          {/* Avatar */}
          <div className="flex flex-col items-center mb-5">
            <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center text-3xl font-bold text-white mb-3">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt=""
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                profile.nickname.charAt(0).toUpperCase()
              )}
            </div>
            <h3 className="text-xl font-bold text-white">{profile.nickname}</h3>
            <p className="text-xs text-gray-500">
              Membro {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true, locale: ptBR })}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#13151a] rounded-xl p-3 text-center">
              <MessageCircle size={18} className="mx-auto text-blue-400 mb-1" />
              <p className="text-lg font-bold text-white">{profile.message_count}</p>
              <p className="text-[10px] text-gray-500">Mensagens</p>
            </div>
            <div className="bg-[#13151a] rounded-xl p-3 text-center">
              <Heart size={18} className="mx-auto text-red-400 mb-1" />
              <p className="text-lg font-bold text-white">{profile.reaction_count}</p>
              <p className="text-[10px] text-gray-500">Reações</p>
            </div>
            <div className="bg-[#13151a] rounded-xl p-3 text-center">
              <Star size={18} className="mx-auto text-yellow-400 mb-1" />
              <p className="text-lg font-bold text-white">{profile.reputation}</p>
              <p className="text-[10px] text-gray-500">Reputação</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
