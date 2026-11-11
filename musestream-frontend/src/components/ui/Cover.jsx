import { useEffect, useState } from 'react';
import { Music2 } from 'lucide-react';
import cn from '../../utils/cn';

/** Image with fixed aspect ratio and gradient fallback. */
export default function Cover({ src, alt = '', className = '', rounded = 'rounded-xl' }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt || 'Cover placeholder'}
        className={cn('aspect-square bg-brand flex items-center justify-center text-white/80', rounded, className)}
      >
        <Music2 className="w-1/3 h-1/3" aria-hidden="true" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn('aspect-square object-cover bg-elevated', rounded, className)}
    />
  );
}
