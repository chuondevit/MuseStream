import { AnimatePresence } from 'framer-motion';
import SongRow from './SongRow';

/** List of rows with a small header. `queue` defaults to the list itself. */
export default function SongTable({ songs = [], onRemove, getMeta, showHeader = true }) {
  return (
    <div>
      {showHeader && (
        <div className="hidden sm:grid grid-cols-[2.5rem_minmax(0,1fr)_8rem_3.5rem_auto] gap-3 px-3 pb-2 mb-1 text-xs text-ink-muted border-b border-soft">
          <span className="text-center">#</span>
          <span>Title</span>
          <span>Genre</span>
          <span className="text-right">Time</span>
          <span className="w-[88px]" />
        </div>
      )}
      <AnimatePresence initial={false}>
        {songs.map((song, i) => (
          <SongRow key={song.id} song={song} index={i + 1} queue={songs} onRemove={onRemove} meta={getMeta?.(song)} />
        ))}
      </AnimatePresence>
    </div>
  );
}
