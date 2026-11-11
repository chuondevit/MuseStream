import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import * as meApi from '../api/me';
import { getErrorMessage } from '../api/client';
import { useAuth } from './AuthContext';

const LikesContext = createContext(null);
export const useLikes = () => useContext(LikesContext);

export function LikesProvider({ children }) {
  const { user } = useAuth();
  const [ids, setIds] = useState(() => new Set());
  const idsRef = useRef(ids);
  idsRef.current = ids;

  useEffect(() => {
    if (!user) {
      setIds(new Set());
      return;
    }
    meApi
      .likeIds()
      .then((list) => setIds(new Set(list || [])))
      .catch(() => {});
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const apply = (songId, liked) =>
    setIds((prev) => {
      const next = new Set(prev);
      if (liked) next.add(songId);
      else next.delete(songId);
      return next;
    });

  // Optimistic toggle with rollback
  const toggle = useCallback(async (songId) => {
    const had = idsRef.current.has(songId);
    apply(songId, !had);
    try {
      if (had) await meApi.unlike(songId);
      else await meApi.like(songId);
    } catch (e) {
      apply(songId, had);
      toast.error(getErrorMessage(e));
    }
  }, []);

  const isLiked = useCallback((songId) => ids.has(songId), [ids]);
  const value = useMemo(() => ({ ids, isLiked, toggle }), [ids, isLiked, toggle]);
  return <LikesContext.Provider value={value}>{children}</LikesContext.Provider>;
}
