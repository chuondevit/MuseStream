import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { genreStyle } from '../../utils/genre';
import cn from '../../utils/cn';

export default function GenreTile({ genre, to, selected, onToggle, className = '' }) {
  const { background, emoji } = genreStyle(genre);
  const body = (
    <>
      <span className="text-3xl drop-shadow" aria-hidden="true">{emoji}</span>
      <span className="font-display font-bold text-lg drop-shadow">{genre.name}</span>
      {onToggle && selected && (
        <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white text-base flex items-center justify-center"><Check className="w-4 h-4" /></span>
      )}
    </>
  );
  const classes = cn(
    'relative flex flex-col justify-between min-h-[96px] p-4 rounded-2xl text-white text-left transition',
    onToggle && (selected ? 'ring-4 ring-white/80 shadow-glow' : 'opacity-80 hover:opacity-100'),
    className
  );
  if (onToggle) {
    return (
      <motion.button type="button" role="checkbox" aria-checked={!!selected} whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }} onClick={() => onToggle(genre.id)} style={{ background }} className={classes}>
        {body}
      </motion.button>
    );
  }
  return (
    <motion.div whileHover={{ y: -3 }}>
      <Link to={to} style={{ background }} className={classes}>{body}</Link>
    </motion.div>
  );
}
