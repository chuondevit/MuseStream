import { Link } from 'react-router-dom';
import cn from '../../utils/cn';
import Spinner from './Spinner';

const VARIANTS = {
  primary: 'bg-brand text-white shadow-glow hover:shadow-glow-lg hover:brightness-110 active:brightness-95',
  ghost: 'text-ink hover:bg-white/10',
  glass: 'bg-white/10 border border-white/10 text-ink hover:bg-white/15',
  danger: 'bg-danger/15 text-danger border border-danger/30 hover:bg-danger/25',
};

export default function GradientButton({
  variant = 'primary', loading = false, disabled, to, className = '', children, icon: Icon, ...rest
}) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 min-h-[44px] px-5 rounded-xl font-semibold text-sm',
    'transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
    VARIANTS[variant],
    className
  );
  const content = (
    <>
      {loading ? <Spinner className="w-4 h-4" /> : Icon ? <Icon className="w-4 h-4" aria-hidden="true" /> : null}
      {children}
    </>
  );
  if (to) return <Link to={to} className={classes} {...rest}>{content}</Link>;
  return (
    <button className={classes} disabled={disabled || loading} {...rest}>
      {content}
    </button>
  );
}
