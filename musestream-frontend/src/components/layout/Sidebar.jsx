import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { BarChart3, Home, Library, Plus, Search, User } from 'lucide-react';
import Logo from '../ui/Logo';
import PlaylistCover from '../music/PlaylistCover';
import PlaylistModal from '../music/PlaylistModal';
import { usePlaylists } from '../../context/PlaylistsContext';
import cn from '../../utils/cn';

export const NAV = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/library', label: 'Library', icon: Library },
  { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function Sidebar() {
  const { playlists } = usePlaylists();
  const [creating, setCreating] = useState(false);

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-surface/80 border-r border-soft h-full" aria-label="Sidebar">
      <div className="p-5"><Logo to="/home" /></div>
      <nav className="px-3 space-y-1" aria-label="Main">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to !== '/library'}
            className={({ isActive }) =>
              cn('flex items-center gap-3 px-3 min-h-[44px] rounded-xl text-sm font-medium transition',
                isActive ? 'bg-primary-500/15 text-primary-400' : 'text-ink-muted hover:text-ink hover:bg-white/5')
            }
          >
            <Icon className="w-5 h-5" aria-hidden="true" /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-6 px-5 flex items-center justify-between">
        <h2 className="text-xs font-semibold text-ink-muted tracking-normal font-sans">Playlists</h2>
        <button onClick={() => setCreating(true)} aria-label="Create playlist" className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 text-ink-muted hover:text-ink">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pt-1 pb-[104px] space-y-0.5">
        {playlists.length === 0 && <p className="px-3 py-2 text-xs text-ink-muted">Create your first playlist with +</p>}
        {playlists.map((pl) => (
          <Link key={pl.id} to={`/library/playlists/${pl.id}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 min-h-[44px]">
            <div className="w-9 h-9 shrink-0"><PlaylistCover playlist={pl} rounded="rounded-md" className="text-base" /></div>
            <span className="text-sm truncate">{pl.name}</span>
          </Link>
        ))}
      </div>
      <PlaylistModal open={creating} onClose={() => setCreating(false)} />
    </aside>
  );
}
