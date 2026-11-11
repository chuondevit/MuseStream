import cn from '../../utils/cn';

export default function RangeSlider({ value, max = 100, step = 0.1, onChange, label, valueText, always, className }) {
  const safeMax = max > 0 ? max : 1;
  const v = Math.min(Math.max(value || 0, 0), safeMax);
  return (
    <div className="py-3 w-full">
      <input
        type="range"
        min={0}
        max={safeMax}
        step={step}
        value={v}
        aria-label={label}
        aria-valuetext={valueText}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ '--pct': `${(v / safeMax) * 100}%` }}
        className={cn('slider w-full block', always && 'always', className)}
      />
    </div>
  );
}
