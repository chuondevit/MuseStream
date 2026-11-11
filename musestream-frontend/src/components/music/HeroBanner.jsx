import { motion } from 'framer-motion';
import { Pause, Play } from 'lucide-react';
import Cover from '../ui/Cover';
import LikeButton from './LikeButton';
import GradientButton from '../ui/GradientButton';
import { usePlayer } from '../../context/PlayerContext';

/** "Made for you" banner for the top recommendation. */
export default function HeroBanner({ rec, queue }) {
  const { current, isPlaying, playSong } = usePlayer();
  const { song, reasons = [] } = rec;
  const playing = current?.id === song.id && isPlaying;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl border border-white/10 p-5 sm:p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-8"
      aria-label="Made for you"
    >
      {song.coverUrl && (
        <img src={song.coverUrl} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-30 blur-3xl scale-125" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-base/70 via-base/40 to-transparent" />
      <Cover src={song.coverUrl} alt={`${song.title} cover`} className="relative w-44 sm:w-56 shrink-0 shadow-glow-lg" rounded="rounded-2xl" />
      <div className="relative min-w-0 text-center sm:text-left">
        <p className="text-sm font-semibold text-primary-400">Made for you</p>
        <h2 className="text-3xl sm:text-5xl font-extrabold mt-1 truncate">{song.title}</h2>
        <p className="text-ink-muted mt-1">{song.artistName}</p>
        {reasons.length > 0 && (
          <ul className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4" aria-label="Why this song">
            {reasons.map((r) => (
              <li key={r} className="text-xs px-3 py-1.5 rounded-full bg-white/10 border border-white/10">{r}</li>
            ))}
          </ul>
        )}
        <div className="flex items-center justify-center sm:justify-start gap-3 mt-6">
          <GradientButton onClick={() => playSong(song, queue)} icon={playing ? Pause : Play} className="px-7">
            {playing ? 'Pause' : 'Play'}
          </GradientButton>
          <LikeButton songId={song.id} className="bg-white/10" />
        </div>
      </div>
    </motion.section>
  );
}
