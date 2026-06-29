"use client";

import { useState, useRef, useEffect } from "react";
import { Send, X } from "lucide-react";
import { Message, Profile } from "@/types";

interface ChatInputProps {
  onSend: (content: string, mentions: string[], replyToId?: string) => void;
  onlineUsers: Profile[];
  disabled?: boolean;
  mutedUntil?: string | null;
  replyingTo: Message | null;
  onCancelReply: () => void;
}

export default function ChatInput({
  onSend,
  onlineUsers,
  disabled,
  mutedUntil,
  replyingTo,
  onCancelReply,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const [muteCountdown, setMuteCountdown] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [mentionFilter, setMentionFilter] = useState("");
  const [selectedMentionIdx, setSelectedMentionIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredUsers = onlineUsers.filter((u) =>
    u.nickname.toLowerCase().includes(mentionFilter.toLowerCase())
  ).slice(0, 8);

  useEffect(() => {
    if (!disabled || !mutedUntil) {
      setMuteCountdown("");
      return;
    }

    const updateCountdown = () => {
      const diff = new Date(mutedUntil).getTime() - Date.now();
      if (diff <= 0) {
        setMuteCountdown("00:00");
        return;
      }
      const totalSeconds = Math.ceil(diff / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      setMuteCountdown(`${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [disabled, mutedUntil]);

  useEffect(() => {
    const lastAt = input.lastIndexOf("@");
    if (lastAt !== -1) {
      const afterAt = input.slice(lastAt + 1);
      if (!afterAt.includes(" ")) {
        setShowMentions(true);
        setMentionFilter(afterAt);
        setSelectedMentionIdx(0);
        return;
      }
    }
    setShowMentions(false);
    setMentionFilter("");
  }, [input]);

  // Focus input when replying
  useEffect(() => {
    if (replyingTo) {
      inputRef.current?.focus();
    }
  }, [replyingTo]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;

    // Extract mentions (supports nicknames with spaces)
    const mentions: string[] = [];
    for (const user of onlineUsers) {
      const escaped = user.nickname.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`@${escaped}(?=$|[^\\w])`, "g");
      if (regex.test(trimmed)) {
        mentions.push(user.nickname);
      }
    }

    onSend(trimmed, mentions, replyingTo?.id);
    setInput("");
    onCancelReply();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showMentions && filteredUsers.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedMentionIdx((prev) => (prev + 1) % filteredUsers.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedMentionIdx((prev) => (prev - 1 + filteredUsers.length) % filteredUsers.length);
        return;
      }
      if (e.key === "Tab" || e.key === "Enter") {
        e.preventDefault();
        handleSelectMention(filteredUsers[selectedMentionIdx].nickname);
        return;
      }
      if (e.key === "Escape") {
        setShowMentions(false);
        return;
      }
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }

    if (e.key === "Escape" && replyingTo) {
      onCancelReply();
    }
  };

  const handleSelectMention = (nickname: string) => {
    const lastAt = input.lastIndexOf("@");
    const newInput = input.slice(0, lastAt) + `@${nickname} `;
    setInput(newInput);
    setShowMentions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="px-4 pb-4 pt-0 bg-[#13151a] shrink-0">
      {/* Reply preview */}
      {replyingTo && (
        <div className="flex items-center gap-2 px-3 py-1.5 mb-1 bg-[#2b2d31] rounded-t-xl border-l-[3px] border-blue-500">
          <span className="text-xs text-gray-400 flex-1 truncate">
            Respondendo a{" "}
            <span className="font-semibold text-gray-300">
              {replyingTo.profile?.nickname || "Anônimo"}
            </span>
            <span className="text-gray-500 ml-1.5">
              {replyingTo.content.slice(0, 50)}{replyingTo.content.length > 50 ? "..." : ""}
            </span>
          </span>
          <button
            onClick={onCancelReply}
            className="p-0.5 rounded hover:bg-gray-700 text-gray-500 hover:text-gray-300"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div className="relative">
        {/* Mention suggestions (Discord style) */}
        {showMentions && filteredUsers.length > 0 && (
          <div className="absolute bottom-full left-0 right-0 mb-1 bg-[#2b2d31] border border-[#3f4147] rounded-lg shadow-xl overflow-hidden">
            <div className="px-3 py-1.5 border-b border-[#3f4147]">
              <span className="text-[11px] font-semibold text-gray-400 uppercase">Membros</span>
            </div>
            {filteredUsers.map((user, idx) => (
              <button
                key={user.id}
                onClick={() => handleSelectMention(user.nickname)}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-left transition-colors ${
                  idx === selectedMentionIdx ? "bg-[#3f4147]" : "hover:bg-[#35373c]"
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold text-white">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    user.nickname.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="text-sm text-gray-200 font-medium">{user.nickname}</span>
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              disabled
                ? `Você está silenciado${muteCountdown ? ` (${muteCountdown})` : ""}...`
                : replyingTo
                ? `Responder a ${replyingTo.profile?.nickname || "Anônimo"}...`
                : "Enviar mensagem..."
            }
            disabled={disabled}
            maxLength={2000}
            className={`flex-1 px-4 py-2.5 bg-[#383a40] text-white placeholder-gray-500 focus:outline-none transition-colors disabled:opacity-50 text-[15px] ${
              replyingTo ? "rounded-b-xl rounded-t-none" : "rounded-xl"
            }`}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || disabled}
            className="p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-700 disabled:text-gray-500 text-white transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
