export interface Profile {
  id: string;
  nickname: string;
  avatar_url: string | null;
  created_at: string;
  message_count: number;
  reaction_count: number;
  reputation: number;
  is_banned: boolean;
  is_muted: boolean;
  muted_until: string | null;
  is_admin?: boolean;
}

export interface Message {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  profile?: Profile;
  reactions?: Reaction[];
  mentions?: string[];
  reply_to_id?: string | null;
}

export interface Reaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  reported_user_id: string | null;
  message_id: string | null;
  reason: ReportReason;
  description: string | null;
  status: "pending" | "resolved" | "dismissed";
  created_at: string;
}

export type ReportReason =
  | "spam"
  | "scam"
  | "harassment"
  | "threat"
  | "illegal"
  | "other";

export const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "😡"] as const;

export const REPORT_REASONS: { value: ReportReason; label: string }[] = [
  { value: "spam", label: "Spam" },
  { value: "scam", label: "Golpe" },
  { value: "harassment", label: "Assédio" },
  { value: "threat", label: "Ameaça" },
  { value: "illegal", label: "Conteúdo ilegal" },
  { value: "other", label: "Outro" },
];
