import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ListMusic } from 'lucide-react';
import Cover from '../ui/Cover';
import LikeButton from '../music/LikeButton';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar';
import { usePlayer } from '../../context/PlayerContext';

/** Full-screen "Now Playing" sheet for mobile. */
export default function NowPlayingSheet({ open, onClose, onOpenQueue }) {
  const { current } = usePlayer();
  return (
    <AnimatePresence>
      {open && current && (
        <motion.div
          role="dialog" aria-label="Now playing"
          className="fixed inset-0 z-[60] bg-base/95 backdrop-blur-2xl flex flex-col px-6 pt-4 pb-8 overflow-y-auto"
          initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <div className="flex items-center justify-between">
            <button onClick={onClose} aria-label="Close now playing" className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/10"><ChevronDown className="w-6 h-6" /></button>
            <span className="text-sm text-ink-muted">Now playing</span>
            <button onClick={onOpenQueue} aria-label="Open queue" className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/10"><ListMusic className="w-5 h-5" /></button>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-8 max-w-sm w-full mx-auto">
            <Cover src={current.coverUrl} alt={`${current.title} cover`} className="w-full shadow-glow-lg" rounded="rounded-3xl" />
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-2xl font-extrabold truncate">{current.title}</h2>
                <p className="text-ink-muted truncate">{current.artistName}</p>
              </div>
              <LikeButton songId={current.id} size="w-6 h-6" />
            </div>
            <ProgressBar />
            <PlayerControls big />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
