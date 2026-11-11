import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

const COLORS = ['#8B5CF6', '#EC4899', '#22D3EE', '#A78BFA', '#34D399', '#FACC15'];

/** One-shot confetti burst (auto-unmounts). */
export default function Confetti({ count = 48 }) {
  const [alive, setAlive] = useState(true);
  const pieces = useMemo(
    () => Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 900,
      y: -200 - Math.random() * 400,
      rotate: Math.random() * 720 - 360,
      color: COLORS[i % COLORS.length],
      size: 6 + Math.random() * 8,
      delay: Math.random() * 0.15,
    })),
    [count]
  );
  useEffect(() => {
    const t = setTimeout(() => setAlive(false), 2800);
    return () => clearTimeout(t);
  }, []);
  if (!alive) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[90] flex items-end justify-center overflow-hidden" aria-hidden="true">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute bottom-24 rounded-sm"
          style={{ width: p.size, height: p.size * 0.6, background: p.color }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: p.x, y: [0, p.y, p.y + 700], opacity: [1, 1, 0], rotate: p.rotate }}
          transition={{ duration: 2.4, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}
