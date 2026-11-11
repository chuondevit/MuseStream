import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pause, Play, X } from 'lucide-react';
import Cover from '../ui/Cover';
import Equalizer from './Equalizer';
import LikeButton from './LikeButton';
import AddToPlaylistMenu from './AddToPlaylistMenu';
import { usePlayer } from '../../context/PlayerContext';
import { formatDuration } from '../../utils/format';
import cn from '../../utils/cn';

export default function SongRow({ song, index, queue, meta, onRemove, className }) {
  const { current, isPlaying, playSong, duration } = usePlayer();
  const active = current?.id === song.id;
  const playing = active && isPlaying;
  // Backend duration is approximate: prefer the real one once the audio element knows it
  const dur = active && duration > 0 ? duration : song.durationSeconds;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.2 }}
      onClick={() => playSong(song, queue)}
      className={cn(
        'group grid items-center gap-3 px-2 sm:px-3 rounded-xl cursor-pointer transition-colors hover:bg-white/5',
        'grid-cols-[2.5rem_minmax(0,1fr)_auto] sm:grid-cols-[2.5rem_minmax(0,1fr)_8rem_3.5rem_auto]',
        active && 'bg-primary-500/10',
        className
      )}
    >
      <button
        aria-label={playing ? `Pause ${song.title}` : `Play ${song.title}`}
        onClick={(e) => { e.stopPropagation(); playSong(song, queue); }}
        className="w-10 h-11 flex items-center justify-center text-sm text-ink-muted"
      >
        {active ? (
          <>
            <span className="group-hover:hidden"><Equalizer playing={playing} /></span>
            <span className="hidden group-hover:block text-ink">{playing ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}</span>
          </>
        ) : (
          <>
            <span className="group-hover:hidden">{index ?? ''}</span>
            <Play className="w-4 h-4 fill-current hidden group-hover:block text-ink" />
          </>
        )}
      </button>

      <div className="flex items-center gap-3 min-w-0 py-2">
        <Cover src={song.coverUrl} alt="" className="w-11 h-11 shrink-0" rounded="rounded-lg" />
        <div className="min-w-0">
          <p className={cn('text-sm font-semibold truncate', active && 'text-primary-400')}>{song.title}</p>
          <Link to={`/artists/${song.artistId}`} onClick={(e) => e.stopPropagation()} className="text-xs text-ink-muted hover:text-ink hover:underline truncate block">
            {meta ? `${song.artistName} · ${meta}` : song.artistName}
          </Link>
        </div>
      </div>

      <span className="hidden sm:block">
        {song.genreName && <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-ink-muted">{song.genreName}</span>}
      </span>
      <span className="hidden sm:block text-xs text-ink-muted tabular-nums text-right">{formatDuration(dur)}</span>

      <div className="flex items-center">
        <LikeButton songId={song.id} />
        {onRemove ? (
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(song); }}
            aria-label={`Remove ${song.title} from playlist`}
            className="w-11 h-11 flex items-center justify-center rounded-full text-ink-muted hover:text-danger hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          <AddToPlaylistMenu song={song} />
        )}
      </div>
    </motion.div>
  );
}
