import { useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import cn from '../../utils/cn';

/** Floating-label input with inline error + password toggle. */
export default function FormField({ label, type = 'text', value, onChange, error, autoComplete, name, children, ...rest }) {
  const id = useId();
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  return (
    <div>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={isPassword && show ? 'text' : type}
          value={value}
          onChange={onChange}
          placeholder=" "
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          className={cn(
            'peer w-full min-h-[56px] rounded-xl bg-elevated border px-4 pt-5 pb-1.5 text-sm text-ink outline-none transition',
            'focus:border-primary-400 focus:ring-2 focus:ring-primary-400/40',
            error ? 'border-danger' : 'border-white/10',
            isPassword && 'pr-12'
          )}
          {...rest}
        />
        <label
          htmlFor={id}
          className={cn(
            'pointer-events-none absolute left-4 top-1.5 text-[11px] text-ink-muted transition-all',
            'peer-placeholder-shown:top-[18px] peer-placeholder-shown:text-sm',
            'peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:text-primary-400'
          )}
        >
          {label}
        </label>
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? 'Hide password' : 'Show password'}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-ink-muted hover:text-ink"
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {children}
      {error && <p id={`${id}-err`} className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}
