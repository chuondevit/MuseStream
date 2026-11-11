import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function SectionHeader({ title, subtitle, to, action }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-4">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
        {subtitle && <p className="text-sm text-ink-muted mt-0.5">{subtitle}</p>}
      </div>
      {action ||
        (to && (
          <Link to={to} className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink min-h-[44px]">
            See all <ChevronRight className="w-4 h-4" />
          </Link>
        ))}
    </div>
  );
}
