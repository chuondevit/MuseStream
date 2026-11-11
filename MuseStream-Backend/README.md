# 🎵 MuseStream – Backend

**Design and Development of a Music Streaming Platform with Personalized Recommendations**

RESTful backend built with **Java Spring Boot (MVC)**, **PostgreSQL**, **Spring Data JPA / Hibernate** and **Spring Security + JWT**. The ReactJS frontend consumes this API.

| Layer | Technology |
|---|---|
| Language / Framework | Java 17+ (JDK 21 supported), Spring Boot 3.3 |
| Architecture | MVC + REST – `Controller → Service → Repository` |
| Database | PostgreSQL 13+ |
| Security | Spring Security, stateless JWT (HS256), BCrypt password hashing |
| Validation | Jakarta Bean Validation, uniform JSON error responses |

---

## 1. Quick start

### Requirements
- JDK 17 or newer (21 works)
- Maven 3.9+
- PostgreSQL 13+

### Step 1 – Create the database (once)
```sql
CREATE DATABASE musestream;
```
or `createdb -U postgres musestream`.

### Step 2 – Configure
Copy `.env.example` to `.env` (same folder as `pom.xml`) and set your PostgreSQL password and a long `JWT_SECRET`:

```
DB_URL=jdbc:postgresql://localhost:5432/musestream
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
JWT_SECRET=replace-this-with-a-long-random-secret-of-32-chars-or-more
```
Spring Boot reads `.env` automatically **when you start the app from the project root**. In IntelliJ you can instead set the same names as environment variables in the Run Configuration.

### Step 3 – Run
```bash
mvn spring-boot:run
```
On startup the app runs `schema.sql` (creates tables, indexes) and `data.sql` (8 genres, 12 artists, 36 songs). Both scripts are idempotent, so restarting never duplicates or deletes data.

Check it: <http://localhost:8080/api/health> → `{"status":"UP", ...}`

### Step 4 – Test with Postman
Import `postman/MuseStream.postman_collection.json` and run the folders in order (**Register/Login saves the JWT automatically**).

### Reset the database (development only)
```bash
psql -U postgres -d musestream -f database/reset.sql
```
then restart the backend.

---

## 2. Project structure

```
MuseStream-Backend/
├── pom.xml
├── README.md
├── .env.example
├── database/
│   ├── erd.md                 ER diagram (Mermaid) + schema change notes
│   └── reset.sql              drops all tables (dev only)
├── postman/
│   └── MuseStream.postman_collection.json
└── src/main/
    ├── java/com/musestream/
    │   ├── MuseStreamApplication.java
    │   ├── controller/   Auth, Song, Artist, Genre, Playlist, Recommendation, Me, Dashboard, Health
    │   ├── service/      Auth, Song, Artist, Genre, Playlist, Library, Preference,
    │   │                 Recommendation, History, Dashboard
    │   ├── repository/   Spring Data JPA repositories
    │   ├── model/        JPA entities (User, Song, Artist, Genre, Playlist, PlaylistSong, ListeningHistory)
    │   ├── dto/          Request/response records (passwords are never exposed)
    │   ├── security/     JwtService, JwtAuthenticationFilter, SecurityConfig, AuthUser
    │   └── exception/    ApiException, ApiError, ApiExceptionHandler
    └── resources/
        ├── application.properties
        ├── schema.sql
        └── data.sql
```

---

## 3. User journey ↔ API

```
Register / Login ──► GET /api/auth/me ──► onboardingCompleted ?
                                              │
                         false ───────────────┤─────────────── true
                           ▼                                    ▼
          GET  /api/recommendations/onboarding/options        HOME
          POST /api/recommendations/onboarding                  │
                           └──────────────► HOME ◄──────────────┘
HOME:  GET /api/recommendations   (Recommended For You)
       GET /api/songs/popular     (Trending Now)
       GET /api/artists/popular   (Popular Artists)
PLAY:  POST /api/recommendations/play/{songId}   → listening history
DASHBOARD: GET /api/dashboard
```

The frontend decides where to go after login with `user.onboardingCompleted` (returned by `/api/auth/register`, `/api/auth/login` and `/api/auth/me`).

---

## 4. API reference

🔒 = requires header `Authorization: Bearer <token>`. Errors always look like:
```json
{ "timestamp": "...", "status": 400, "error": "Bad Request", "message": "Validation failed",
  "path": "/api/auth/register", "fieldErrors": { "email": "Email is not valid" } }
```

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | `{username, email, password(8-72)}` → `{token, tokenType, expiresInMs, user}` (201) |
| POST | `/api/auth/login` | `{email, password}` → same response |
| GET 🔒 | `/api/auth/me` | Current user |

### Music (public, read-only)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/songs?page&size&genreId&artistId` | Paged list, most popular first |
| GET | `/api/songs/{id}` | Song details (includes `audioUrl`, `coverUrl`) |
| GET | `/api/songs/popular?limit=10` | Trending songs |
| GET | `/api/songs/new?limit=10` | Newest releases |
| GET | `/api/songs/search?q=...&page&size` | Search by title, artist or genre |
| GET | `/api/artists?q=...` | All artists / search by name |
| GET | `/api/artists/popular?limit=10` | Artists ranked by total song popularity |
| GET | `/api/artists/{id}` · `/api/artists/{id}/songs` | Artist profile and songs |
| GET | `/api/genres` | All genres |

