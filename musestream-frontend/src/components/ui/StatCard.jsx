import { useEffect, useState } from 'react';
import { animate, motion } from 'framer-motion';

function useCountUp(target, duration = 1) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (typeof target !== 'number') return undefined;
    const controls = animate(0, target, { duration, ease: 'easeOut', onUpdate: (x) => setV(Math.round(x)) });
    return () => controls.stop();
  }, [target, duration]);
  return v;
}

export default function StatCard({ icon: Icon, label, value, format, hint, title }) {
  const counted = useCountUp(typeof value === 'number' ? value : 0);
  const display = typeof value === 'number' ? (format ? format(counted) : counted.toLocaleString()) : value;
  return (
    <motion.div whileHover={{ y: -4 }} className="glass p-5 hover:shadow-glow transition-shadow" title={title}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-ink-muted">{label}</span>
        {Icon && (
          <span className="w-9 h-9 rounded-xl bg-brand/20 text-primary-400 flex items-center justify-center">
            <Icon className="w-4 h-4" aria-hidden="true" />
          </span>
        )}
      </div>
      <div className="text-3xl font-display font-extrabold tracking-tight truncate">{display}</div>
      {hint && <div className="text-xs text-ink-muted mt-1">{hint}</div>}
    </motion.div>
  );
}
