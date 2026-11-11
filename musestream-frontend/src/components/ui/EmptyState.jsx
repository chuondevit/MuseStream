import { Music } from 'lucide-react';

export default function EmptyState({ icon: Icon = Music, title, text, action }) {
  return (
    <div className="glass flex flex-col items-center text-center px-6 py-12 gap-3">
      <div className="w-14 h-14 rounded-2xl bg-brand/20 flex items-center justify-center text-primary-400">
        <Icon className="w-7 h-7" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-bold">{title}</h3>
      {text && <p className="text-sm text-ink-muted max-w-sm">{text}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
