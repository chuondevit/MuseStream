import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HorizontalScroller({ children, label }) {
  const ref = useRef(null);
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: 'smooth' });
  return (
    <div className="relative group/scroll">
      <div ref={ref} role="list" aria-label={label} className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar py-2 -my-2 px-1 -mx-1">
        {children}
      </div>
      {['left', 'right'].map((side) => (
        <button
          key={side}
          onClick={() => scroll(side === 'left' ? -1 : 1)}
          aria-label={`Scroll ${side}`}
          className={`hidden lg:flex absolute top-1/2 -translate-y-1/2 ${side === 'left' ? '-left-4' : '-right-4'} w-10 h-10 items-center justify-center rounded-full glass-strong opacity-0 group-hover/scroll:opacity-100 focus-visible:opacity-100 transition shadow-glow`}
        >
          {side === 'left' ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      ))}
    </div>
  );
}
