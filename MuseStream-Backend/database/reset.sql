-- =========================================================
-- MUSESTREAM RESET (DEVELOPMENT ONLY)
-- Drops every MuseStream table. Run it manually, then restart
-- the backend: schema.sql and data.sql recreate everything.
--   psql -U postgres -d musestream -f database/reset.sql
-- =========================================================
DROP TABLE IF EXISTS listening_history      CASCADE;
DROP TABLE IF EXISTS playlist_songs         CASCADE;
DROP TABLE IF EXISTS user_favorite_songs    CASCADE;
DROP TABLE IF EXISTS user_favorite_artists  CASCADE;
DROP TABLE IF EXISTS user_genre_preferences CASCADE;
DROP TABLE IF EXISTS playlists              CASCADE;
DROP TABLE IF EXISTS songs                  CASCADE;
DROP TABLE IF EXISTS artists                CASCADE;
DROP TABLE IF EXISTS genres                 CASCADE;
DROP TABLE IF EXISTS users                  CASCADE;
