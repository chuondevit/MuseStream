import cn from '../../utils/cn';

export default function Equalizer({ playing = true, className = 'h-4 w-4' }) {
  return (
    <span className={cn('inline-flex items-end gap-[2px]', className)} aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="eq-bar flex-1 rounded-sm bg-primary-400"
          style={{ height: playing ? undefined : '30%', animationPlayState: playing ? 'running' : 'paused' }}
        />
      ))}
    </span>
  );
}
