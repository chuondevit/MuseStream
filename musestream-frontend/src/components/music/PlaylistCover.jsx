import Cover from '../ui/Cover';
import cn from '../../utils/cn';

const GRADIENTS = [
  'linear-gradient(135deg,#8B5CF6,#EC4899)',
  'linear-gradient(135deg,#06B6D4,#8B5CF6)',
  'linear-gradient(135deg,#F472B6,#FB923C)',
  'linear-gradient(135deg,#34D399,#22D3EE)',
];

/** coverUrl > 2x2 mosaic of song covers > gradient with initial */
export default function PlaylistCover({ playlist, songs, className = '', rounded = 'rounded-xl' }) {
  if (playlist.coverUrl) return <Cover src={playlist.coverUrl} alt={playlist.name} className={cn('w-full', className)} rounded={rounded} />;
  const covers = (songs || playlist.songs || []).map((s) => s.coverUrl).filter(Boolean);
  if (covers.length >= 4) {
    return (
      <div className={cn('grid grid-cols-2 aspect-square overflow-hidden w-full', rounded, className)}>
        {covers.slice(0, 4).map((c, i) => <img key={i} src={c} alt="" loading="lazy" className="w-full h-full object-cover" />)}
      </div>
    );
  }
  return (
    <div
      className={cn('aspect-square w-full flex items-center justify-center font-display font-extrabold text-white/90 text-4xl', rounded, className)}
      style={{ background: GRADIENTS[(playlist.id || 0) % GRADIENTS.length] }}
      aria-hidden="true"
    >
      {playlist.name?.[0]?.toUpperCase() || '♪'}
    </div>
  );
}
