import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pause, Play } from 'lucide-react';
import Cover from '../ui/Cover';
import Equalizer from './Equalizer';
import { usePlayer } from '../../context/PlayerContext';
import cn from '../../utils/cn';

export default function SongCard({ song, queue, badge, reasons, className = 'w-40 sm:w-44' }) {
  const { current, isPlaying, playSong } = usePlayer();
  const active = current?.id === song.id;
  const playing = active && isPlaying;

  return (
    <motion.article
      role="listitem"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn('group relative shrink-0 snap-start glass p-3 hover:shadow-glow hover:bg-white/[0.08] transition-colors', active && 'ring-1 ring-primary-400/60', className)}
    >
      <div className="relative">
        <Cover src={song.coverUrl} alt={`${song.title} cover`} className="w-full" />
        {active && (
          <span className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 backdrop-blur"><Equalizer playing={playing} /></span>
        )}
        {badge && (
          <span tabIndex={0} className="group/badge absolute top-2 left-2 text-[11px] font-semibold px-2 py-1 rounded-full bg-black/60 backdrop-blur text-primary-400 cursor-default">
            {badge}
            {reasons?.length > 0 && (
              <span role="tooltip" className="hidden group-hover/badge:block group-focus-visible/badge:block absolute top-full left-0 mt-1 w-40 p-2 rounded-xl glass-strong text-[11px] font-normal text-ink z-10 space-y-1">
                {reasons.map((r) => <span key={r} className="block">• {r}</span>)}
              </span>
            )}
          </span>
        )}
        <button
          onClick={() => playSong(song, queue)}
          aria-label={playing ? `Pause ${song.title}` : `Play ${song.title}`}
          className="absolute bottom-2 right-2 w-11 h-11 rounded-full bg-brand text-white shadow-glow flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 focus-visible:opacity-100 focus-visible:translate-y-0 transition max-lg:opacity-100 max-lg:translate-y-0"
        >
          {playing ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
        </button>
      </div>
      <h3 className={cn('mt-3 text-sm font-semibold truncate font-sans tracking-normal', active && 'text-primary-400')}>{song.title}</h3>
      <Link to={`/artists/${song.artistId}`} className="block text-xs text-ink-muted hover:text-ink hover:underline truncate">
        {song.artistName}
      </Link>
    </motion.article>
  );
}
