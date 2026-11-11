import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ChevronLeft, ChevronRight, Heart, ListPlus, ListEnd, MoreHorizontal, Plus, User } from 'lucide-react';
import Dropdown, { MenuItem } from '../ui/Dropdown';
import PlaylistModal from './PlaylistModal';
import * as playlistsApi from '../../api/playlists';
import { getErrorMessage } from '../../api/client';
import { usePlaylists } from '../../context/PlaylistsContext';
import { useLikes } from '../../context/LikesContext';
import { usePlayer } from '../../context/PlayerContext';

export default function AddToPlaylistMenu({ song, className = '' }) {
  const { playlists, refresh } = usePlaylists();
  const { isLiked, toggle } = useLikes();
  const { addToQueue } = usePlayer();
  const navigate = useNavigate();
  const [view, setView] = useState('main');
  const [modal, setModal] = useState(false);

  const addTo = async (pl, close) => {
    try {
      await playlistsApi.addSong(pl.id, song.id);
      toast.success(`Added to ${pl.name}`);
      refresh();
      close();
    } catch (e) {
      if (e.response?.status === 409) toast.error('Already in this playlist');
      else toast.error(getErrorMessage(e));
    }
  };

  const addToNew = async (pl) => {
    try {
      await playlistsApi.addSong(pl.id, song.id);
      toast.success(`Added to ${pl.name}`);
      refresh();
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  return (
    <>
      <Dropdown
        trigger={(p) => (
          <button
            {...p}
            onClick={(e) => { setView('main'); p.onClick(e); }}
            aria-label={`More options for ${song.title}`}
            className={`w-11 h-11 flex items-center justify-center rounded-full text-ink-muted hover:text-ink hover:bg-white/10 transition ${className}`}
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        )}
      >
        {({ close }) =>
          view === 'main' ? (
            <>
              <MenuItem icon={ListPlus} onClick={() => setView('playlists')}>
                Add to playlist <ChevronRight className="w-4 h-4 inline float-right mt-0.5" />
              </MenuItem>
              <MenuItem icon={Heart} onClick={() => { toggle(song.id); close(); }}>
                {isLiked(song.id) ? 'Remove from liked' : 'Add to liked'}
              </MenuItem>
              <MenuItem icon={ListEnd} onClick={() => { addToQueue(song); close(); }}>Add to queue</MenuItem>
              <MenuItem icon={User} onClick={() => { navigate(`/artists/${song.artistId}`); close(); }}>Go to artist</MenuItem>
            </>
          ) : (
            <>
              <MenuItem icon={ChevronLeft} onClick={() => setView('main')}>Back</MenuItem>
              <MenuItem icon={Plus} onClick={() => { close(); setModal(true); }}>Create new playlist</MenuItem>
              <div className="my-1 h-px bg-white/10" />
              {playlists.length === 0 && <p className="px-3 py-2 text-xs text-ink-muted">No playlists yet</p>}
              {playlists.map((pl) => (
                <MenuItem key={pl.id} onClick={() => addTo(pl, close)}>{pl.name}</MenuItem>
              ))}
            </>
          )
        }
      </Dropdown>
      <PlaylistModal open={modal} onClose={() => setModal(false)} onSaved={addToNew} />
    </>
  );
}
