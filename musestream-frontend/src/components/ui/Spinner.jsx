import { Loader2 } from 'lucide-react';
import cn from '../../utils/cn';

export default function Spinner({ className = 'w-5 h-5' }) {
  return <Loader2 className={cn('animate-spin', className)} aria-label="Loading" />;
}
