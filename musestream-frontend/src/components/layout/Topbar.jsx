import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Search, User } from 'lucide-react';
import Avatar from '../ui/Avatar';
import Logo from '../ui/Logo';
import Dropdown, { MenuItem } from '../ui/Dropdown';
import { useAuth } from '../../context/AuthContext';

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [q, setQ] = useState('');
  const onSearchPage = pathname === '/search';

  const submit = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
    setQ('');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 px-4 sm:px-6 lg:px-8 h-16 bg-base/70 backdrop-blur-xl border-b border-soft">
      <Logo to="/home" className="lg:hidden text-lg" />
      <div className="flex-1 flex">
        {!onSearchPage && (
          <form onSubmit={submit} role="search" className="relative w-full max-w-md hidden sm:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" aria-hidden="true" />
            <input
              data-search-input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search songs, artists, genres…"
              aria-label="Search"
              className="w-full min-h-[44px] pl-10 pr-14 rounded-full bg-white/5 border border-white/10 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/40"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-ink-muted border border-white/10 rounded px-1.5 py-0.5">⌘K</kbd>
          </form>
        )}
      </div>
      {!onSearchPage && (
        <Link to="/search" aria-label="Search" className="sm:hidden w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/10"><Search className="w-5 h-5" /></Link>
      )}
      <Dropdown
        trigger={(p) => (
          <button {...p} aria-label="User menu" className="rounded-full focus-visible:ring-2 ring-primary-400">
            <Avatar name={user?.username} className="w-10 h-10" />
          </button>
        )}
      >
        {({ close }) => (
          <>
            <div className="px-3 py-2 border-b border-soft mb-1">
              <p className="text-sm font-semibold truncate">{user?.username}</p>
              <p className="text-xs text-ink-muted truncate">{user?.email}</p>
            </div>
            <MenuItem icon={User} onClick={() => { navigate('/profile'); close(); }}>Profile</MenuItem>
            <MenuItem icon={LogOut} danger onClick={() => { close(); logout(); navigate('/', { replace: true }); }}>Log out</MenuItem>
          </>
        )}
      </Dropdown>
    </header>
  );
}
