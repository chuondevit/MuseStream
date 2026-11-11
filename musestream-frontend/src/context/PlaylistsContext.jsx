import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as playlistsApi from '../api/playlists';
import { useAuth } from './AuthContext';

const PlaylistsContext = createContext(null);
export const usePlaylists = () => useContext(PlaylistsContext);

export function PlaylistsProvider({ children }) {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const list = await playlistsApi.list();
      setPlaylists(list || []);
    } catch {
      /* sidebar list is non-critical */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setPlaylists([]);
      return;
    }
    setLoading(true);
    refresh();
  }, [user?.id, refresh]); // eslint-disable-line react-hooks/exhaustive-deps

  const value = useMemo(() => ({ playlists, loading, refresh }), [playlists, loading, refresh]);
  return <PlaylistsContext.Provider value={value}>{children}</PlaylistsContext.Provider>;
}
