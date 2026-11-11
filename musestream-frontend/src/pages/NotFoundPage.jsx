import { Music2 } from 'lucide-react';
import GradientButton from '../components/ui/GradientButton';
import { useAuth } from '../context/AuthContext';
import usePageTitle from '../hooks/usePageTitle';

export default function NotFoundPage({ inline = false, title = 'Page not found', text = "The page you're looking for doesn't exist or was moved." }) {
  usePageTitle(title);
  const { user } = useAuth();
  return (
    <div className={`flex flex-col items-center justify-center text-center gap-4 px-6 ${inline ? 'py-24' : 'min-h-screen'}`}>
      <div className="w-20 h-20 rounded-3xl bg-brand flex items-center justify-center shadow-glow"><Music2 className="w-10 h-10 text-white" /></div>
      {!inline && <p className="text-7xl font-extrabold font-display text-gradient">404</p>}
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-ink-muted max-w-sm">{text}</p>
      <GradientButton to={user ? '/home' : '/'}>{user ? 'Back to Home' : 'Back to start'}</GradientButton>
    </div>
  );
}
