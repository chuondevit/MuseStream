import { Link } from 'react-router-dom';
import { BarChart3, Clock, Disc3, Headphones, Music4, Pencil, Play } from 'lucide-react';
import useAsync from '../hooks/useAsync';
import usePageTitle from '../hooks/usePageTitle';
import * as dashApi from '../api/dashboard';
import * as meApi from '../api/me';
import { getErrorMessage } from '../api/client';
import { usePlayer } from '../context/PlayerContext';
import { formatListening } from '../utils/format';
import StatCard from '../components/ui/StatCard';
import Avatar from '../components/ui/Avatar';
import Cover from '../components/ui/Cover';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import GradientButton from '../components/ui/GradientButton';
import { Skeleton } from '../components/ui/Skeleton';
import HorizontalScroller from '../components/music/HorizontalScroller';
import SongCard from '../components/music/SongCard';
import PlaysAreaChart from '../components/dashboard/PlaysAreaChart';
import GenreDonut from '../components/dashboard/GenreDonut';
import TopArtistsList from '../components/dashboard/TopArtistsList';

function Card({ title, children, className = '' }) {
  return (
    <section className={`glass p-5 sm:p-6 ${className}`}>
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      {children}
    </section>
  );
}

function TasteProfile() {
  const prefs = useAsync(() => meApi.preferences(), []);
  const p = prefs.data;
  return (
    <Card title="Your taste profile">
      {prefs.error && !p ? (
        <ErrorState message={getErrorMessage(prefs.error)} onRetry={prefs.reload} />
      ) : !p ? (
        <Skeleton className="h-28" />
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-xs text-ink-muted mb-2">Favorite artists</p>
            <div className="flex flex-wrap gap-3">
              {(p.favoriteArtists || []).length === 0 && <span className="text-sm text-ink-muted">None selected</span>}
              {(p.favoriteArtists || []).map((a) => (
                <Link key={a.id} to={`/artists/${a.id}`} title={a.name} className="flex items-center gap-2 pr-3 rounded-full bg-white/5 hover:bg-white/10 transition">
                  <Avatar src={a.imageUrl} name={a.name} className="w-9 h-9" /> <span className="text-sm">{a.name}</span>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-ink-muted mb-2">Genres</p>
            <div className="flex flex-wrap gap-2">
              {(p.genres || []).map((g) => <span key={g.id} className="text-xs px-3 py-1.5 rounded-full bg-primary-500/15 text-primary-400">{g.name}</span>)}
            </div>
          </div>
          <GradientButton to="/profile" variant="glass" icon={Pencil}>Edit preferences</GradientButton>
        </div>
      )}
    </Card>
  );
}

export default function DashboardPage() {
  usePageTitle('Dashboard');
  const { playSong } = usePlayer();
  const dash = useAsync(() => dashApi.get(), []);
  const d = dash.data;

  if (dash.error && !d) return <div className="page"><ErrorState message={getErrorMessage(dash.error)} onRetry={dash.reload} /></div>;

  return (
    <div className="page space-y-6">
      <header>
        <h1 className="text-3xl sm:text-4xl font-extrabold">Your listening dashboard</h1>
        <p className="text-ink-muted mt-1">A look at what you&apos;ve been playing on MuseStream.</p>
      </header>

      {!d ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-32" />)}</div>
          <Skeleton className="h-80" />
          <div className="grid lg:grid-cols-2 gap-6"><Skeleton className="h-72" /><Skeleton className="h-72" /></div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Headphones} label="Total plays" value={d.totalPlays || 0} />
            <StatCard icon={Clock} label="Listening time" value={d.listeningSeconds || 0} format={formatListening} title="Estimated from song durations" hint="Estimated from song durations" />
            <StatCard icon={Disc3} label="Unique songs" value={d.uniqueSongs || 0} />
            <StatCard icon={Music4} label="Favorite genre" value={d.favoriteGenre?.name || '—'} hint={d.favoriteGenre ? `${d.favoriteGenre.plays} plays` : 'Not enough data yet'} />
          </div>

          {(d.totalPlays || 0) === 0 && (
            <EmptyState icon={BarChart3} title="Play a few songs to unlock your stats" text="Your top genres, artists and weekly activity will appear here." action={<GradientButton to="/home" icon={Play}>Play your first song</GradientButton>} />
          )}

          <Card title="Plays in the last 7 days"><PlaysAreaChart data={d.playsLast7Days || []} /></Card>

          {(d.totalPlays || 0) > 0 && (
            <>
              <div className="grid lg:grid-cols-2 gap-6">
                <Card title="Top genres">
                  {(d.topGenres || []).length ? <GenreDonut data={d.topGenres} /> : <p className="text-sm text-ink-muted">No genre data yet.</p>}
                </Card>
                <Card title="Top artists">
                  {(d.topArtists || []).length ? <TopArtistsList artists={d.topArtists} /> : <p className="text-sm text-ink-muted">No artist data yet.</p>}
                </Card>
              </div>

              <Card title="Top songs">
                <ol className="space-y-2">
                  {(d.topSongs || []).slice(0, 5).map(({ song, plays }, i) => (
                    <li key={song.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5">
                      <span className="w-5 text-sm text-ink-muted tabular-nums">{i + 1}</span>
                      <Cover src={song.coverUrl} alt="" className="w-11 h-11 shrink-0" rounded="rounded-lg" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold truncate">{song.title}</p>
                        <p className="text-xs text-ink-muted truncate">{song.artistName}</p>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-primary-500/15 text-primary-400 tabular-nums">{plays} plays</span>
                      <button onClick={() => playSong(song, d.topSongs.map((t) => t.song))} aria-label={`Play ${song.title}`} className="w-11 h-11 rounded-full bg-brand flex items-center justify-center text-white shadow-glow">
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      </button>
                    </li>
                  ))}
                </ol>
              </Card>

              {(d.recentlyPlayed || []).length > 0 && (
                <Card title="Recently played">
                  <HorizontalScroller label="Recently played">
                    {d.recentlyPlayed.map((s) => <SongCard key={s.id} song={s} queue={d.recentlyPlayed} className="w-36" />)}
                  </HorizontalScroller>
                </Card>
              )}
            </>
          )}

          <TasteProfile />
        </>
      )}
    </div>
  );
}
