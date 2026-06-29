"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Message, Profile, Reaction, ReportReason } from "@/types";
import { createClient } from "@/lib/supabase";
import { User, RealtimeChannel } from "@supabase/supabase-js";
import LoginScreen from "@/components/LoginScreen";
import SetupNickname from "@/components/SetupNickname";
import BetaScreen from "@/components/BetaScreen";
import ChatHeader from "@/components/ChatHeader";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import ProfileModal from "@/components/ProfileModal";
import ReportModal from "@/components/ReportModal";
import SettingsModal from "@/components/SettingsModal";
import NotificationsPanel, { Notification } from "@/components/NotificationsPanel";

export const dynamic = "force-dynamic";

type AppState = "loading" | "login" | "setup" | "beta" | "chat";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("loading");
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Profile[]>([]);
  const [allUsers, setAllUsers] = useState<Profile[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);

  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [replyMap, setReplyMap] = useState<Record<string, string>>({});

  // Modals
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ messageId: string | null; userId: string | null } | null>(null);

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);
  // Banned user IDs (client-side filter)
  const [bannedIds, setBannedIds] = useState<Set<string>>(new Set());

  // Scroll state
  const [showScrollDown, setShowScrollDown] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const [supabase] = useState(() => createClient());

  // Scroll to bottom on new messages (only if near bottom)
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
    if (isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Detect scroll position for scroll-down button
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
      setShowScrollDown(!isNearBottom);
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [appState]);

  // Handle authenticated user flow
  const handleAuthUser = useCallback(async (userId: string, user: User) => {
    setAuthUser(user);

    // Check banned email
    if (user.email) {
      const banResult = await Promise.race([
        supabase
          .from("banned_emails")
          .select("email")
          .eq("email", user.email)
          .single(),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)),
      ]);
      const banned = banResult && "data" in banResult ? banResult.data : null;
      if (banned) {
        await supabase.auth.signOut();
        alert("Esta conta foi banida.");
        setAppState("login");
        return;
      }
    }

    const profileResult = await Promise.race([
      supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single(),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)),
    ]);
    const profileData = profileResult && "data" in profileResult ? profileResult.data : null;

    if (!profileData) {
      setAppState("setup");
    } else {
      // If mute expired, clear it
      if (profileData.is_muted && profileData.muted_until) {
        const until = new Date(profileData.muted_until).getTime();
        if (until <= Date.now()) {
          await supabase
            .from("profiles")
            .update({ is_muted: false, muted_until: null })
            .eq("id", userId);
          profileData.is_muted = false;
          profileData.muted_until = null;
          await supabase.from("mutes").delete().eq("user_id", userId);
        }
      }
      setProfile(profileData as Profile);
      const seenBeta = localStorage.getItem("chat-brasil-beta-seen");
      setAppState(seenBeta ? "chat" : "beta");
    }
  }, [supabase]);

  // Auto-clear expired mute while app is open
  useEffect(() => {
    if (!profile || !profile.is_muted || !profile.muted_until) return;
    const check = () => {
      const until = new Date(profile.muted_until!).getTime();
      if (until <= Date.now()) {
        setProfile((prev) => prev ? { ...prev, is_muted: false, muted_until: null } : prev);
        supabase.from("profiles").update({ is_muted: false, muted_until: null }).eq("id", profile.id);
        supabase.from("mutes").delete().eq("user_id", profile.id);
      }
    };
    check();
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, [profile?.is_muted, profile?.muted_until, profile?.id]);

  // Init: check auth state
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const sessionResult = await Promise.race([
          supabase.auth.getSession(),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)),
        ]);

        if (!mounted) return;

        const session = sessionResult && "data" in sessionResult ? sessionResult.data.session : null;
        if (session?.user) {
          await handleAuthUser(session.user.id, session.user);
        } else {
          setAppState("login");
        }
      } catch {
        if (mounted) setAppState("login");
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        if (event === "SIGNED_OUT") {
          setAuthUser(null);
          setProfile(null);
          setAppState("login");
        } else if ((event === "SIGNED_IN" || event === "TOKEN_REFRESHED") && session?.user) {
          await handleAuthUser(session.user.id, session.user);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [handleAuthUser, supabase]);

  // Check if we're in dev mode (no real auth)
  const isDevMode = profile?.id === "dev-user-001";

  // Load messages and subscribe to realtime when in chat
  useEffect(() => {
    if (appState !== "chat" || !profile) return;
    if (isDevMode) return;

    const loadMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*, profile:profiles(*)")
        .eq("is_deleted", false)
        .order("created_at", { ascending: true })
        .limit(200);

      if (data) {
        // Filter out banned users
        const filtered = (data as Message[]).filter(
          (m) => !bannedIds.has(m.user_id) && !m.profile?.is_banned
        );
        setMessages(filtered);
      }

      // Load reactions
      const { data: reactionsData } = await supabase
        .from("reactions")
        .select("*");

      if (reactionsData) {
        setReactions(reactionsData as Reaction[]);
      }
    };

    loadMessages();
    loadAllUsers();
    loadNotifications();

    // Subscribe to new notifications
    const notifChannel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${profile.id}` },
        async (payload) => {
          const { data } = await supabase
            .from("notifications")
            .select("*, from_profile:profiles!from_user_id(nickname), message:messages!message_id(content)")
            .eq("id", payload.new.id)
            .single();
          if (data) {
            const n = data as any;
            const notif: Notification = {
              id: n.id,
              type: n.type,
              fromNickname: n.from_profile?.nickname || "Anônimo",
              messageId: n.message_id,
              preview: n.message?.content?.slice(0, 80) || "",
              timestamp: n.created_at,
              read: n.is_read,
            };
            setNotifications((old) => {
              if (old.some((o) => o.id === notif.id)) return old;
              const next = [notif, ...old];
              return next.slice(0, 30);
            });
          }
        }
      )
      .subscribe();

    // Subscribe to new messages
    const channel = supabase
      .channel("global-chat")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          const { data: newMsg } = await supabase
            .from("messages")
            .select("*, profile:profiles(*)")
            .eq("id", payload.new.id)
            .single();

          if (newMsg) {
            const msg = newMsg as Message;
            setMessages((prev) => {
              // Avoid duplicates (optimistic update may have already added it)
              if (prev.some((m) => m.id === msg.id)) return prev;

              // Generate notification if this mentions or replies to current user
              if (msg.user_id !== profile?.id && profile) {
                const isMentioned = msg.mentions?.includes(profile.nickname) || msg.content.includes(`@${profile.nickname}`);
                const isReply = msg.reply_to_id && prev.some((m) => m.id === msg.reply_to_id && m.user_id === profile.id);

                if (isMentioned || isReply) {
                  const notif: Notification = {
                    id: `notif-${msg.id}`,
                    type: isMentioned ? "mention" : "reply",
                    fromNickname: msg.profile?.nickname || "Anônimo",
                    messageId: msg.id,
                    preview: msg.content.slice(0, 80),
                    timestamp: msg.created_at,
                    read: false,
                  };
                  setNotifications((old) => (old.some((n) => n.id === notif.id) ? old : [notif, ...old]));
                }
              }

              return [...prev, msg];
            });
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "reactions" },
        (payload) => {
          setReactions((prev) => [...prev, payload.new as Reaction]);
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "reactions" },
        (payload) => {
          setReactions((prev) => prev.filter((r) => r.id !== payload.old.id));
        }
      )
      .subscribe();

    channelRef.current = channel;

    // Update presence
    updatePresence(true);
    const presenceInterval = setInterval(() => updatePresence(true), 60000);

    // Load online users
    loadOnlineUsers();
    const onlineInterval = setInterval(loadOnlineUsers, 30000);

    // Polling fallback for messages (in case Realtime doesn't deliver)
    const pollMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*, profile:profiles(*)")
        .eq("is_deleted", false)
        .order("created_at", { ascending: true })
        .limit(200);
      if (data) {
        const filtered = (data as Message[]).filter(
          (m) => !bannedIds.has(m.user_id) && !m.profile?.is_banned
        );
        setMessages((prev) => {
          const newMessages = filtered.filter((msg) => !prev.some((old) => old.id === msg.id));

          newMessages.forEach((msg) => {
            if (msg.user_id === profile.id) return;

            const isMentioned = msg.mentions?.includes(profile.nickname) || msg.content.includes(`@${profile.nickname}`);
            const isReply = msg.reply_to_id && prev.some((m) => m.id === msg.reply_to_id && m.user_id === profile.id);

            if (isMentioned || isReply) {
              const notif: Notification = {
                id: `notif-${msg.id}`,
                type: isMentioned ? "mention" : "reply",
                fromNickname: msg.profile?.nickname || "Anônimo",
                messageId: msg.id,
                preview: msg.content.slice(0, 80),
                timestamp: msg.created_at,
                read: false,
              };
              setNotifications((old) => (old.some((n) => n.id === notif.id) ? old : [notif, ...old]));
            }
          });

          if (filtered.length !== prev.length) return filtered;
          return prev;
        });
      }
    };
    const pollInterval = setInterval(pollMessages, 5000);

    return () => {
      channel.unsubscribe();
      notifChannel.unsubscribe();
      clearInterval(presenceInterval);
      clearInterval(onlineInterval);
      clearInterval(pollInterval);
      updatePresence(false);
    };
  }, [appState, profile]);

  const updatePresence = async (isOnline: boolean) => {
    if (!profile) return;
    await supabase
      .from("presence")
      .upsert({ user_id: profile.id, is_online: isOnline, last_seen: new Date().toISOString() });
  };

  const loadOnlineUsers = async () => {
    if (isDevMode) return;
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data, count } = await supabase
      .from("presence")
      .select("user_id, profiles(*)", { count: "exact" })
      .eq("is_online", true)
      .gte("last_seen", fiveMinAgo);

    if (data) {
      const profiles = data
        .map((d: any) => d.profiles)
        .filter(Boolean) as Profile[];
      setOnlineUsers(profiles);
    }
    if (count !== null) {
      setOnlineCount(count);
    }
  };

  const loadAllUsers = async () => {
    if (isDevMode) return;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("is_banned", false)
      .order("nickname");

    if (data) {
      setAllUsers(data as Profile[]);
    }
  };

  const loadNotifications = async () => {
    if (!profile) return;
    const { data } = await supabase
      .from("notifications")
      .select("*, from_profile:profiles!from_user_id(nickname), message:messages!message_id(content)")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(30);

    if (data) {
      const mapped = (data as any[]).map((n) => ({
        id: n.id,
        type: n.type,
        fromNickname: n.from_profile?.nickname || "Anônimo",
        messageId: n.message_id,
        preview: n.message?.content?.slice(0, 80) || "",
        timestamp: n.created_at,
        read: n.is_read,
      }));
      setNotifications(mapped);
    }
  };

  const markAllNotificationsRead = async () => {
    if (!profile) return;
    await supabase.from("notifications").update({ is_read: true }).eq("user_id", profile.id).eq("is_read", false);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Actions
  const handleSendMessage = useCallback(
    async (content: string, mentions: string[], replyToId?: string) => {
      if (!profile) return;

      // Check if user is muted
      const { data: muteData, error: muteErr } = await supabase
        .from("mutes")
        .select("muted_until")
        .eq("user_id", profile.id)
        .order("muted_until", { ascending: false })
        .limit(1);

      if (muteErr) {
        console.error("Erro ao checar mute:", muteErr.message);
      }

      if (muteData && muteData.length > 0) {
        const muteEnd = new Date(muteData[0].muted_until);
        if (muteEnd > new Date()) {
          const remaining = Math.ceil((muteEnd.getTime() - Date.now()) / 60000);
          alert(`Você está silenciado. Tempo restante: ${remaining} min`);
          return;
        }
      }

      if (isDevMode) {
        // Local-only message for dev/test mode
        const localMsg: Message = {
          id: crypto.randomUUID(),
          user_id: profile.id,
          content,
          mentions,
          created_at: new Date().toISOString(),
          profile: profile,
          reply_to_id: replyToId || null,
        };
        setMessages((prev) => [...prev, localMsg]);
        return;
      }

      // Try insert with reply_to_id first, fallback without if column doesn't exist
      let result = await supabase
        .from("messages")
        .insert({
          user_id: profile.id,
          content,
          mentions,
          ...(replyToId ? { reply_to_id: replyToId } : {}),
        })
        .select("*, profile:profiles(*)")
        .single();

      // If a reply fails, do not retry without reply_to_id because other devices need it for notifications
      if (result.error) {
        console.error("Erro ao enviar mensagem:", result.error.message, result.error.code, result.error.details);
        return;
      }

      const newMsg = result.data;

      // Optimistic: add message immediately
      if (newMsg) {
        const msg = newMsg as Message;
        // If reply_to_id wasn't saved in DB, track it client-side
        if (replyToId && !msg.reply_to_id) {
          setReplyMap((prev) => ({ ...prev, [msg.id]: replyToId }));
          msg.reply_to_id = replyToId;
        }
        setMessages((prev) => [...prev, msg]);
      }
    },
    [profile, isDevMode]
  );

  const handleReact = useCallback(
    async (messageId: string, emoji: string) => {
      if (!profile) return;

      if (isDevMode) {
        const localReaction: Reaction = {
          id: crypto.randomUUID(),
          message_id: messageId,
          user_id: profile.id,
          emoji,
          created_at: new Date().toISOString(),
        };
        setReactions((prev) => [...prev, localReaction]);
        return;
      }

      await supabase.from("reactions").insert({
        message_id: messageId,
        user_id: profile.id,
        emoji,
      });
    },
    [profile, isDevMode]
  );

  const handleRemoveReact = useCallback(
    async (messageId: string, emoji: string) => {
      if (!profile) return;

      if (isDevMode) {
        setReactions((prev) =>
          prev.filter(
            (r) => !(r.message_id === messageId && r.user_id === profile.id && r.emoji === emoji)
          )
        );
        return;
      }

      await supabase
        .from("reactions")
        .delete()
        .eq("message_id", messageId)
        .eq("user_id", profile.id)
        .eq("emoji", emoji);
    },
    [profile, isDevMode]
  );

  const handleReport = useCallback(
    async (reason: ReportReason, description: string) => {
      if (!profile || !reportTarget) return;
      await supabase.from("reports").insert({
        reporter_id: profile.id,
        reported_user_id: reportTarget.userId,
        message_id: reportTarget.messageId,
        reason,
        description: description || null,
      });
      setReportTarget(null);
    },
    [profile, reportTarget]
  );

  const handleUpdateNick = useCallback(
    async (newNick: string): Promise<boolean> => {
      if (!profile) return false;
      const { error } = await supabase
        .from("profiles")
        .update({ nickname: newNick })
        .eq("id", profile.id);

      if (error) return false;
      setProfile({ ...profile, nickname: newNick });
      return true;
    },
    [profile]
  );

  const handleLogout = useCallback(async () => {
    await updatePresence(false);
    await supabase.auth.signOut();
    setAppState("login");
  }, [profile]);

  const handleDeleteAccount = useCallback(async () => {
    if (!profile) return;
    await updatePresence(false);
    await supabase.from("profiles").delete().eq("id", profile.id);
    await supabase.auth.signOut();
    setAppState("login");
  }, [profile]);

  // Moderation actions (admin only)
  const handleDeleteMessage = useCallback(
    async (messageId: string) => {
      if (!profile?.is_admin) return;
      const confirmed = window.confirm("Apagar esta mensagem?");
      if (!confirmed) return;
      // Remove reply references first, then delete
      await supabase
        .from("messages")
        .update({ reply_to_id: null })
        .eq("reply_to_id", messageId);

      const { error } = await supabase
        .from("messages")
        .delete()
        .eq("id", messageId);
      if (error) {
        console.error("Erro ao apagar:", error.message);
        alert("Erro ao apagar mensagem: " + error.message);
        return;
      }
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    },
    [profile]
  );

  const handleMuteUser = useCallback(
    async (userId: string) => {
      if (!profile?.is_admin) return;
      const confirmed = window.confirm("Silenciar este usuário por 1 hora?");
      if (!confirmed) return;
      const muteUntil = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      const { error: muteError } = await supabase
        .from("mutes")
        .insert({ user_id: userId, muted_until: muteUntil });

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ is_muted: true, muted_until: muteUntil })
        .eq("id", userId);

      if (muteError || profileError) {
        console.error("Erro ao mutar:", muteError?.message, profileError?.message);
        alert("Erro ao silenciar: " + (muteError?.message || profileError?.message));
        return;
      }
      alert("Usuário silenciado por 1 hora!");
    },
    [profile]
  );

  const handleBanUser = useCallback(
    async (userId: string) => {
      if (!profile?.is_admin) return;
      const confirmed = window.confirm("BANIR este usuário permanentemente?");
      if (!confirmed) return;
      // Mark as banned (DB trigger stores email in banned_emails)
      await supabase
        .from("profiles")
        .update({ is_banned: true })
        .eq("id", userId);
      // Delete all their messages from DB
      await supabase
        .from("messages")
        .delete()
        .eq("user_id", userId);
      // Track banned user and remove their messages from view
      setBannedIds((prev) => new Set([...prev, userId]));
      setMessages((prev) => prev.filter((m) => m.user_id !== userId));
    },
    [profile]
  );

  const handleProfileSetupComplete = useCallback(async () => {
    if (!authUser) return;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (data) {
      setProfile(data as Profile);
      setAppState("beta");
    }
  }, [authUser]);

  const handleEnterCommunity = useCallback(() => {
    localStorage.setItem("chat-brasil-beta-seen", "true");
    setAppState("chat");
  }, []);

  const handleDevLogin = useCallback(() => {
    const fakeProfile: Profile = {
      id: "dev-user-001",
      nickname: "TestUser",
      avatar_url: null,
      created_at: new Date().toISOString(),
      message_count: 0,
      reaction_count: 0,
      reputation: 0,
      is_banned: false,
      is_muted: false,
      muted_until: null,
    };
    setProfile(fakeProfile);
    // Fake online users for testing mentions
    const fakeUsers: Profile[] = [
      fakeProfile,
      { id: "dev-2", nickname: "Maria", avatar_url: null, created_at: new Date().toISOString(), message_count: 5, reaction_count: 2, reputation: 3, is_banned: false, is_muted: false, muted_until: null },
      { id: "dev-3", nickname: "Carlos", avatar_url: null, created_at: new Date().toISOString(), message_count: 12, reaction_count: 8, reputation: 7, is_banned: false, is_muted: false, muted_until: null },
      { id: "dev-4", nickname: "Ana", avatar_url: null, created_at: new Date().toISOString(), message_count: 3, reaction_count: 1, reputation: 1, is_banned: false, is_muted: false, muted_until: null },
      { id: "dev-5", nickname: "Douglas", avatar_url: null, created_at: new Date().toISOString(), message_count: 20, reaction_count: 15, reputation: 12, is_banned: false, is_muted: false, muted_until: null },
    ];
    setOnlineUsers(fakeUsers);
    setAllUsers(fakeUsers);
    setOnlineCount(5);
    setAppState("beta");
  }, []);

  // Render based on app state
  if (appState === "loading") {
    return (
      <div className="h-screen flex items-center justify-center bg-[#13151a]">
        <div className="text-center">
          <p className="text-4xl mb-3 animate-bounce">🇧🇷</p>
          <p className="text-cyan-400 font-semibold">Carregando Chat Brasil...</p>
        </div>
      </div>
    );
  }

  if (appState === "login") {
    return <LoginScreen />;
  }

  if (appState === "setup" && authUser) {
    return <SetupNickname user={authUser} onComplete={handleProfileSetupComplete} />;
  }

  if (appState === "beta") {
    return <BetaScreen onEnter={handleEnterCommunity} />;
  }

  if (!profile) return null;

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden bg-[#13151a] relative pt-[calc(57px+env(safe-area-inset-top))]">
      <ChatHeader
        profile={profile}
        onlineCount={onlineCount}
        notificationCount={notifications.filter((n) => !n.read).length}
        onOpenProfile={() => setShowProfile(true)}
        onOpenReports={() => setReportTarget({ messageId: null, userId: null })}
        onOpenSettings={() => setShowSettings(true)}
        onOpenNotifications={() => {
          setShowNotifications(true);
          markAllNotificationsRead();
        }}
      />

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto relative" ref={messagesContainerRef}>
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-4xl mb-3">🎌</p>
              <p className="text-gray-500">Seja o primeiro a mandar uma mensagem!</p>
              <p className="text-gray-600 text-sm mt-1">A comunidade começa com você 💚</p>
            </div>
          </div>
        ) : (
          <div className="py-2">
            {messages.map((msg) => (
              <div key={msg.id} id={`msg-${msg.id}`}>
                <ChatMessage
                  message={msg}
                  currentUserId={profile.id}
                  currentNickname={profile.nickname}
                  reactions={reactions.filter((r) => r.message_id === msg.id)}
                  replyTo={(() => {
                    const replyId = msg.reply_to_id || replyMap[msg.id];
                    if (!replyId) return null;
                    return messages.find((m) => m.id === replyId) || null;
                  })()}
                  onReact={handleReact}
                  onRemoveReact={handleRemoveReact}
                  onReport={(msgId: string) => {
                    const m = messages.find((x) => x.id === msgId);
                    setReportTarget({ messageId: msgId, userId: m?.user_id || null });
                  }}
                  onReply={(m: Message) => setReplyingTo(m)}
                  onMentionClick={() => {}}
                  onScrollToMessage={(msgId: string) => {
                    const el = document.getElementById(`msg-${msgId}`);
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth", block: "center" });
                      el.classList.add("bg-yellow-500/10");
                      setTimeout(() => el.classList.remove("bg-yellow-500/10"), 1500);
                    }
                  }}
                  isAdmin={profile.is_admin}
                  onDeleteMessage={handleDeleteMessage}
                  onMuteUser={handleMuteUser}
                  onBanUser={handleBanUser}
                />
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Scroll to bottom button */}
      {showScrollDown && (
        <button
          onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })}
          className="absolute bottom-24 right-4 w-10 h-10 rounded-full bg-[#2b2d31] border border-gray-600 shadow-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-[#35373c] transition-colors z-20"
          title="Ir para novas mensagens"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      )}

      {/* Input */}
      <ChatInput
        onSend={handleSendMessage}
        onlineUsers={allUsers}
        disabled={profile.is_muted}
        mutedUntil={profile.muted_until}
        replyingTo={replyingTo}
        onCancelReply={() => setReplyingTo(null)}
      />

      {/* Notifications panel */}
      {showNotifications && (
        <NotificationsPanel
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onClickNotification={(messageId: string) => {
            setShowNotifications(false);
            // Mark all as read
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            if (profile) {
              supabase.from("notifications").update({ is_read: true }).eq("user_id", profile.id).eq("is_read", false);
            }
            // Scroll to message
            const el = document.getElementById(`msg-${messageId}`);
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "center" });
              el.classList.add("bg-yellow-500/10");
              setTimeout(() => el.classList.remove("bg-yellow-500/10"), 1500);
            }
          }}
          onClearAll={() => {
            setNotifications([]);
            if (profile) {
              supabase.from("notifications").delete().eq("user_id", profile.id);
            }
          }}
        />
      )}

      {/* Modals */}
      {showProfile && (
        <ProfileModal
          profile={profile}
          isOwn={true}
          onClose={() => setShowProfile(false)}
        />
      )}

      {showSettings && (
        <SettingsModal
          profile={profile}
          onClose={() => setShowSettings(false)}
          onUpdateNick={handleUpdateNick}
          onLogout={handleLogout}
          onDeleteAccount={handleDeleteAccount}
        />
      )}

      {reportTarget && (
        <ReportModal
          messageId={reportTarget.messageId}
          reportedUserId={reportTarget.userId}
          onSubmit={handleReport}
          onClose={() => setReportTarget(null)}
        />
      )}
    </div>
  );
}
