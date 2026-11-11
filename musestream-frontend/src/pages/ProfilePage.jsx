import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AlertTriangle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useAsync from '../hooks/useAsync';
import usePageTitle from '../hooks/usePageTitle';
import * as recApi from '../api/recommendations';
import * as meApi from '../api/me';
import { getErrorMessage } from '../api/client';
import Avatar from '../components/ui/Avatar';
import ErrorState from '../components/ui/ErrorState';
import GradientButton from '../components/ui/GradientButton';
import { GridSkeleton } from '../components/ui/Skeleton';
import { ArtistPicker, GenrePicker, SongPicker, toggleId } from '../components/onboarding/Pickers';
import { useLikes } from '../context/LikesContext';

const MIN_SONGS = 3;

function Section({ title, hint, count, min, children }) {
  return (
    <section className="glass p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          {hint && <p className="text-xs text-ink-muted mt-0.5">{hint}</p>}
        </div>
        <span className={`text-sm tabular-nums ${count < min ? 'text-danger' : 'text-ink-muted'}`}>Selected {count} / min {min}</span>
      </div>
      {children}
    </section>
  );
}

export default function ProfilePage() {
  usePageTitle('Profile');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { ids } = useLikes();
  const options = useAsync(() => recApi.onboardingOptions(), []);
  const prefs = useAsync(() => meApi.preferences(), []);
  const [songIds, setSongIds] = useState([]);
  const [artistIds, setArtistIds] = useState([]);
  const [genreIds, setGenreIds] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const p = prefs.data;
    if (!p) return;
    setSongIds((p.favoriteSongs || []).map((s) => s.id));
    setArtistIds((p.favoriteArtists || []).map((a) => a.id));
    setGenreIds((p.genres || []).map((g) => g.id));
  }, [prefs.data]);

  const valid = songIds.length >= MIN_SONGS && artistIds.length >= 1 && genreIds.length >= 1;
  const loadError = options.error || prefs.error;
  const ready = options.data && prefs.data;

  const save = async () => {
    if (!valid || saving) return;
    setSaving(true);
    try {
      const saved = await meApi.updatePreferences({ favoriteSongIds: songIds, favoriteArtistIds: artistIds, genreIds });
      prefs.setData(saved);
      toast.success('Preferences saved');
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const doLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const since = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';

  return (
    <div className="page space-y-6">
      <h1 className="text-3xl sm:text-4xl font-extrabold">Profile &amp; settings</h1>

      <section className="glass p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-5">
        <Avatar name={user?.username} className="w-20 h-20" textClass="text-3xl" />
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold truncate">{user?.username}</h2>
          <p className="text-ink-muted truncate">{user?.email}</p>
          <p className="text-xs text-ink-muted mt-1">Member since {since}</p>
        </div>
        <GradientButton variant="danger" icon={LogOut} onClick={doLogout}>Log out</GradientButton>
      </section>

      <div role="note" className="flex gap-3 p-4 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 text-sm">
        <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" aria-hidden="true" />
        <p>Favorite songs are the same as your Liked Songs. Saving replaces your current liked songs ({ids.size} right now) with the selection below.</p>
      </div>

      {loadError && !ready ? (
        <ErrorState message={getErrorMessage(loadError)} onRetry={() => { options.reload(); prefs.reload(); }} />
      ) : !ready ? (
        <GridSkeleton count={8} />
      ) : (
        <>
          <Section title="Favorite songs" count={songIds.length} min={MIN_SONGS}>
            <SongPicker songs={options.data.songs} selected={songIds} onToggle={(id) => setSongIds((l) => toggleId(l, id))} />
          </Section>
          <Section title="Favorite artists" count={artistIds.length} min={1}>
            <ArtistPicker artists={options.data.artists} selected={artistIds} onToggle={(id) => setArtistIds((l) => toggleId(l, id))} />
          </Section>
          <Section title="Genres" count={genreIds.length} min={1}>
            <GenrePicker genres={options.data.genres} selected={genreIds} onToggle={(id) => setGenreIds((l) => toggleId(l, id))} />
          </Section>
          <div className="flex justify-end">
            <GradientButton onClick={save} loading={saving} disabled={!valid}>Save preferences</GradientButton>
          </div>
        </>
      )}
    </div>
  );
}
