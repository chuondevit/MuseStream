import { Link } from 'react-router-dom';
import { Music2 } from 'lucide-react';
import cn from '../../utils/cn';

export default function Logo({ className = '', to = '/', size = 'md' }) {
  const box = size === 'lg' ? 'w-14 h-14' : 'w-9 h-9';
  return (
    <Link to={to} className={cn('inline-flex items-center gap-2.5 font-display font-extrabold text-xl tracking-tight', className)} aria-label="MuseStream home">
      <span className={cn('rounded-xl bg-brand flex items-center justify-center shadow-glow', box)}>
        <Music2 className="w-1/2 h-1/2 text-white" aria-hidden="true" />
      </span>
      MuseStream
    </Link>
  );
}
