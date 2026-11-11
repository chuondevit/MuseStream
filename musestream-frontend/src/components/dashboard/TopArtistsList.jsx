import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Avatar from '../ui/Avatar';

export default function TopArtistsList({ artists = [] }) {
  const max = Math.max(1, ...artists.map((a) => a.plays || 0));
  return (
    <ol className="space-y-4">
      {artists.map((a, i) => (
        <li key={a.id} className="flex items-center gap-3">
          <span className="w-5 text-sm text-ink-muted tabular-nums">{i + 1}</span>
          <Avatar src={a.imageUrl} name={a.name} className="w-11 h-11" />
          <div className="flex-1 min-w-0">
            <div className="flex justify-between gap-2 text-sm">
              <Link to={`/artists/${a.id}`} className="font-semibold truncate hover:underline">{a.name}</Link>
              <span className="text-ink-muted tabular-nums shrink-0">{a.plays} plays</span>
            </div>
            <div className="mt-1.5 h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-brand"
                initial={{ width: 0 }}
                animate={{ width: `${((a.plays || 0) / max) * 100}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.05 }}
              />
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
