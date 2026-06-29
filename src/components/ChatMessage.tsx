"use client";

import { Message, Profile, REACTION_EMOJIS, Reaction } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Flag, SmilePlus, Reply, Trash2, VolumeX, Ban } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ChatMessageProps {
  message: Message;
  currentUserId: string;
  currentNickname: string;
  reactions: Reaction[];
  replyTo?: Message | null;
  onReact: (messageId: string, emoji: string) => void;
  onRemoveReact: (messageId: string, emoji: string) => void;
  onReport: (messageId: string) => void;
  onReply: (message: Message) => void;
  onMentionClick: (nickname: string) => void;
  onScrollToMessage?: (messageId: string) => void;
  isAdmin?: boolean;
  onDeleteMessage?: (messageId: string) => void;
  onMuteUser?: (userId: string) => void;
  onBanUser?: (userId: string) => void;
}

export default function ChatMessage({
  message,
  currentUserId,
  currentNickname,
  reactions,
  replyTo,
  onReact,
  onRemoveReact,
  onReport,
  onReply,
  onMentionClick,
  onScrollToMessage,
  isAdmin,
  onDeleteMessage,
  onMuteUser,
  onBanUser,
}: ChatMessageProps) {
  const [showReactions, setShowReactions] = useState(false);
  const [swipeX, setSwipeX] = useState(0);
  const touchStartX = useRef(0);
  const messageRef = useRef<HTMLDivElement>(null);
  const isOwn = message.user_id === currentUserId;

  // Generate consistent color from user_id
  const nickColor = (() => {
    const NICK_COLORS = [
      "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3",
      "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a",
      "#ff9800", "#ff5722", "#f44336", "#e040fb", "#7c4dff",
      "#448aff", "#18ffff", "#69f0ae", "#ffd740", "#ff6e40",
    ];
    const userId = message.user_id || message.profile?.id || message.profile?.nickname || "anon";
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return NICK_COLORS[Math.abs(hash) % NICK_COLORS.length];
  })();

  // Check if current user is mentioned or replied to
  const isMentioned =
    message.mentions?.includes(currentNickname) ||
    message.content.includes(`@${currentNickname}`) ||
    replyTo?.user_id === currentUserId;

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    if (diffMs < 60000) return "agora";
    if (diffMs < 3600000) {
      return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    }
    return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
  };

  useEffect(() => {
    if (!showReactions) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (messageRef.current && !messageRef.current.contains(event.target as Node)) {
        setShowReactions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showReactions]);

  // Group reactions by emoji
  const groupedReactions = reactions.reduce<Record<string, { count: number; hasOwn: boolean }>>((acc, r) => {
    if (!acc[r.emoji]) acc[r.emoji] = { count: 0, hasOwn: false };
    acc[r.emoji].count++;
    if (r.user_id === currentUserId) acc[r.emoji].hasOwn = true;
    return acc;
  }, {});

  // Render content with @mentions highlighted
  const renderContent = (content: string) => {
    const mentions = message.mentions || [];
    // Sort by length desc so longer names match first
    const sortedMentions = [...mentions].sort((a, b) => b.length - a.length);

    const parts: React.ReactNode[] = [];
    let remaining = content;
    let i = 0;

    while (remaining.length > 0) {
      let matched = false;
      for (const nick of sortedMentions) {
        const idx = remaining.indexOf(`@${nick}`);
        if (idx !== -1) {
          const before = remaining.slice(0, idx);
          const after = remaining.slice(idx + nick.length + 1);
          if (before) parts.push(<span key={i++}>{before}</span>);
          const isSelf = nick === currentNickname;
          parts.push(
            <span
              key={i++}
              className={`font-medium cursor-pointer hover:underline rounded px-0.5 ${
                isSelf
                  ? "bg-yellow-500/20 text-yellow-300"
                  : "bg-blue-500/20 text-blue-300"
              }`}
              onClick={() => onMentionClick(nick)}
            >
              {`@${nick}`}
            </span>
          );
          remaining = after;
          matched = true;
          break;
        }
      }
      if (!matched) {
        parts.push(<span key={i++}>{remaining}</span>);
        break;
      }
    }

    return parts;
  };

  // Swipe to reply (touch)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const diff = e.touches[0].clientX - touchStartX.current;
    // Swipe left to reply
    if (diff < 0 && diff > -80) {
      setSwipeX(diff);
    }
  };

  const handleTouchEnd = () => {
    if (swipeX < -50) {
      onReply(message);
    }
    setSwipeX(0);
  };

  // Tap to show reactions on mobile
  const handleTap = () => {
    setShowReactions((prev) => !prev);
  };

  return (
    <div
      ref={messageRef}
      className={`group relative transition-colors ${
        isMentioned
          ? "bg-yellow-500/[0.06] border-l-[3px] border-yellow-500 pl-[13px]"
          : "hover:bg-[#2e3035]/30 pl-4"
      } pr-4 py-1`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleTap}
      style={{ transform: `translateX(${swipeX}px)` }}
    >
      {/* Swipe reply indicator */}
      {swipeX < -20 && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 animate-pulse">
          <Reply size={18} />
        </div>
      )}

      {/* Reply reference */}
      {replyTo && (
        <div
          className="flex items-center gap-1.5 ml-12 mb-0.5 cursor-pointer hover:bg-[#2e3035]/40 rounded px-1 -mx-1 transition-colors"
          onClick={() => onScrollToMessage?.(replyTo.id)}
        >
          <div className="w-5 h-3 border-l-2 border-t-2 border-gray-600 rounded-tl-md" />
          <span className="text-[11px] text-gray-500 truncate max-w-[300px]">
            <span className="font-medium text-gray-400">
              {replyTo.profile?.nickname || "Anônimo"}
            </span>
            {" "}{replyTo.content.slice(0, 60)}{replyTo.content.length > 60 ? "..." : ""}
          </span>
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center shrink-0 text-sm font-bold text-white mt-0.5">
          {message.profile?.avatar_url ? (
            <img
              src={message.profile.avatar_url}
              alt=""
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            message.profile?.nickname?.charAt(0).toUpperCase() || "?"
          )}
        </div>

        {/* Message content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold" style={{ color: nickColor }}>
              {message.profile?.nickname || "Anônimo"}
            </span>
          </div>
          <p className="text-[15px] text-gray-300 break-words mt-0.5 leading-relaxed">
            {renderContent(message.content)}
          </p>

          {/* Reactions */}
          {Object.keys(groupedReactions).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {Object.entries(groupedReactions).map(([emoji, data]) => (
                <button
                  key={emoji}
                  onClick={(e) => {
                    e.stopPropagation();
                    data.hasOwn ? onRemoveReact(message.id, emoji) : onReact(message.id, emoji);
                    setShowReactions(false);
                  }}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-colors ${
                    data.hasOwn
                      ? "bg-blue-500/20 border border-blue-500/40 text-blue-300"
                      : "bg-[#2b2d31] border border-[#3f4147] text-gray-300 hover:border-gray-500"
                  }`}
                >
                  <span>{emoji}</span>
                  <span className="text-[11px]">{data.count}</span>
                </button>
              ))}
              {/* Add reaction button inline */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowReactions(!showReactions);
                }}
                className="flex items-center px-2 py-0.5 rounded-full text-xs bg-[#2b2d31] border border-[#3f4147] text-gray-500 hover:text-gray-300 hover:border-gray-500 transition-colors"
              >
                <SmilePlus size={12} />
              </button>
            </div>
          )}
        </div>

        {/* Discord-style floating action bar (shown on hover) */}
        <div className="absolute -top-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <div className="flex items-center bg-[#2b2d31] border border-[#3f4147] rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowReactions(!showReactions);
              }}
              className="p-1.5 hover:bg-[#3f4147] text-gray-400 hover:text-gray-200 transition-colors"
              title="Reagir"
            >
              <SmilePlus size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReply(message);
              }}
              className="p-1.5 hover:bg-[#3f4147] text-gray-400 hover:text-gray-200 transition-colors"
              title="Responder"
            >
              <Reply size={16} />
            </button>
            {!isOwn && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReport(message.id);
                }}
                className="p-1.5 hover:bg-[#3f4147] text-gray-400 hover:text-red-400 transition-colors"
                title="Denunciar"
              >
                <Flag size={16} />
              </button>
            )}
            {isAdmin && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteMessage?.(message.id);
                  }}
                  className="p-1.5 hover:bg-[#3f4147] text-gray-400 hover:text-red-400 transition-colors"
                  title="Apagar mensagem"
                >
                  <Trash2 size={16} />
                </button>
                {!isOwn && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMuteUser?.(message.user_id);
                      }}
                      className="p-1.5 hover:bg-[#3f4147] text-gray-400 hover:text-orange-400 transition-colors"
                      title="Silenciar usuário (1h)"
                    >
                      <VolumeX size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onBanUser?.(message.user_id);
                      }}
                      className="p-1.5 hover:bg-[#3f4147] text-gray-400 hover:text-red-500 transition-colors"
                      title="Banir usuário"
                    >
                      <Ban size={16} />
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Reaction picker (Discord style) */}
      {showReactions && (
        <div className="flex gap-0.5 mt-2 ml-12 p-1 bg-[#2b2d31] rounded-lg border border-[#3f4147] w-fit shadow-lg">
          {REACTION_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={(e) => {
                e.stopPropagation();
                onReact(message.id, emoji);
                setShowReactions(false);
              }}
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#3f4147] text-lg transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
