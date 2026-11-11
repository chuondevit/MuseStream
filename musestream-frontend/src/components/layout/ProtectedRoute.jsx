import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Splash from '../ui/Splash';
import PlayerBar from './PlayerBar';

/** Auth + onboarding guard. Also hosts the persistent player. */
export default function ProtectedRoute() {
  const { user, booting } = useAuth();
  const location = useLocation();

  if (booting) return <Splash />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;

  const onOnboarding = location.pathname === '/onboarding';
  if (!user.onboardingCompleted && !onOnboarding) return <Navigate to="/onboarding" replace />;
  if (user.onboardingCompleted && onOnboarding) return <Navigate to="/home" replace />;

  return (
    <>
      <Outlet />
      <PlayerBar />
    </>
  );
}

/** Public pages (landing, login, register): logged-in users go to /home. */
export function PublicOnly({ children }) {
  const { user, booting } = useAuth();
  if (booting) return <Splash />;
  if (user) return <Navigate to={user.onboardingCompleted ? '/home' : '/onboarding'} replace />;
  return children;
}
