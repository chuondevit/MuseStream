import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Mic2, Music } from 'lucide-react';
import usePageTitle from '../hooks/usePageTitle';
import useDebounce from '../hooks/useDebounce';
import useAsync from '../hooks/useAsync';
import usePaged from '../hooks/usePaged';
import * as songsApi from '../api/songs';
import * as artistsApi from '../api/artists';
import * as genresApi from '../api/genres';
import { getErrorMessage } from '../api/client';
import SongTable from '../components/music/SongTable';
import ArtistCard from '../components/music/ArtistCard';
import GenreTile from '../components/music/GenreTile';
import SectionHeader from '../components/music/SectionHeader';
import AsyncBlock from '../components/ui/AsyncBlock';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import GradientButton from '../components/ui/GradientButton';
import { GridSkeleton, RowSkeleton } from '../components/ui/Skeleton';
import cn from '../utils/cn';

const TABS = [['all', 'All'], ['songs', 'Songs'], ['artists', 'Artists']];
const PAGE_SIZE = 20;

export default function SearchPage() {
  usePageTitle('Search');
  const [params, setParams] = useSearchParams();
  const q = (params.get('q') || '').trim();
  const genreId = params.get('genreId') || undefined;

  const [text, setText] = useState(params.get('q') || '');
  const debounced = useDebounce(text, 300);
  const lastWritten = useRef(q);
  const [tab, setTab] = useState('all');

  // text -> URL (debounced)
  useEffect(() => {
    const next = debounced.trim();
    if (next === q) return;
    lastWritten.current = next;
    const p = new URLSearchParams(params);
    if (next) p.set('q', next); else p.delete('q');
    setParams(p, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  // URL -> text (back/forward navigation)
  useEffect(() => {
    if (q !== lastWritten.current) {
      lastWritten.current = q;
      setText(q);
    }
  }, [q]);

  const genres = useAsync(() => genresApi.list(), []);
  const artists = useAsync(() => (q ? artistsApi.list(q) : Promise.resolve([])), [q]);
  const songs = usePaged(
    (page) => (q
      ? songsApi.search({ q, page, size: PAGE_SIZE })
      : songsApi.list({ page, size: PAGE_SIZE, genreId })),
    [q, genreId]
  );

  const setGenre = (id) => {
    const p = new URLSearchParams(params);
    if (id) p.set('genreId', id); else p.delete('genreId');
    setParams(p, { replace: true });
  };

  const showSongs = tab !== 'artists';
  const showArtists = q && tab !== 'songs';
  const songList = (
    <>
      {songs.error && songs.items.length === 0 ? (
        <ErrorState message={getErrorMessage(songs.error)} onRetry={songs.reload} />
      ) : songs.loading && songs.items.length === 0 ? (
        <RowSkeleton count={8} />
      ) : songs.items.length === 0 ? (
        <EmptyState icon={Music} title={q ? `No songs found for “${q}”` : 'No songs here yet'} text="Try a different title, artist or genre." />
      ) : (
        <div className="glass p-2 sm:p-3">
          <SongTable songs={songs.items} />
        </div>
      )}
      {!songs.last && songs.items.length > 0 && (
        <div className="flex justify-center mt-4">
          <GradientButton variant="glass" loading={songs.loading} onClick={songs.loadMore}>Load more</GradientButton>
        </div>
      )}
    </>
  );

  return (
    <div className="page space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">Search</h1>
        <div className="relative">
          <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-muted" aria-hidden="true" />
          <input
            data-search-input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What do you want to listen to?"
            aria-label="Search songs, artists or genres"
            autoFocus={!q}
            className="w-full min-h-[56px] pl-14 pr-5 rounded-full bg-white/5 border border-white/10 text-base outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/40"
          />
        </div>
      </div>

      {q ? (
        <>
          <div role="tablist" aria-label="Result type" className="flex gap-2">
            {TABS.map(([id, label]) => (
              <button
                key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
                className={cn('px-4 min-h-[44px] rounded-full text-sm font-semibold transition', tab === id ? 'bg-brand text-white shadow-glow' : 'bg-white/5 text-ink-muted hover:text-ink')}
              >
                {label}
              </button>
            ))}
          </div>

          {showArtists && (
            <section>
              <SectionHeader title="Artists" />
              <AsyncBlock state={artists} skeleton={<GridSkeleton count={6} className="aspect-square rounded-2xl" />} empty={<EmptyState icon={Mic2} title={`No artists found for “${q}”`} />}>
                {(list) => (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                    {(tab === 'all' ? list.slice(0, 6) : list).map((a) => <ArtistCard key={a.id} artist={a} className="w-full" />)}
                  </div>
                )}
              </AsyncBlock>
            </section>
          )}
          {showSongs && (
            <section>
              <SectionHeader title="Songs" subtitle={songs.total ? `${songs.total} result${songs.total > 1 ? 's' : ''}` : undefined} />
              {songList}
            </section>
          )}
        </>
      ) : (
        <>
          <section>
            <SectionHeader title="Browse genres" />
            <AsyncBlock state={genres} skeleton={<GridSkeleton count={8} className="h-24" />} empty={<EmptyState title="No genres available" />}>
              {(list) => (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {list.map((g) => <GenreTile key={g.id} genre={g} to={`/search?genreId=${g.id}`} />)}
                  </div>
                </>
              )}
            </AsyncBlock>
          </section>
          <section>
            <SectionHeader title="Browse all songs" />
            <AsyncBlock state={genres} skeleton={null}>
              {(list) => (
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-2" role="group" aria-label="Filter by genre">
                  <button onClick={() => setGenre(null)} aria-pressed={!genreId} className={cn('shrink-0 px-4 min-h-[44px] rounded-full text-sm font-semibold transition', !genreId ? 'bg-brand text-white' : 'bg-white/5 text-ink-muted hover:text-ink')}>All</button>
                  {list.map((g) => (
                    <button key={g.id} onClick={() => setGenre(String(g.id))} aria-pressed={String(g.id) === genreId} className={cn('shrink-0 px-4 min-h-[44px] rounded-full text-sm font-semibold transition', String(g.id) === genreId ? 'bg-brand text-white' : 'bg-white/5 text-ink-muted hover:text-ink')}>{g.name}</button>
                  ))}
                </div>
              )}
            </AsyncBlock>
            {songList}
          </section>
        </>
      )}
    </div>
  );
}
