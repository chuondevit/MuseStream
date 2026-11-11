-- =========================================================
-- MUSESTREAM DATABASE SCHEMA  (PostgreSQL 13+)
-- Idempotent: safe to run on every application start.
-- Data is NEVER dropped here. To wipe everything use
-- database/reset.sql (development only).
-- =========================================================

-- 1. USERS
CREATE TABLE IF NOT EXISTS users (
    id                    BIGSERIAL PRIMARY KEY,
    username              VARCHAR(80)  NOT NULL,
    email                 VARCHAR(150) NOT NULL UNIQUE,
    password              VARCHAR(255) NOT NULL,
    onboarding_completed  BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at            TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. ARTISTS
CREATE TABLE IF NOT EXISTS artists (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(150) NOT NULL UNIQUE,
    biography   TEXT,
    image_url   TEXT,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. GENRES
CREATE TABLE IF NOT EXISTS genres (
    id           BIGSERIAL PRIMARY KEY,
    name         VARCHAR(80) NOT NULL UNIQUE,
    description  TEXT
);

-- 4. SONGS
CREATE TABLE IF NOT EXISTS songs (
    id                BIGSERIAL PRIMARY KEY,
    title             VARCHAR(200) NOT NULL,
    artist_id         BIGINT,
    genre_id          BIGINT,
    cover_url         TEXT,
    audio_url         TEXT,
    duration_seconds  INTEGER   CHECK (duration_seconds IS NULL OR duration_seconds >= 0),
    popularity        INTEGER   NOT NULL DEFAULT 0 CHECK (popularity >= 0),
    release_date      DATE,
    created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_songs_artist FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE SET NULL,
    CONSTRAINT fk_songs_genre  FOREIGN KEY (genre_id)  REFERENCES genres(id)  ON DELETE SET NULL,
    CONSTRAINT uq_songs_title_artist UNIQUE (title, artist_id)
);

-- 5. USER FAVORITE SONGS (also used as "Liked Songs")
CREATE TABLE IF NOT EXISTS user_favorite_songs (
    user_id  BIGINT NOT NULL,
    song_id  BIGINT NOT NULL,
    added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id, song_id),
    CONSTRAINT fk_favorite_songs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_favorite_songs_song FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
);

-- 6. USER FAVORITE ARTISTS
CREATE TABLE IF NOT EXISTS user_favorite_artists (
    user_id   BIGINT NOT NULL,
    artist_id BIGINT NOT NULL,

    PRIMARY KEY (user_id, artist_id),
    CONSTRAINT fk_favorite_artists_user   FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE,
    CONSTRAINT fk_favorite_artists_artist FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
);

-- 7. USER GENRE PREFERENCES
CREATE TABLE IF NOT EXISTS user_genre_preferences (
    user_id  BIGINT NOT NULL,
    genre_id BIGINT NOT NULL,

    PRIMARY KEY (user_id, genre_id),
    CONSTRAINT fk_genre_preferences_user  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
    CONSTRAINT fk_genre_preferences_genre FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
);

-- 8. PLAYLISTS
CREATE TABLE IF NOT EXISTS playlists (
    id           BIGSERIAL PRIMARY KEY,
    user_id      BIGINT       NOT NULL,
    name         VARCHAR(150) NOT NULL,
    description  TEXT,
    cover_url    TEXT,
    is_public    BOOLEAN   NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_playlists_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 9. PLAYLIST SONGS (ordered)
CREATE TABLE IF NOT EXISTS playlist_songs (
    playlist_id BIGINT  NOT NULL,
    song_id     BIGINT  NOT NULL,
    position    INTEGER NOT NULL DEFAULT 0,
    added_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (playlist_id, song_id),
    CONSTRAINT fk_playlist_songs_playlist FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
    CONSTRAINT fk_playlist_songs_song     FOREIGN KEY (song_id)     REFERENCES songs(id)     ON DELETE CASCADE
);

-- 10. LISTENING HISTORY (feeds recommendations and the dashboard)
CREATE TABLE IF NOT EXISTS listening_history (
    id        BIGSERIAL PRIMARY KEY,
    user_id   BIGINT    NOT NULL,
    song_id   BIGINT    NOT NULL,
    played_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_history_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_history_song FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
);

-- 11. INDEXES
CREATE INDEX IF NOT EXISTS idx_songs_artist_id            ON songs(artist_id);
CREATE INDEX IF NOT EXISTS idx_songs_genre_id             ON songs(genre_id);
CREATE INDEX IF NOT EXISTS idx_songs_popularity           ON songs(popularity DESC);
CREATE INDEX IF NOT EXISTS idx_songs_title_lower          ON songs(LOWER(title));
CREATE INDEX IF NOT EXISTS idx_artists_name_lower         ON artists(LOWER(name));
CREATE INDEX IF NOT EXISTS idx_playlists_user_id          ON playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorite_songs_song   ON user_favorite_songs(song_id);
CREATE INDEX IF NOT EXISTS idx_user_favorite_artists_art  ON user_favorite_artists(artist_id);
CREATE INDEX IF NOT EXISTS idx_user_genre_pref_genre      ON user_genre_preferences(genre_id);
CREATE INDEX IF NOT EXISTS idx_playlist_songs_song_id     ON playlist_songs(song_id);
CREATE INDEX IF NOT EXISTS idx_playlist_songs_position    ON playlist_songs(playlist_id, position);
CREATE INDEX IF NOT EXISTS idx_history_user_played        ON listening_history(user_id, played_at DESC);
CREATE INDEX IF NOT EXISTS idx_history_song               ON listening_history(song_id);
