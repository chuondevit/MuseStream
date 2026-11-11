import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as authApi from '../api/auth';
import { TOKEN_KEY, getErrorMessage, setUnauthorizedHandler } from '../api/client';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(() => !!localStorage.getItem(TOKEN_KEY));
  const navigate = useNavigate();

  // Axios interceptor -> clear state + go to login on 401
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null);
      navigate('/login', { replace: true });
    });
  }, [navigate]);

  // Restore session from stored token
  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return undefined;
    let cancelled = false;
    authApi
      .me()
      .then((u) => !cancelled && setUser(u))
      .catch((err) => {
        if (!cancelled && err.response?.status !== 401) toast.error(getErrorMessage(err), { id: 'boot-error' });
      })
      .finally(() => !cancelled && setBooting(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback((res) => {
    localStorage.setItem(TOKEN_KEY, res.token);
    setUser(res.user);
    return res.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const setOnboarded = useCallback(() => setUser((u) => (u ? { ...u, onboardingCompleted: true } : u)), []);

  const value = useMemo(() => ({ user, booting, signIn, logout, setOnboarded }), [user, booting, signIn, logout, setOnboarded]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
