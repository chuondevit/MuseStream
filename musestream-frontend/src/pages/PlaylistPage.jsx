import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Globe, ListMusic, Lock, Pencil, Play, Trash2 } from 'lucide-react';
import useAsync from '../hooks/useAsync';
import usePageTitle from '../hooks/usePageTitle';
import * as playlistsApi from '../api/playlists';
import { getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import { usePlaylists } from '../context/PlaylistsContext';
import { formatListening, totalDuration } from '../utils/format';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import GradientButton from '../components/ui/GradientButton';
import { RowSkeleton, Skeleton } from '../components/ui/Skeleton';
import PlaylistCover from '../components/music/PlaylistCover';
import PlaylistModal from '../components/music/PlaylistModal';
import SongTable from '../components/music/SongTable';
import NotFoundPage from './NotFoundPage';

export default function PlaylistPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { playQueue } = usePlayer();
  const { refresh } = usePlaylists();
  const state = useAsync(() => playlistsApi.get(id), [id]);
  const { data: playlist, loading, error, reload, setData } = state;
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  usePageTitle(playlist?.name || 'Playlist');

  if (error && error.response?.status === 404) {
    return <NotFoundPage inline title="Playlist not found" text="This playlist doesn't exist or you don't have access to it." />;
  }
  if (error && !playlist) return <div className="page"><ErrorState message={getErrorMessage(error)} onRetry={reload} /></div>;
  if (loading && !playlist) {
    return (
      <div className="page space-y-6">
        <div className="flex gap-6"><Skeleton className="w-44 h-44" /><div className="flex-1 space-y-3"><Skeleton className="h-10 w-1/2" /><Skeleton className="h-4 w-1/3" /></div></div>
        <RowSkeleton count={5} />
      </div>
    );
  }
  if (!playlist) return null;

  const songs = playlist.songs || [];

  const removeSong = async (song) => {
    const before = playlist;
    // optimistic removal
    setData((p) => ({ ...p, songs: p.songs.filter((s) => s.id !== song.id), songCount: Math.max(0, (p.songCount || 1) - 1) }));
    try {
      await playlistsApi.removeSong(playlist.id, song.id);
      refresh();
    } catch (e) {
      setData(before);
      toast.error(getErrorMessage(e));
    }
  };

  const del = async () => {
    setDeleting(true);
    try {
      await playlistsApi.remove(playlist.id);
      toast.success('Playlist deleted');
      refresh();
      navigate('/library?tab=playlists', { replace: true });
    } catch (e) {
      toast.error(getErrorMessage(e));
      setDeleting(false);
      setConfirming(false);
    }
  };

  return (
    <div className="page space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-end gap-6">
        <div className="w-44 sm:w-56 shrink-0 shadow-glow-lg rounded-2xl"><PlaylistCover playlist={playlist} songs={songs} rounded="rounded-2xl" /></div>
        <div className="min-w-0">
          <p className="text-sm text-ink-muted">Playlist</p>
          <h1 className="text-3xl sm:text-5xl font-extrabold break-words">{playlist.name}</h1>
          {playlist.description && <p className="text-ink-muted mt-2 max-w-xl">{playlist.description}</p>}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-ink-muted mt-3">
            <span className="px-2.5 py-1 rounded-full bg-white/10 text-ink">{user?.username}</span>
            <span className="inline-flex items-center gap-1">{playlist.isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}{playlist.isPublic ? 'Public' : 'Private'}</span>
            <span>{songs.length} songs · {formatListening(totalDuration(songs))}</span>
          </div>
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        <GradientButton icon={Play} disabled={songs.length === 0} onClick={() => playQueue(songs, 0)}>Play</GradientButton>
        <GradientButton variant="glass" icon={Pencil} onClick={() => setEditing(true)}>Edit</GradientButton>
        <GradientButton variant="danger" icon={Trash2} onClick={() => setConfirming(true)}>Delete</GradientButton>
      </div>

      {songs.length === 0 ? (
        <EmptyState icon={ListMusic} title="This playlist is empty" text="Use the ⋯ menu on any song and choose “Add to playlist”." action={<GradientButton to="/search">Find songs</GradientButton>} />
      ) : (
        <div className="glass p-2 sm:p-3"><SongTable songs={songs} onRemove={removeSong} /></div>
      )}

      <PlaylistModal open={editing} onClose={() => setEditing(false)} playlist={playlist} onSaved={(saved) => setData((p) => ({ ...p, ...saved, songs: saved.songs ?? p.songs }))} />
      <ConfirmDialog
        open={confirming} onClose={() => setConfirming(false)} loading={deleting} onConfirm={del}
        title="Delete playlist?" message={`“${playlist.name}” will be permanently deleted. Your songs stay in the catalogue.`} confirmLabel="Delete"
      />
    </div>
  );
}
