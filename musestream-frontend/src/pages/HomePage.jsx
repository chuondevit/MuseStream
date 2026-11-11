import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useAsync from '../hooks/useAsync';
import usePageTitle from '../hooks/usePageTitle';
import * as recApi from '../api/recommendations';
import * as songsApi from '../api/songs';
import * as artistsApi from '../api/artists';
import * as genresApi from '../api/genres';
import * as meApi from '../api/me';
import { greeting } from '../utils/format';
import AsyncBlock from '../components/ui/AsyncBlock';
import EmptyState from '../components/ui/EmptyState';
import Confetti from '../components/ui/Confetti';
import { AvatarRowSkeleton, RowSkeleton, Skeleton, SongCardSkeleton, GridSkeleton } from '../components/ui/Skeleton';
import SectionHeader from '../components/music/SectionHeader';
import HorizontalScroller from '../components/music/HorizontalScroller';
import SongCard from '../components/music/SongCard';
import SongRow from '../components/music/SongRow';
import ArtistCard from '../components/music/ArtistCard';
import GenreTile from '../components/music/GenreTile';
import HeroBanner from '../components/music/HeroBanner';

export default function HomePage() {
  usePageTitle('Home');
  const { user } = useAuth();
  const location = useLocation();
  const celebrate = !!location.state?.celebrate;

  useEffect(() => {
    if (celebrate) toast.success('Your personalized feed is ready', { icon: '🎉' });
  }, [celebrate]);

  // Fetched on every mount => recommendations refresh when the user returns to /home
  const recs = useAsync(() => recApi.list(12), []);
  const trending = useAsync(() => songsApi.popular(10), []);
  const fresh = useAsync(() => songsApi.newest(10), []);
  const artists = useAsync(() => artistsApi.popular(10), []);
  const genres = useAsync(() => genresApi.list(), []);
  const history = useAsync(() => meApi.history(10), []);

  return (
    <div className="page space-y-10">
      {celebrate && <Confetti />}
      <header>
        <h1 className="text-3xl sm:text-5xl font-extrabold">{greeting()}, {user?.username}</h1>
        <p className="text-ink-muted mt-2">Your Music. Your Vibe.</p>
      </header>

      <AsyncBlock
        state={recs}
        skeleton={<Skeleton className="h-72 rounded-3xl" />}
        empty={<EmptyState icon={Sparkles} title="No recommendations yet" text="Play a few songs or update your preferences to get picks made for you." />}
      >
        {(data) => {
          const queue = data.map((r) => r.song);
          return (
            <>
              <HeroBanner rec={data[0]} queue={queue} />
              <section aria-labelledby="rec-h">
                <SectionHeader title="Recommended for you" subtitle="Hover a match badge to see why we picked it" />
                <h2 id="rec-h" className="sr-only">Recommended for you</h2>
                <HorizontalScroller label="Recommended songs">
                  {data.map((r) => (
                    <SongCard key={r.song.id} song={r.song} queue={queue} badge={`${Math.min(100, r.score)}% match`} reasons={r.reasons} />
                  ))}
                </HorizontalScroller>
              </section>
            </>
          );
        }}
      </AsyncBlock>

      <section>
        <SectionHeader title="Trending now" />
        <AsyncBlock state={trending} skeleton={<RowSkeleton count={5} />} empty={<EmptyState title="Nothing trending yet" text="Check back soon." />}>
          {(songs) => (
            <div className="glass p-2 sm:p-3">
              {songs.map((s, i) => <SongRow key={s.id} song={s} index={i + 1} queue={songs} />)}
            </div>
          )}
        </AsyncBlock>
      </section>

      <section>
        <SectionHeader title="New releases" />
        <AsyncBlock state={fresh} skeleton={<SongCardSkeleton />} empty={<EmptyState title="No new releases" />}>
          {(songs) => (
            <HorizontalScroller label="New releases">
              {songs.map((s) => <SongCard key={s.id} song={s} queue={songs} />)}
            </HorizontalScroller>
          )}
        </AsyncBlock>
      </section>

      <section>
        <SectionHeader title="Popular artists" />
        <AsyncBlock state={artists} skeleton={<AvatarRowSkeleton />} empty={<EmptyState title="No artists yet" />}>
          {(list) => (
            <HorizontalScroller label="Popular artists">
              {list.map((a) => <ArtistCard key={a.id} artist={a} />)}
            </HorizontalScroller>
          )}
        </AsyncBlock>
      </section>

      <section>
        <SectionHeader title="Browse by genre" />
        <AsyncBlock state={genres} skeleton={<GridSkeleton count={8} className="h-24" />} empty={<EmptyState title="No genres available" />}>
          {(list) => (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {list.map((g) => <GenreTile key={g.id} genre={g} to={`/search?genreId=${g.id}`} />)}
            </div>
          )}
        </AsyncBlock>
      </section>

      <AsyncBlock state={history} skeleton={null}>
        {(items) => {
          const songs = items.map((h) => h.song).filter(Boolean);
          if (!songs.length) return null;
          return (
            <section>
              <SectionHeader title="Recently played" to="/library?tab=recent" />
              <HorizontalScroller label="Recently played">
                {songs.map((s) => <SongCard key={s.id} song={s} queue={songs} />)}
              </HorizontalScroller>
            </section>
          );
        }}
      </AsyncBlock>
    </div>
  );
}
