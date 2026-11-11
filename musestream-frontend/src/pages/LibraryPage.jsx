import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Clock, Heart, ListMusic, Play, Plus } from 'lucide-react';
import usePageTitle from '../hooks/usePageTitle';
import useAsync from '../hooks/useAsync';
import * as meApi from '../api/me';
import { useLikes } from '../context/LikesContext';
import { usePlayer } from '../context/PlayerContext';
import { usePlaylists } from '../context/PlaylistsContext';
import { formatListening, timeAgo, totalDuration } from '../utils/format';
import AsyncBlock from '../components/ui/AsyncBlock';
import EmptyState from '../components/ui/EmptyState';
import GradientButton from '../components/ui/GradientButton';
import { RowSkeleton } from '../components/ui/Skeleton';
import SongTable from '../components/music/SongTable';
import PlaylistCard from '../components/music/PlaylistCard';
import PlaylistModal from '../components/music/PlaylistModal';
import cn from '../utils/cn';

const TABS = [['liked', 'Liked Songs', Heart], ['playlists', 'Playlists', ListMusic], ['recent', 'Recently Played', Clock]];

function LikedTab() {
  const likes = useAsync(() => meApi.likes(), []);
  const { ids } = useLikes();
  const { playQueue } = usePlayer();
  // Unliking removes the row immediately (ids is optimistic)
  const songs = useMemo(() => (likes.data || []).filter((s) => ids.has(s.id)), [likes.data, ids]);

  return (
    <AsyncBlock
      state={likes}
      skeleton={<RowSkeleton count={6} />}
      isEmpty={() => songs.length === 0}
      empty={<EmptyState icon={Heart} title="No liked songs yet" text="Tap the heart on any song to save it here." action={<GradientButton to="/home">Discover music</GradientButton>} />}
    >
      {() => (
        <>
          <div className="flex flex-col sm:flex-row sm:items-end gap-5 mb-6">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl bg-brand shadow-glow-lg flex items-center justify-center shrink-0"><Heart className="w-16 h-16 text-white fill-white" /></div>
            <div>
              <p className="text-sm text-ink-muted">Playlist</p>
              <h2 className="text-3xl sm:text-5xl font-extrabold">Liked Songs</h2>
              <p className="text-sm text-ink-muted mt-2">{songs.length} songs · {formatListening(totalDuration(songs))}</p>
            </div>
          </div>
          <GradientButton icon={Play} onClick={() => playQueue(songs, 0)} className="mb-4">Play all</GradientButton>
          <div className="glass p-2 sm:p-3"><SongTable songs={songs} /></div>
        </>
      )}
    </AsyncBlock>
  );
}

function PlaylistsTab() {
  const { playlists, loading } = usePlaylists();
  const [creating, setCreating] = useState(false);
  if (loading && playlists.length === 0) return <RowSkeleton count={4} />;
  return (
    <>
      {playlists.length === 0 && (
        <EmptyState icon={ListMusic} title="Create your first playlist" text="Group your favorite songs into playlists." action={<GradientButton icon={Plus} onClick={() => setCreating(true)}>New playlist</GradientButton>} />
      )}
      {playlists.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <button onClick={() => setCreating(true)} className="glass min-h-[200px] flex flex-col items-center justify-center gap-2 text-ink-muted hover:text-ink hover:bg-white/10 transition border-dashed">
            <Plus className="w-8 h-8" /> <span className="text-sm font-semibold">New playlist</span>
          </button>
          {playlists.map((p) => <PlaylistCard key={p.id} playlist={p} />)}
        </div>
      )}
      <PlaylistModal open={creating} onClose={() => setCreating(false)} />
    </>
  );
}

function RecentTab() {
  const history = useAsync(() => meApi.history(30), []);
  return (
    <AsyncBlock
      state={history}
      skeleton={<RowSkeleton count={8} />}
      empty={<EmptyState icon={Clock} title="Nothing played yet" text="Songs you play will show up here." action={<GradientButton to="/home">Start listening</GradientButton>} />}
    >
      {(items) => {
        const songs = items.map((h) => h.song).filter(Boolean);
        const when = new Map(items.map((h) => [h.song?.id, h.playedAt]));
        return <div className="glass p-2 sm:p-3"><SongTable songs={songs} getMeta={(s) => timeAgo(when.get(s.id))} /></div>;
      }}
    </AsyncBlock>
  );
}

export default function LibraryPage() {
  usePageTitle('Library');
  const [params, setParams] = useSearchParams();
  const tab = TABS.some(([id]) => id === params.get('tab')) ? params.get('tab') : 'liked';

  return (
    <div className="page space-y-6">
      <h1 className="text-3xl sm:text-4xl font-extrabold">Your library</h1>
      <div role="tablist" aria-label="Library sections" className="flex gap-2 overflow-x-auto no-scrollbar">
        {TABS.map(([id, label, Icon]) => (
          <button
            key={id} role="tab" aria-selected={tab === id} onClick={() => setParams({ tab: id }, { replace: true })}
            className={cn('shrink-0 inline-flex items-center gap-2 px-4 min-h-[44px] rounded-full text-sm font-semibold transition', tab === id ? 'bg-brand text-white shadow-glow' : 'bg-white/5 text-ink-muted hover:text-ink')}
          >
            <Icon className="w-4 h-4" aria-hidden="true" /> {label}
          </button>
        ))}
      </div>
      {tab === 'liked' && <LikedTab />}
      {tab === 'playlists' && <PlaylistsTab />}
      {tab === 'recent' && <RecentTab />}
    </div>
  );
}
