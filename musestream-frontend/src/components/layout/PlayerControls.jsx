import { Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import cn from '../../utils/cn';

export default function PlayerControls({ big = false }) {
  const { current, isPlaying, isBuffering, shuffle, repeat, togglePlay, next, prev, toggleShuffle, cycleRepeat } = usePlayer();
  const disabled = !current;
  const side = 'w-11 h-11 flex items-center justify-center rounded-full transition hover:bg-white/10 disabled:opacity-40';
  const RepeatIcon = repeat === 'one' ? Repeat1 : Repeat;

  return (
    <div className={cn('flex items-center justify-center', big ? 'gap-5' : 'gap-1 sm:gap-2')}>
      <button disabled={disabled} onClick={toggleShuffle} aria-label="Shuffle" aria-pressed={shuffle} className={cn(side, shuffle ? 'text-primary-400' : 'text-ink-muted')}>
        <Shuffle className="w-4 h-4" />
      </button>
      <button disabled={disabled} onClick={prev} aria-label="Previous track" className={cn(side, 'text-ink')}>
        <SkipBack className="w-5 h-5 fill-current" />
      </button>
      <button
        disabled={disabled}
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        className={cn('rounded-full bg-brand text-white shadow-glow hover:shadow-glow-lg hover:scale-105 active:scale-95 transition flex items-center justify-center disabled:opacity-40 disabled:shadow-none', big ? 'w-16 h-16' : 'w-11 h-11')}
      >
        {isBuffering && isPlaying ? (
          <span className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
        ) : isPlaying ? (
          <Pause className={cn('fill-white', big ? 'w-7 h-7' : 'w-5 h-5')} />
        ) : (
          <Play className={cn('fill-white ml-0.5', big ? 'w-7 h-7' : 'w-5 h-5')} />
        )}
      </button>
      <button disabled={disabled} onClick={next} aria-label="Next track" className={cn(side, 'text-ink')}>
        <SkipForward className="w-5 h-5 fill-current" />
      </button>
      <button disabled={disabled} onClick={cycleRepeat} aria-label={`Repeat: ${repeat}`} className={cn(side, repeat !== 'off' ? 'text-primary-400' : 'text-ink-muted')}>
        <RepeatIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
