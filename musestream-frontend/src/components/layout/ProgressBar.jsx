import { usePlayer, usePlayerTime } from '../../context/PlayerContext';
import RangeSlider from '../ui/RangeSlider';
import { formatDuration } from '../../utils/format';

export default function ProgressBar() {
  const { current, duration, seek } = usePlayer();
  const { currentTime } = usePlayerTime();
  const total = duration || current?.durationSeconds || 0;
  return (
    <div className="flex items-center gap-3 w-full text-xs text-ink-muted tabular-nums">
      <span className="w-10 text-right">{formatDuration(currentTime)}</span>
      <RangeSlider
        value={currentTime}
        max={total}
        onChange={seek}
        label="Seek"
        valueText={`${formatDuration(currentTime)} of ${formatDuration(total)}`}
      />
      <span className="w-10">{formatDuration(total)}</span>
    </div>
  );
}
