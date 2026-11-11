# MuseStream – Entity Relationship Diagram

The diagram below renders automatically on GitHub, VS Code (Markdown Preview Mermaid Support) and most Markdown viewers.

```mermaid
erDiagram
    USERS ||--o{ PLAYLISTS : creates
    USERS ||--o{ LISTENING_HISTORY : plays
    USERS }o--o{ SONGS : "favorites (user_favorite_songs)"
    USERS }o--o{ ARTISTS : "follows (user_favorite_artists)"
    USERS }o--o{ GENRES : "prefers (user_genre_preferences)"
    ARTISTS ||--o{ SONGS : performs
    GENRES ||--o{ SONGS : classifies
    PLAYLISTS ||--o{ PLAYLIST_SONGS : contains
    SONGS ||--o{ PLAYLIST_SONGS : "appears in"
    SONGS ||--o{ LISTENING_HISTORY : "is played in"

    USERS {
        bigint id PK
        varchar username
        varchar email UK
        varchar password "BCrypt hash"
        boolean onboarding_completed
        timestamp created_at
    }
    ARTISTS {
        bigint id PK
        varchar name UK
        text biography
        text image_url
        timestamp created_at
    }
    GENRES {
        bigint id PK
        varchar name UK
        text description
    }
    SONGS {
        bigint id PK
        varchar title
        bigint artist_id FK
        bigint genre_id FK
        text cover_url
        text audio_url
        int duration_seconds
        int popularity
        date release_date
        timestamp created_at
    }
    PLAYLISTS {
        bigint id PK
        bigint user_id FK
        varchar name
        text description
        text cover_url
        boolean is_public
        timestamp created_at
        timestamp updated_at
    }
    PLAYLIST_SONGS {
        bigint playlist_id PK, FK
        bigint song_id PK, FK
        int position
        timestamp added_at
    }
    USER_FAVORITE_SONGS {
        bigint user_id PK, FK
        bigint song_id PK, FK
        timestamp added_at
    }
    USER_FAVORITE_ARTISTS {
        bigint user_id PK, FK
        bigint artist_id PK, FK
    }
    USER_GENRE_PREFERENCES {
        bigint user_id PK, FK
        bigint genre_id PK, FK
    }
    LISTENING_HISTORY {
        bigint id PK
        bigint user_id FK
        bigint song_id FK
        timestamp played_at
    }
```

## What changed compared with the original schema

| Change | Why |
|---|---|
| New table `listening_history` | Records every play. Feeds the recommendation engine and the dashboard. |
| `playlists`: `description`, `cover_url`, `is_public`, `updated_at`; `user_id` is now `NOT NULL` | Richer playlists; a playlist must always belong to a user. |
| `playlist_songs`: `position`, `added_at` | Keeps the song order inside a playlist. |
| `artists`: `biography`, `UNIQUE(name)` | Artist page; prevents duplicate artists. |
| `songs`: `release_date`, `created_at`, `UNIQUE(title, artist_id)`, `CHECK` constraints | "New releases"; makes seeding idempotent; blocks negative values. |
| Indexes on every foreign key, `popularity`, `LOWER(title)`, `LOWER(name)`, `(user_id, played_at DESC)` | Fast joins, search, trending and history queries. |
| `ON DELETE` rules | Deleting a user cascades to their data; deleting an artist/genre keeps the songs (`SET NULL`); deleting a song removes it from playlists, favorites and history (`CASCADE`). |
| Scripts are idempotent (`IF NOT EXISTS`, `ON CONFLICT DO NOTHING`) | The backend can restart without wiping data. Use `database/reset.sql` for a clean slate. |

## Relationships used by the recommendation engine

```
User ──► user_genre_preferences ──► Genre   ──┐
User ──► user_favorite_artists  ──► Artist  ──┼──►  score every Song
User ──► user_favorite_songs    ──► Song    ──┤
User ──► listening_history      ──► Song    ──┘
```
