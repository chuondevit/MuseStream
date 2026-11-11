import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar, { NAV } from './Sidebar';
import Topbar from './Topbar';
import useHotkeys, { isTyping } from '../../hooks/useHotkeys';
import cn from '../../utils/cn';

function MobileTabs() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 h-16 grid grid-cols-5 glass-strong rounded-none border-x-0 border-b-0" aria-label="Main">
      {NAV.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => cn('flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium', isActive ? 'text-primary-400' : 'text-ink-muted')}
        >
          <Icon className="w-5 h-5" aria-hidden="true" /> {label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function AppShell() {
  const { pathname } = useLocation();

  useHotkeys((e) => {
    const isK = e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey);
    const isSlash = e.key === '/' && !isTyping(e.target) && !e.ctrlKey && !e.metaKey;
    if (isK || isSlash) {
      const input = document.querySelector('[data-search-input]');
      if (input) {
        e.preventDefault();
        input.focus();
        input.select?.();
      }
    }
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden pb-[170px] lg:pb-[112px]" id="main">
          <motion.div key={pathname} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, ease: 'easeOut' }}>
            <Outlet />
          </motion.div>
        </main>
      </div>
      <MobileTabs />
    </div>
  );
}
