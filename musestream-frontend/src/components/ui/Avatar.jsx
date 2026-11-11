import { useEffect, useState } from 'react';
import cn from '../../utils/cn';

export default function Avatar({ src, name = '', className = 'w-10 h-10', textClass = 'text-sm' }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  const initials = name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || '?';

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={name}
        loading="lazy"
        onError={() => setFailed(true)}
        className={cn('rounded-full object-cover aspect-square bg-elevated', className)}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={name}
      className={cn('rounded-full bg-brand flex items-center justify-center font-display font-bold text-white shrink-0', textClass, className)}
    >
      {initials}
    </div>
  );
}
