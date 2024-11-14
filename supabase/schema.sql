-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    avatar_url TEXT,
    bio TEXT,
    favorite_genres TEXT[],
    social_links JSONB,
    notification_preferences JSONB DEFAULT '{"email": true, "push": true}'::JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Watch Parties table
CREATE TABLE watch_parties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    media_type VARCHAR(50) NOT NULL CHECK (media_type IN ('movie', 'series', 'game')),
    media_title VARCHAR(255) NOT NULL,
    media_cover_url TEXT,
    media_duration INTEGER, -- em minutos
    host_id UUID REFERENCES users(id) NOT NULL,
    is_private BOOLEAN DEFAULT false,
    scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
    max_participants INTEGER,
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'ended', 'cancelled')),
    video_room_id TEXT, -- ID da sala de vídeo (para integração com serviço de streaming)
    chat_enabled BOOLEAN DEFAULT true,
    reactions_enabled BOOLEAN DEFAULT true,
    sync_mode VARCHAR(50) DEFAULT 'host_only' CHECK (sync_mode IN ('host_only', 'democratic')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- User Watch Parties (relacionamento M:N com informações adicionais)
CREATE TABLE user_watch_parties (
    user_id UUID REFERENCES users(id),
    watch_party_id UUID REFERENCES watch_parties(id),
    role VARCHAR(50) DEFAULT 'participant' CHECK (role IN ('host', 'moderator', 'participant')),
    join_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    last_watched_at TIMESTAMP WITH TIME ZONE,
    watch_duration INTEGER, -- tempo total assistido em minutos
    has_video BOOLEAN DEFAULT false,
    has_audio BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    PRIMARY KEY (user_id, watch_party_id)
);

-- Ratings table
CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) NOT NULL,
    watch_party_id UUID REFERENCES watch_parties(id) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE (user_id, watch_party_id)
);

-- Watch Party Invitations
CREATE TABLE invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    watch_party_id UUID REFERENCES watch_parties(id) NOT NULL,
    sender_id UUID REFERENCES users(id) NOT NULL,
    receiver_id UUID REFERENCES users(id) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Watch Party Chat Messages
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    watch_party_id UUID REFERENCES watch_parties(id) NOT NULL,
    user_id UUID REFERENCES users(id) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'text' CHECK (type IN ('text', 'emoji', 'system')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Watch Party Reactions
CREATE TABLE reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    watch_party_id UUID REFERENCES watch_parties(id) NOT NULL,
    user_id UUID REFERENCES users(id) NOT NULL,
    reaction_type VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_watch_parties_updated_at
    BEFORE UPDATE ON watch_parties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ratings_updated_at
    BEFORE UPDATE ON ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invitations_updated_at
    BEFORE UPDATE ON invitations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Índices para melhor performance
CREATE INDEX idx_watch_parties_host_id ON watch_parties(host_id);
CREATE INDEX idx_watch_parties_status ON watch_parties(status);
CREATE INDEX idx_watch_parties_scheduled_for ON watch_parties(scheduled_for);
CREATE INDEX idx_user_watch_parties_user_id ON user_watch_parties(user_id);
CREATE INDEX idx_user_watch_parties_watch_party_id ON user_watch_parties(watch_party_id);
CREATE INDEX idx_ratings_watch_party_id ON ratings(watch_party_id);
CREATE INDEX idx_chat_messages_watch_party_id ON chat_messages(watch_party_id);
CREATE INDEX idx_reactions_watch_party_id ON reactions(watch_party_id);

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE watch_parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_watch_parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view public profiles"
    ON users FOR SELECT
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Public watch parties are visible to all"
    ON watch_parties FOR SELECT
    USING (NOT is_private OR host_id = auth.uid() OR 
           EXISTS (
               SELECT 1 FROM user_watch_parties 
               WHERE watch_party_id = watch_parties.id 
               AND user_id = auth.uid()
           ));

CREATE POLICY "Only hosts can update their watch parties"
    ON watch_parties FOR UPDATE
    USING (host_id = auth.uid());

-- Functions
CREATE OR REPLACE FUNCTION get_watch_party_participants(party_id UUID)
RETURNS TABLE (
    user_id UUID,
    username VARCHAR,
    role VARCHAR,
    is_active BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.username,
        uwp.role,
        uwp.is_active
    FROM user_watch_parties uwp
    JOIN users u ON u.id = uwp.user_id
    WHERE uwp.watch_party_id = party_id;
END;
$$ LANGUAGE plpgsql;