### Personalization & recommendations 🔒
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/recommendations/onboarding/options` | Songs, artists and genres for the 3-step onboarding screen |
| POST | `/api/recommendations/onboarding` | `{favoriteSongIds(≥3), favoriteArtistIds(≥1), genreIds(≥1)}` → saves choices, sets `onboardingCompleted=true` |
| GET | `/api/recommendations?limit=10` | **Recommended For You** – songs with `score` and `reasons` |
| POST | `/api/recommendations/play/{songId}` | Saves a play in the listening history (call once when playback starts) |
| GET | `/api/me/preferences` | Saved songs / artists / genres |
| PUT | `/api/me/preferences` | Change preferences (same body as onboarding; replaces previous choices) |

### Library 🔒
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/me/likes` · `/api/me/likes/ids` | Liked songs / just their ids (for heart icons) |
| POST · DELETE | `/api/me/likes/{songId}` | Like / unlike (204) |
| GET | `/api/me/history?limit=20` | Recently played (each song once) |

### Playlists 🔒
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/playlists` | My playlists (with `songCount`) |
| POST | `/api/playlists` | `{name, description?, coverUrl?, isPublic?}` (201) |
| GET | `/api/playlists/{id}` | Detail with ordered songs. Others can open it only if `isPublic` |
| PUT · DELETE | `/api/playlists/{id}` | Update / delete (owner only) |
| POST | `/api/playlists/{id}/songs/{songId}` | Add song (409 if already inside) |
| DELETE | `/api/playlists/{id}/songs/{songId}` | Remove song |

### Dashboard 🔒
`GET /api/dashboard` → `totalPlays`, `uniqueSongs`, `listeningSeconds`, `favoriteGenre`, `topArtist`, `topGenres`, `topArtists`, `topSongs`, `playsLast7Days` (always 7 entries) and `recentlyPlayed`.

---

## 5. Recommendation engine (rule-based)

Every song the user has not already liked or just played gets a score:

| Rule | Points |
|---|---|
| Song's genre is one of the user's preferred genres | **+40** |
| Song's artist is one of the user's favorite artists | **+35** |
| Song shares a genre or artist with a song the user liked | **+15** |
| Song shares a genre or artist with the user's last 50 plays (listening history) | **+10** |

```
All songs → exclude already-liked / just-played → calculate score
          → sort by score (ties: popularity) → top N → "Recommended For You"
```
Each result includes `reasons` (for example *"Matches your favorite genre: Pop"*) so the algorithm is transparent. New users without any preference see trending songs. Scores are computed on request, so a new play changes the next recommendation immediately. The weights are constants at the top of `RecommendationService.java`.

---

## 6. Music data and licensing

- The database stores only **metadata and URLs** (`cover_url`, `audio_url`), so the source of audio can be swapped without code changes.
- The seed data uses **fictional artists** and the free **SoundHelix** demo tracks (`https://www.soundhelix.com/examples/mp3/...`) plus placeholder covers from `picsum.photos`. Those tracks are meant for testing and demos, and they are not real artists' songs. `duration_seconds` is approximate – let the frontend audio player read the real duration.
- Do **not** copy audio from Spotify or YouTube; their terms and copyright rules forbid it. For a real catalogue use royalty-free or properly licensed audio (for example Jamendo, Free Music Archive, Pixabay Music), put the files/URLs in `audio_url`, and add rows to `data.sql`.
- Because audio is served by external URLs, the React `<audio>` element can play it directly. No extra audio endpoint is needed.

---

## 7. Security notes

- Passwords are stored only as **BCrypt** hashes; DTOs never contain the password.
- JWT is stateless (no server session). Default lifetime is 24 hours (`JWT_EXPIRATION_MS`).
- `JWT_SECRET` must be at least 32 characters; the app refuses to start otherwise. **Change the default** before deploying.
- CORS allows `http://localhost:5173` (Vite) and `http://localhost:3000` (Create React App). Edit `CORS_ALLOWED_ORIGINS` for other origins.
- Playlist writes are owner-only; private playlists of other users return 404.

---

## 8. Troubleshooting

| Problem | Fix |
|---|---|
| `password authentication failed for user "postgres"` | Wrong `DB_PASSWORD`. Check `.env` and that you start the app from the project root. |
| `database "musestream" does not exist` | Create it: `createdb -U postgres musestream`. |
| `Connection refused` on 5432 | PostgreSQL is not running, or uses another port – update `DB_URL`. |
| `app.jwt.secret ... at least 32 characters` | Set a longer `JWT_SECRET`. |
| Port 8080 already in use | Set `SERVER_PORT=8081`. |
| Wrong Java version | Run `java -version` (must be 17 or newer). Set `JAVA_HOME` accordingly. |
| Want fresh data | Run `database/reset.sql`, then restart. |

---

## 9. Frontend hand-off checklist (ReactJS)

1. Store `token` from login/register; send it as `Authorization: Bearer <token>`.
2. On app start call `GET /api/auth/me`; if `onboardingCompleted` is `false` redirect to the onboarding page.
3. Onboarding page: load `/api/recommendations/onboarding/options`, collect ≥3 songs, ≥1 artist, ≥1 genre, then `POST /api/recommendations/onboarding`.
4. When a song starts playing: `POST /api/recommendations/play/{songId}`.
5. Use `/api/me/likes/ids` once to know which songs show a filled heart.
