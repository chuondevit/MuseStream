# MuseStream – Frontend

ReactJS frontend for **MuseStream**, a music streaming platform with personalized recommendations (graduation project).

## Stack
Vite + React 18 · React Router v6 · Axios · Tailwind CSS v3 · Framer Motion · Recharts · lucide-react · react-hot-toast.
State = React Context only (`AuthContext`, `PlayerContext`, `LikesContext`, `PlaylistsContext`).

## Run
```bash
npm install
cp .env.example .env     # VITE_API_URL=http://localhost:8080
npm run dev              # http://localhost:5173  (backend CORS allows 5173 and 3000)
```
The backend must already be running at `VITE_API_URL`. Production build: `npm run build`.

## Folder map
```
src/api          Axios client (+interceptors) and one module per domain
src/context      Auth, Player (audio + Media Session + shortcuts), Likes, Playlists
src/components   layout / music / ui / dashboard / onboarding
src/pages        Landing, Login, Register, Onboarding, Home, Search, Library, Playlist, Artist, Dashboard, Profile, 404
```

## Notes
- Token is stored in `localStorage` as `musestream_token`; a 401 anywhere (except login/register) logs out with "Session expired".
- Play history (`POST /api/recommendations/play/{id}`) is sent once per track start; **not** during onboarding previews.
- Keyboard: `Space` play/pause · `←/→` seek ±5 s · `Shift+←/→` prev/next · `M` mute · `/` or `Ctrl/⌘+K` search.
- Song duration shown is the real `<audio>` duration once metadata loads (API value is approximate).
- `usePlayerTime()` exposes `currentTime` separately from `usePlayer()` so only progress UI re-renders on every tick.

## Screenshot checklist (thesis demo)
1. Landing hero · 2. Register (strength meter) · 3. Onboarding steps 2–4 + "Building your taste profile…" · 4. Home (Made for you + match badge tooltip)
5. Search with `?q=` · 6. Player bar + queue panel · 7. Library (liked / playlists) · 8. Playlist detail + Add-to-playlist menu
9. Artist page · 10. Dashboard (KPIs, 7-day chart, donut) · 11. Dashboard empty state (new user) · 12. Profile preferences editor · 13. Mobile: tab bar + mini player + Now Playing sheet

## Acceptance test
See section 11 of the brief; run all 12 checks against the live backend before the demo.
