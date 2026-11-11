import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Avatar from '../ui/Avatar';
import cn from '../../utils/cn';

/** Link card by default; becomes a selectable checkbox when `onToggle` is passed (onboarding / profile). */
export default function ArtistCard({ artist, selected, onToggle, className = 'w-28 sm:w-32' }) {
  const inner = (
    <>
      <div className="relative">
        <Avatar src={artist.imageUrl} name={artist.name} className="w-full aspect-square" textClass="text-2xl" />
        {onToggle && selected && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-brand flex items-center justify-center shadow-glow">
            <Check className="w-4 h-4 text-white" />
          </motion.span>
        )}
      </div>
      <p className="mt-3 text-sm font-semibold truncate text-center">{artist.name}</p>
    </>
  );

  if (onToggle) {
    return (
      <motion.button
        type="button"
        role="checkbox"
        aria-checked={!!selected}
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => onToggle(artist.id)}
        className={cn('p-3 rounded-2xl transition', selected ? 'bg-primary-500/15 ring-2 ring-primary-400' : 'hover:bg-white/5', className)}
      >
        {inner}
      </motion.button>
    );
  }
  return (
    <motion.div role="listitem" whileHover={{ y: -4 }} className={cn('shrink-0 snap-start', className)}>
      <Link to={`/artists/${artist.id}`} className="block p-2 rounded-2xl hover:bg-white/5 transition">{inner}</Link>
    </motion.div>
  );
}
