import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import Cover from '../ui/Cover';
import Equalizer from '../music/Equalizer';
import { usePlayer } from '../../context/PlayerContext';
import { formatDuration } from '../../utils/format';

export default function QueuePanel({ open, onClose }) {
  const { queue, currentIndex, isPlaying, jumpTo } = usePlayer();

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[55] bg-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside
            role="dialog" aria-label="Up next"
            className="fixed right-0 top-0 bottom-0 z-[56] w-full sm:w-[380px] glass-strong flex flex-col"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-between p-5 border-b border-soft">
              <h2 className="text-lg font-bold">Up next</h2>
              <button onClick={onClose} aria-label="Close queue" className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-white/10"><X className="w-5 h-5" /></button>
            </div>
            <ul className="flex-1 overflow-y-auto p-2">
              {queue.length === 0 && <li className="p-6 text-sm text-ink-muted text-center">Your queue is empty. Play a song to get started.</li>}
              {queue.map((s, i) => {
                const active = i === currentIndex;
                return (
                  <li key={`${s.id}-${i}`}>
                    <button onClick={() => jumpTo(i)} className={`w-full flex items-center gap-3 p-2 rounded-xl text-left hover:bg-white/5 min-h-[56px] ${active ? 'bg-primary-500/10' : ''}`}>
                      <Cover src={s.coverUrl} alt="" className="w-11 h-11 shrink-0" rounded="rounded-lg" />
                      <span className="min-w-0 flex-1">
                        <span className={`block text-sm font-semibold truncate ${active ? 'text-primary-400' : ''}`}>{s.title}</span>
                        <span className="block text-xs text-ink-muted truncate">{s.artistName}</span>
                      </span>
                      {active ? <Equalizer playing={isPlaying} /> : <span className="text-xs text-ink-muted tabular-nums">{formatDuration(s.durationSeconds)}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
