import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Pause, Play, Search } from 'lucide-react';
import Cover from '../ui/Cover';
import Equalizer from '../music/Equalizer';
import ArtistCard from '../music/ArtistCard';
import GenreTile from '../music/GenreTile';
import { usePlayer } from '../../context/PlayerContext';
import cn from '../../utils/cn';

export function PickerSearch({ value, onChange, placeholder }) {
  return (
    <div className="relative mb-4">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" aria-hidden="true" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full min-h-[44px] pl-10 pr-4 rounded-full bg-white/5 border border-white/10 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/40"
      />
    </div>
  );
}

function SongPickCard({ song, selected, onToggle, queue }) {
  const { current, isPlaying, playSong } = usePlayer();
  const active = current?.id === song.id;
  const playing = active && isPlaying;
  const key = (e) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(song.id); }
  };
  return (
    <motion.div
      role="checkbox" aria-checked={selected} tabIndex={0} onKeyDown={key} onClick={() => onToggle(song.id)}
      whileHover={{ y: -3 }} animate={{ scale: selected ? 1.02 : 1 }}
      className={cn('relative cursor-pointer p-2.5 rounded-2xl transition', selected ? 'bg-primary-500/15 ring-2 ring-primary-400 shadow-glow' : 'bg-white/5 hover:bg-white/10')}
    >
      <div className="relative">
        <Cover src={song.coverUrl} alt="" className="w-full" />
        {selected && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 left-2 w-7 h-7 rounded-full bg-brand flex items-center justify-center shadow-glow">
            <Check className="w-4 h-4 text-white" />
          </motion.span>
        )}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); playSong(song, queue, { record: false }); }}
          aria-label={playing ? `Pause preview of ${song.title}` : `Preview ${song.title}`}
          className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-black/70 backdrop-blur text-white flex items-center justify-center hover:bg-black/90"
        >
          {playing ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
        </button>
        {active && <span className="absolute top-2 right-2 p-1 rounded bg-black/60"><Equalizer playing={playing} className="h-3 w-3" /></span>}
      </div>
      <p className="mt-2 text-sm font-semibold truncate">{song.title}</p>
      <p className="text-xs text-ink-muted truncate">{song.artistName}</p>
    </motion.div>
  );
}

export function SongPicker({ songs = [], selected, onToggle }) {
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? songs.filter((x) => `${x.title} ${x.artistName}`.toLowerCase().includes(s)) : songs;
  }, [songs, q]);
  return (
    <div>
      <PickerSearch value={q} onChange={setQ} placeholder="Filter songs…" />
      {filtered.length === 0 ? (
        <p className="text-sm text-ink-muted py-8 text-center">No songs match “{q}”.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((s) => <SongPickCard key={s.id} song={s} selected={selected.includes(s.id)} onToggle={onToggle} queue={filtered} />)}
        </div>
      )}
    </div>
  );
}

export function ArtistPicker({ artists = [], selected, onToggle }) {
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? artists.filter((a) => a.name.toLowerCase().includes(s)) : artists;
  }, [artists, q]);
  return (
    <div>
      <PickerSearch value={q} onChange={setQ} placeholder="Filter artists…" />
      {filtered.length === 0 ? (
        <p className="text-sm text-ink-muted py-8 text-center">No artists match “{q}”.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 justify-items-center">
          {filtered.map((a) => <ArtistCard key={a.id} artist={a} selected={selected.includes(a.id)} onToggle={onToggle} className="w-full max-w-[150px]" />)}
        </div>
      )}
    </div>
  );
}

export function GenrePicker({ genres = [], selected, onToggle }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {genres.map((g) => <GenreTile key={g.id} genre={g} selected={selected.includes(g.id)} onToggle={onToggle} className="min-h-[110px]" />)}
    </div>
  );
}

export const toggleId = (list, id) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
