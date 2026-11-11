-- =========================================================
-- MUSESTREAM DEMO DATA (idempotent: ON CONFLICT DO NOTHING)
-- Artists are FICTIONAL. Audio files are the free SoundHelix
-- demo tracks (https://www.soundhelix.com/audio-examples),
-- intended for testing. Replace audio_url with your own
-- licensed / royalty-free files for production use.
-- =========================================================

INSERT INTO genres (name, description) VALUES
    ('Pop', 'Catchy melodies and polished production.'),
    ('Rock', 'Guitar-driven energy, from garage to stadium.'),
    ('Hip-Hop', 'Rhythmic beats and expressive wordplay.'),
    ('R&B', 'Smooth vocals, soulful grooves.'),
    ('EDM', 'Electronic dance music built for the dance floor.'),
    ('Jazz', 'Improvisation, swing and rich harmony.'),
    ('Classical', 'Orchestral and chamber compositions.'),
    ('Lo-fi', 'Relaxed, dusty beats for study and focus.')
ON CONFLICT (name) DO NOTHING;

INSERT INTO artists (name, biography, image_url) VALUES
    ('Neon Harbor', 'Fictional demo artist. Bright synth-pop duo known for late-night city anthems.', 'https://picsum.photos/seed/ms-artist-neon-harbor/500/500'),
    ('Luna Vale', 'Fictional demo artist. Dreamy bedroom-pop vocalist with shimmering hooks.', 'https://picsum.photos/seed/ms-artist-luna-vale/500/500'),
    ('Midnight Static', 'Fictional demo artist. Four-piece alt-rock band with wall-of-sound guitars.', 'https://picsum.photos/seed/ms-artist-midnight-static/500/500'),
    ('Ember Road', 'Fictional demo artist. Road-trip rock with warm, gritty vocals.', 'https://picsum.photos/seed/ms-artist-ember-road/500/500'),
    ('Kairo Beats', 'Fictional demo artist. Producer-MC mixing boom-bap drums with modern bass.', 'https://picsum.photos/seed/ms-artist-kairo-beats/500/500'),
    ('Silver Cipher', 'Fictional demo artist. Lyricist crew focused on sharp flows and storytelling.', 'https://picsum.photos/seed/ms-artist-silver-cipher/500/500'),
    ('Velvet Echo', 'Fictional demo artist. Velvet-voiced singer blending neo-soul and slow jams.', 'https://picsum.photos/seed/ms-artist-velvet-echo/500/500'),
    ('Pulse Theory', 'Fictional demo artist. Festival-ready house and trance producer.', 'https://picsum.photos/seed/ms-artist-pulse-theory/500/500'),
    ('Skyline Drift', 'Fictional demo artist. Future-bass duo with soaring drops.', 'https://picsum.photos/seed/ms-artist-skyline-drift/500/500'),
    ('Blue Alley Quartet', 'Fictional demo artist. Smoky club quartet playing modern straight-ahead jazz.', 'https://picsum.photos/seed/ms-artist-blue-alley-quartet/500/500'),
    ('Aria Lumen', 'Fictional demo artist. Chamber composer writing cinematic piano and strings.', 'https://picsum.photos/seed/ms-artist-aria-lumen/500/500'),
    ('Moon Tape', 'Fictional demo artist. Tape-warped lo-fi beats made for studying.', 'https://picsum.photos/seed/ms-artist-moon-tape/500/500')
ON CONFLICT (name) DO NOTHING;

INSERT INTO songs (title, artist_id, genre_id, cover_url, audio_url, duration_seconds, popularity, release_date)
SELECT 'City Lights Tonight', a.id, g.id, 'https://picsum.photos/seed/ms-song-01/500/500', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 180, 96, DATE '2023-02-10'
FROM artists a, genres g WHERE a.name = 'Neon Harbor' AND g.name = 'Pop'
ON CONFLICT (title, artist_id) DO NOTHING;

INSERT INTO songs (title, artist_id, genre_id, cover_url, audio_url, duration_seconds, popularity, release_date)
SELECT 'Pink Skyline', a.id, g.id, 'https://picsum.photos/seed/ms-song-02/500/500', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 197, 71, DATE '2023-06-21'
FROM artists a, genres g WHERE a.name = 'Neon Harbor' AND g.name = 'Pop'
ON CONFLICT (title, artist_id) DO NOTHING;

INSERT INTO songs (title, artist_id, genre_id, cover_url, audio_url, duration_seconds, popularity, release_date)
SELECT 'Echoes of Summer', a.id, g.id, 'https://picsum.photos/seed/ms-song-03/500/500', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', 214, 49, DATE '2023-10-05'
FROM artists a, genres g WHERE a.name = 'Neon Harbor' AND g.name = 'Pop'
ON CONFLICT (title, artist_id) DO NOTHING;

INSERT INTO songs (title, artist_id, genre_id, cover_url, audio_url, duration_seconds, popularity, release_date)
SELECT 'Paper Moon', a.id, g.id, 'https://picsum.photos/seed/ms-song-04/500/500', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', 231, 84, DATE '2024-01-19'
FROM artists a, genres g WHERE a.name = 'Luna Vale' AND g.name = 'Pop'
ON CONFLICT (title, artist_id) DO NOTHING;

INSERT INTO songs (title, artist_id, genre_id, cover_url, audio_url, duration_seconds, popularity, release_date)
SELECT 'Daydream Diary', a.id, g.id, 'https://picsum.photos/seed/ms-song-05/500/500', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', 248, 60, DATE '2024-04-12'
FROM artists a, genres g WHERE a.name = 'Luna Vale' AND g.name = 'Pop'
ON CONFLICT (title, artist_id) DO NOTHING;

INSERT INTO songs (title, artist_id, genre_id, cover_url, audio_url, duration_seconds, popularity, release_date)
SELECT 'Glitter in the Rain', a.id, g.id, 'https://picsum.photos/seed/ms-song-06/500/500', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', 265, 83, DATE '2024-08-30'
FROM artists a, genres g WHERE a.name = 'Luna Vale' AND g.name = 'Pop'
ON CONFLICT (title, artist_id) DO NOTHING;

INSERT INTO songs (title, artist_id, genre_id, cover_url, audio_url, duration_seconds, popularity, release_date)
SELECT 'Burn the Silence', a.id, g.id, 'https://picsum.photos/seed/ms-song-07/500/500', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', 282, 72, DATE '2024-11-08'
FROM artists a, genres g WHERE a.name = 'Midnight Static' AND g.name = 'Rock'
ON CONFLICT (title, artist_id) DO NOTHING;

INSERT INTO songs (title, artist_id, genre_id, cover_url, audio_url, duration_seconds, popularity, release_date)
SELECT 'Static Hearts', a.id, g.id, 'https://picsum.photos/seed/ms-song-08/500/500', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', 299, 49, DATE '2025-03-14'
FROM artists a, genres g WHERE a.name = 'Midnight Static' AND g.name = 'Rock'
ON CONFLICT (title, artist_id) DO NOTHING;

INSERT INTO songs (title, artist_id, genre_id, cover_url, audio_url, duration_seconds, popularity, release_date)
SELECT 'Highway Thunder', a.id, g.id, 'https://picsum.photos/seed/ms-song-09/500/500', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', 196, 71, DATE '2025-07-25'
FROM artists a, genres g WHERE a.name = 'Midnight Static' AND g.name = 'Rock'
ON CONFLICT (title, artist_id) DO NOTHING;

INSERT INTO songs (title, artist_id, genre_id, cover_url, audio_url, duration_seconds, popularity, release_date)
SELECT 'Dust and Gasoline', a.id, g.id, 'https://picsum.photos/seed/ms-song-10/500/500', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', 213, 60, DATE '2023-02-10'
FROM artists a, genres g WHERE a.name = 'Ember Road' AND g.name = 'Rock'
ON CONFLICT (title, artist_id) DO NOTHING;

INSERT INTO songs (title, artist_id, genre_id, cover_url, audio_url, duration_seconds, popularity, release_date)
SELECT 'Last Mile Home', a.id, g.id, 'https://picsum.photos/seed/ms-song-11/500/500', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3', 230, 84, DATE '2023-06-21'
FROM artists a, genres g WHERE a.name = 'Ember Road' AND g.name = 'Rock'
ON CONFLICT (title, artist_id) DO NOTHING;

INSERT INTO songs (title, artist_id, genre_id, cover_url, audio_url, duration_seconds, popularity, release_date)
SELECT 'Campfire Radio', a.id, g.id, 'https://picsum.photos/seed/ms-song-12/500/500', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', 247, 60, DATE '2023-10-05'
FROM artists a, genres g WHERE a.name = 'Ember Road' AND g.name = 'Rock'
ON CONFLICT (title, artist_id) DO NOTHING;

INSERT INTO songs (title, artist_id, genre_id, cover_url, audio_url, duration_seconds, popularity, release_date)
SELECT 'Concrete Rhythm', a.id, g.id, 'https://picsum.photos/seed/ms-song-13/500/500', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3', 264, 96, DATE '2024-01-19'
FROM artists a, genres g WHERE a.name = 'Kairo Beats' AND g.name = 'Hip-Hop'
ON CONFLICT (title, artist_id) DO NOTHING;

INSERT INTO songs (title, artist_id, genre_id, cover_url, audio_url, duration_seconds, popularity, release_date)
SELECT 'Vinyl Memories', a.id, g.id, 'https://picsum.photos/seed/ms-song-14/500/500', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3', 281, 71, DATE '2024-04-12'
FROM artists a, genres g WHERE a.name = 'Kairo Beats' AND g.name = 'Hip-Hop'
ON CONFLICT (title, artist_id) DO NOTHING;

INSERT INTO songs (title, artist_id, genre_id, cover_url, audio_url, duration_seconds, popularity, release_date)
SELECT 'Midnight Cypher', a.id, g.id, 'https://picsum.photos/seed/ms-song-15/500/500', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3', 298, 49, DATE '2024-08-30'
FROM artists a, genres g WHERE a.name = 'Kairo Beats' AND g.name = 'Hip-Hop'
ON CONFLICT (title, artist_id) DO NOTHING;

INSERT INTO songs (title, artist_id, genre_id, cover_url, audio_url, duration_seconds, popularity, release_date)
SELECT 'Chrome Dreams', a.id, g.id, 'https://picsum.photos/seed/ms-song-16/500/500', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3', 195, 84, DATE '2024-11-08'
FROM artists a, genres g WHERE a.name = 'Silver Cipher' AND g.name = 'Hip-Hop'
ON CONFLICT (title, artist_id) DO NOTHING;

INSERT INTO songs (title, artist_id, genre_id, cover_url, audio_url, duration_seconds, popularity, release_date)
SELECT 'Words Like Fire', a.id, g.id, 'https://picsum.photos/seed/ms-song-17/500/500', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3', 212, 60, DATE '2025-03-14'
FROM artists a, genres g WHERE a.name = 'Silver Cipher' AND g.name = 'Hip-Hop'
ON CONFLICT (title, artist_id) DO NOTHING;

INSERT INTO songs (title, artist_id, genre_id, cover_url, audio_url, duration_seconds, popularity, release_date)
SELECT 'Rooftop Verses', a.id, g.id, 'https://picsum.photos/seed/ms-song-18/500/500', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 229, 83, DATE '2025-07-25'
FROM artists a, genres g WHERE a.name = 'Silver Cipher' AND g.name = 'Hip-Hop'
ON CONFLICT (title, artist_id) DO NOTHING;

INSERT INTO songs (title, artist_id, genre_id, cover_url, audio_url, duration_seconds, popularity, release_date)
SELECT 'Slow Burn', a.id, g.id, 'https://picsum.photos/seed/ms-song-19/500/500', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 246, 72, DATE '2023-02-10'
FROM artists a, genres g WHERE a.name = 'Velvet Echo' AND g.name = 'R&B'
ON CONFLICT (title, artist_id) DO NOTHING;

INSERT INTO songs (title, artist_id, genre_id, cover_url, audio_url, duration_seconds, popularity, release_date)
SELECT 'Moonlit Whisper', a.id, g.id, 'https://picsum.photos/seed/ms-song-20/500/500', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', 263, 49, DATE '2023-06-21'
FROM artists a, genres g WHERE a.name = 'Velvet Echo' AND g.name = 'R&B'
ON CONFLICT (title, artist_id) DO NOTHING;

INSERT INTO songs (title, artist_id, genre_id, cover_url, audio_url, duration_seconds, popularity, release_date)
SELECT 'Silk and Honey', a.id, g.id, 'https://picsum.photos/seed/ms-song-21/500/500', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', 280, 71, DATE '2023-10-05'
FROM artists a, genres g WHERE a.name = 'Velvet Echo' AND g.name = 'R&B'
ON CONFLICT (title, artist_id) DO NOTHING;

INSERT INTO songs (title, artist_id, genre_id, cover_url, audio_url, duration_seconds, popularity, release_date)
SELECT 'Afterglow Drop', a.id, g.id, 'https://picsum.photos/seed/ms-song-22/500/500', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', 297, 60, DATE '2024-01-19'
FROM artists a, genres g WHERE a.name = 'Pulse Theory' AND g.name = 'EDM'
ON CONFLICT (title, artist_id) DO NOTHING;

INSERT INTO songs (title, artist_id, genre_id, cover_url, audio_url, duration_seconds, popularity, release_date)
SELECT 'Neon Pulse', a.id, g.id, 'https://picsum.photos/seed/ms-song-23/500/500', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', 194, 84, DATE '2024-04-12'
FROM artists a, genres g WHERE a.name = 'Pulse Theory' AND g.name = 'EDM'
ON CONFLICT (title, artist_id) DO NOTHING;

INSERT INTO songs (title, artist_id, genre_id, cover_url, audio_url, duration_seconds, popularity, release_date)
SELECT 'Gravity Bass', a.id, g.id, 'https://picsum.photos/seed/ms-song-24/500/500', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', 211, 60, DATE '2024-08-30'
FROM artists a, genres g WHERE a.name = 'Pulse Theory' AND g.name = 'EDM'
ON CONFLICT (title, artist_id) DO NOTHING;

INSERT INTO songs (title, artist_id, genre_id, cover_url, audio_url, duration_seconds, popularity, release_date)
SELECT 'Rise Above', a.id, g.id, 'https://picsum.photos/seed/ms-song-25/500/500', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', 228, 96, DATE '2024-11-08'
FROM artists a, genres g WHERE a.name = 'Skyline Drift' AND g.name = 'EDM'
ON CONFLICT (title, artist_id) DO NOTHING;

INSERT INTO songs (title, artist_id, genre_id, cover_url, audio_url, duration_seconds, popularity, release_date)
SELECT 'Digital Sunrise', a.id, g.id, 'https://picsum.photos/seed/ms-song-26/500/500', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', 245, 71, DATE '2025-03-14'
FROM artists a, genres g WHERE a.name = 'Skyline Drift' AND g.name = 'EDM'
ON CONFLICT (title, artist_id) DO NOTHING;

INSERT INTO songs (title, artist_id, genre_id, cover_url, audio_url, duration_seconds, popularity, release_date)
SELECT 'Waves of Light', a.id, g.id, 'https://picsum.photos/seed/ms-song-27/500/500', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', 262, 49, DATE '2025-07-25'
FROM artists a, genres g WHERE a.name = 'Skyline Drift' AND g.name = 'EDM'
ON CONFLICT (title, artist_id) DO NOTHING;

INSERT INTO songs (title, artist_id, genre_id, cover_url, audio_url, duration_seconds, popularity, release_date)
SELECT 'Smoke and Saxophone', a.id, g.id, 'https://picsum.photos/seed/ms-song-28/500/500', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3', 279, 84, DATE '2023-02-10'
FROM artists a, genres g WHERE a.name = 'Blue Alley Quartet' AND g.name = 'Jazz'
ON CONFLICT (title, artist_id) DO NOTHING;

INSERT INTO songs (title, artist_id, genre_id, cover_url, audio_url, duration_seconds, popularity, release_date)
SELECT 'Late Night Swing', a.id, g.id, 'https://picsum.photos/seed/ms-song-29/500/500', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', 296, 60, DATE '2023-06-21'
FROM artists a, genres g WHERE a.name = 'Blue Alley Quartet' AND g.name = 'Jazz'
ON CONFLICT (title, artist_id) DO NOTHING;

INSERT INTO songs (title, artist_id, genre_id, cover_url, audio_url, duration_seconds, popularity, release_date)
SELECT 'Rainy Day Blues', a.id, g.id, 'https://picsum.photos/seed/ms-song-30/500/500', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3', 193, 83, DATE '2023-10-05'
FROM artists a, genres g WHERE a.name = 'Blue Alley Quartet' AND g.name = 'Jazz'
ON CONFLICT (title, artist_id) DO NOTHING;

INSERT INTO songs (title, artist_id, genre_id, cover_url, audio_url, duration_seconds, popularity, release_date)
SELECT 'Winter Sonata', a.id, g.id, 'https://picsum.photos/seed/ms-song-31/500/500', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3', 210, 72, DATE '2024-01-19'
FROM artists a, genres g WHERE a.name = 'Aria Lumen' AND g.name = 'Classical'
ON CONFLICT (title, artist_id) DO NOTHING;

INSERT INTO songs (title, artist_id, genre_id, cover_url, audio_url, duration_seconds, popularity, release_date)
SELECT 'Dawn in Minor', a.id, g.id, 'https://picsum.photos/seed/ms-song-32/500/500', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3', 227, 49, DATE '2024-04-12'
FROM artists a, genres g WHERE a.name = 'Aria Lumen' AND g.name = 'Classical'
ON CONFLICT (title, artist_id) DO NOTHING;

INSERT INTO songs (title, artist_id, genre_id, cover_url, audio_url, duration_seconds, popularity, release_date)
SELECT 'Moonlight Etude', a.id, g.id, 'https://picsum.photos/seed/ms-song-33/500/500', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3', 244, 71, DATE '2024-08-30'
FROM artists a, genres g WHERE a.name = 'Aria Lumen' AND g.name = 'Classical'
ON CONFLICT (title, artist_id) DO NOTHING;

INSERT INTO songs (title, artist_id, genre_id, cover_url, audio_url, duration_seconds, popularity, release_date)
SELECT 'Rainy Window', a.id, g.id, 'https://picsum.photos/seed/ms-song-34/500/500', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3', 261, 60, DATE '2024-11-08'
FROM artists a, genres g WHERE a.name = 'Moon Tape' AND g.name = 'Lo-fi'
ON CONFLICT (title, artist_id) DO NOTHING;

INSERT INTO songs (title, artist_id, genre_id, cover_url, audio_url, duration_seconds, popularity, release_date)
SELECT 'Study Session', a.id, g.id, 'https://picsum.photos/seed/ms-song-35/500/500', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 278, 84, DATE '2025-03-14'
FROM artists a, genres g WHERE a.name = 'Moon Tape' AND g.name = 'Lo-fi'
ON CONFLICT (title, artist_id) DO NOTHING;

INSERT INTO songs (title, artist_id, genre_id, cover_url, audio_url, duration_seconds, popularity, release_date)
SELECT 'Coffee at 2AM', a.id, g.id, 'https://picsum.photos/seed/ms-song-36/500/500', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 295, 60, DATE '2025-07-25'
FROM artists a, genres g WHERE a.name = 'Moon Tape' AND g.name = 'Lo-fi'
ON CONFLICT (title, artist_id) DO NOTHING;
