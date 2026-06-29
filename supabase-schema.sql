-- ==========================================================
-- MINNA BRASIL - Database Schema
-- Execute este SQL no Supabase SQL Editor
-- ==========================================================

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT UNIQUE NOT NULL CHECK (char_length(nickname) >= 3 AND char_length(nickname) <= 20),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  message_count INTEGER DEFAULT 0,
  reaction_count INTEGER DEFAULT 0,
  reputation INTEGER DEFAULT 0,
  is_banned BOOLEAN DEFAULT FALSE,
  is_muted BOOLEAN DEFAULT FALSE,
  muted_until TIMESTAMPTZ,
  is_admin BOOLEAN DEFAULT FALSE
);

-- Messages table (chat global)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) >= 1 AND char_length(content) <= 2000),
  mentions TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE
);

-- Reactions table
CREATE TABLE IF NOT EXISTS reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(message_id, user_id, emoji)
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reported_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
  reason TEXT NOT NULL CHECK (reason IN ('spam', 'scam', 'harassment', 'threat', 'illegal', 'other')),
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('mention', 'reply', 'report_resolved')),
  message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
  from_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Online presence table
CREATE TABLE IF NOT EXISTS presence (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  is_online BOOLEAN DEFAULT FALSE
);

-- Mutes table
CREATE TABLE IF NOT EXISTS mutes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  muted_until TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Banned emails table (prevent re-login with same email)
CREATE TABLE IF NOT EXISTS banned_emails (
  email TEXT PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  banned_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- INDEXES
-- ==========================================================

CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_reactions_message_id ON reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_profiles_nickname ON profiles(nickname);
CREATE INDEX IF NOT EXISTS idx_mutes_user_id ON mutes(user_id);
CREATE INDEX IF NOT EXISTS idx_banned_emails_user_id ON banned_emails(user_id);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE mutes ENABLE ROW LEVEL SECURITY;
ALTER TABLE banned_emails ENABLE ROW LEVEL SECURITY;

-- Profiles: anyone can read, only owner can update
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Messages: anyone can read non-deleted, authenticated can insert if not muted
CREATE POLICY "Messages are viewable by everyone" ON messages FOR SELECT USING (is_deleted = false);
CREATE POLICY "Authenticated users can send messages" ON messages FOR INSERT WITH CHECK (
  auth.uid() = user_id
  AND NOT EXISTS (
    SELECT 1 FROM mutes
    WHERE mutes.user_id = auth.uid()
      AND mutes.muted_until > NOW()
  )
);
CREATE POLICY "Admins can update messages" ON messages FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Reactions: anyone can read, authenticated can insert/delete own
CREATE POLICY "Reactions are viewable by everyone" ON reactions FOR SELECT USING (true);
CREATE POLICY "Users can add reactions" ON reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove own reactions" ON reactions FOR DELETE USING (auth.uid() = user_id);

-- Reports: only reporter can insert, admins can read all
CREATE POLICY "Users can create reports" ON reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Admins can view reports" ON reports FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can update reports" ON reports FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Notifications: only owner can read/update
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notifications" ON notifications FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON notifications FOR INSERT WITH CHECK (true);

-- Presence: anyone can read, owner can update
CREATE POLICY "Presence is viewable by everyone" ON presence FOR SELECT USING (true);
CREATE POLICY "Users can update own presence" ON presence FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can modify own presence" ON presence FOR UPDATE USING (auth.uid() = user_id);

-- Mutes: admins can manage, users can view own
CREATE POLICY "Users can view own mutes" ON mutes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can insert mutes" ON mutes FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can delete mutes" ON mutes FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Banned emails: only admins can read/insert
CREATE POLICY "Admins can view banned emails" ON banned_emails FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can insert banned emails" ON banned_emails FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- ==========================================================
-- REALTIME
-- ==========================================================

ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE presence;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- ==========================================================
-- FUNCTIONS
-- ==========================================================

-- Function to increment message count
CREATE OR REPLACE FUNCTION increment_message_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles SET message_count = message_count + 1 WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_message_insert
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION increment_message_count();

-- Function to increment reaction count and reputation
CREATE OR REPLACE FUNCTION increment_reaction_count()
RETURNS TRIGGER AS $$
DECLARE
  msg_author_id UUID;
BEGIN
  SELECT user_id INTO msg_author_id FROM messages WHERE id = NEW.message_id;
  UPDATE profiles SET reaction_count = reaction_count + 1 WHERE id = msg_author_id;
  IF NEW.emoji IN ('👍', '❤️', '😂') THEN
    UPDATE profiles SET reputation = reputation + 1 WHERE id = msg_author_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_reaction_insert
  AFTER INSERT ON reactions
  FOR EACH ROW EXECUTE FUNCTION increment_reaction_count();

-- Function to create notification on mention
CREATE OR REPLACE FUNCTION notify_mentions()
RETURNS TRIGGER AS $$
DECLARE
  mentioned_nick TEXT;
  mentioned_id UUID;
BEGIN
  IF NEW.mentions IS NOT NULL AND array_length(NEW.mentions, 1) > 0 THEN
    FOREACH mentioned_nick IN ARRAY NEW.mentions LOOP
      SELECT id INTO mentioned_id FROM profiles WHERE nickname = mentioned_nick;
      IF mentioned_id IS NOT NULL AND mentioned_id != NEW.user_id THEN
        INSERT INTO notifications (user_id, type, message_id, from_user_id)
        VALUES (mentioned_id, 'mention', NEW.id, NEW.user_id);
      END IF;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_message_mentions
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION notify_mentions();

-- Function to create notification on reply
CREATE OR REPLACE FUNCTION notify_replies()
RETURNS TRIGGER AS $$
DECLARE
  parent_user_id UUID;
BEGIN
  IF NEW.reply_to_id IS NOT NULL THEN
    SELECT user_id INTO parent_user_id FROM messages WHERE id = NEW.reply_to_id;
    IF parent_user_id IS NOT NULL AND parent_user_id != NEW.user_id THEN
      INSERT INTO notifications (user_id, type, message_id, from_user_id)
      VALUES (parent_user_id, 'reply', NEW.id, NEW.user_id);
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_message_replies
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION notify_replies();

-- Function to get online user count
CREATE OR REPLACE FUNCTION get_online_count()
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM presence WHERE is_online = true AND last_seen > NOW() - INTERVAL '5 minutes');
END;
$$ LANGUAGE plpgsql;

-- Function to store banned email when a user is banned
CREATE OR REPLACE FUNCTION store_banned_email()
RETURNS TRIGGER AS $$
DECLARE
  user_email TEXT;
BEGIN
  IF NEW.is_banned = true AND (OLD.is_banned IS DISTINCT FROM NEW.is_banned) THEN
    SELECT email INTO user_email FROM auth.users WHERE id = NEW.id;
    IF user_email IS NOT NULL THEN
      INSERT INTO banned_emails (email, user_id)
      VALUES (user_email, NEW.id)
      ON CONFLICT (email) DO UPDATE SET banned_at = NOW();
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_banned
  AFTER UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION store_banned_email();
