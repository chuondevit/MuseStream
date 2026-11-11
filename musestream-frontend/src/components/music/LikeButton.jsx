import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useLikes } from '../../context/LikesContext';
import cn from '../../utils/cn';

export default function LikeButton({ songId, className = '', size = 'w-5 h-5' }) {
  const { isLiked, toggle } = useLikes();
  const liked = isLiked(songId);
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.8 }}
      onClick={(e) => { e.stopPropagation(); toggle(songId); }}
      aria-label={liked ? 'Remove from liked songs' : 'Add to liked songs'}
      aria-pressed={liked}
      className={cn('w-11 h-11 flex items-center justify-center rounded-full transition hover:bg-white/10', className)}
    >
      <motion.span key={String(liked)} initial={{ scale: liked ? 0.5 : 1 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}>
        <Heart className={cn(size, liked ? 'fill-accent-pink text-accent-pink' : 'text-ink-muted')} />
      </motion.span>
    </motion.button>
  );
}
