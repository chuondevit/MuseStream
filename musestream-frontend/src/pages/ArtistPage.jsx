import { useParams } from 'react-router-dom';
import { Play, Music } from 'lucide-react';
import useAsync from '../hooks/useAsync';
import usePageTitle from '../hooks/usePageTitle';
import * as artistsApi from '../api/artists';
import { getErrorMessage } from '../api/client';
import { usePlayer } from '../context/PlayerContext';
import Avatar from '../components/ui/Avatar';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import GradientButton from '../components/ui/GradientButton';
import { RowSkeleton, Skeleton } from '../components/ui/Skeleton';
import SongTable from '../components/music/SongTable';
import SectionHeader from '../components/music/SectionHeader';
import NotFoundPage from './NotFoundPage';

export default function ArtistPage() {
  const { id } = useParams();
  const { playQueue } = usePlayer();
  const artist = useAsync(() => artistsApi.get(id), [id]);
  const songs = useAsync(() => artistsApi.songs(id), [id]);
  usePageTitle(artist.data?.name || 'Artist');

  if (artist.error?.response?.status === 404) return <NotFoundPage inline title="Artist not found" text="We couldn't find this artist." />;
  if (artist.error && !artist.data) return <div className="page"><ErrorState message={getErrorMessage(artist.error)} onRetry={artist.reload} /></div>;
  if (!artist.data) return <div className="page space-y-4"><Skeleton className="h-64 rounded-3xl" /><RowSkeleton count={5} /></div>;

  const a = artist.data;
  const list = songs.data || [];

  return (
    <div>
      <section className="relative overflow-hidden">
        {a.imageUrl && <img src={a.imageUrl} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-30 blur-3xl scale-125" />}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-base" />
        <div className="page relative flex flex-col sm:flex-row sm:items-end gap-6 pt-10 sm:pt-16">
          <Avatar src={a.imageUrl} name={a.name} className="w-40 h-40 sm:w-52 sm:h-52 shadow-glow-lg" textClass="text-5xl" />
          <div className="min-w-0">
            <p className="text-sm text-primary-400 font-semibold">Artist</p>
            <h1 className="text-4xl sm:text-6xl font-extrabold">{a.name}</h1>
            {a.biography && <p className="text-ink-muted mt-3 max-w-2xl line-clamp-4">{a.biography}</p>}
          </div>
        </div>
      </section>
      <div className="page space-y-6 pt-0">
        <GradientButton icon={Play} disabled={list.length === 0} onClick={() => playQueue(list, 0)}>Play</GradientButton>
        <section>
          <SectionHeader title="Popular songs" />
          {songs.error && !songs.data ? (
            <ErrorState message={getErrorMessage(songs.error)} onRetry={songs.reload} />
          ) : songs.loading && !songs.data ? (
            <RowSkeleton count={5} />
          ) : list.length === 0 ? (
            <EmptyState icon={Music} title="No songs yet" text="This artist has no songs in the catalogue." />
          ) : (
            <div className="glass p-2 sm:p-3"><SongTable songs={list} /></div>
          )}
        </section>
      </div>
    </div>
  );
}
