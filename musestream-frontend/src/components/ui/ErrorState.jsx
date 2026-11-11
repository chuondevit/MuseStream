import { AlertTriangle, RotateCw } from 'lucide-react';

export default function ErrorState({ message = 'Something went wrong', onRetry }) {
  return (
    <div role="alert" className="glass flex flex-col items-center text-center px-6 py-10 gap-3 border-danger/30">
      <AlertTriangle className="w-8 h-8 text-danger" aria-hidden="true" />
      <p className="text-sm text-ink-muted max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 min-h-[44px] rounded-xl bg-white/10 hover:bg-white/15 text-sm font-semibold transition"
        >
          <RotateCw className="w-4 h-4" aria-hidden="true" /> Retry
        </button>
      )}
    </div>
  );
}
