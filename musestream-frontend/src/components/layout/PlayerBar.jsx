import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ListMusic, Maximize2, Pause, Play, Volume1, Volume2, VolumeX } from 'lucide-react';
import Cover from '../ui/Cover';
import RangeSlider from '../ui/RangeSlider';
import LikeButton from '../music/LikeButton';
import Equalizer from '../music/Equalizer';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar';
import QueuePanel from './QueuePanel';
import NowPlayingSheet from './NowPlayingSheet';
import { usePlayer, usePlayerTime } from '../../context/PlayerContext';

export default function PlayerBar() {
  const { current, isPlaying, volume, isMuted, setVolume, toggleMute, togglePlay, duration } = usePlayer();
  const { currentTime } = usePlayerTime();
  const { pathname } = useLocation();
  const [queueOpen, setQueueOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const hasTabBar = pathname !== '/onboarding';
  const VolIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  const total = duration || current?.durationSeconds || 0;

  return (
    <>
      {/* Desktop bar */}
      <div className="hidden lg:grid fixed bottom-0 inset-x-0 z-50 h-[88px] grid-cols-[1fr_minmax(0,2fr)_1fr] items-center gap-4 px-6 glass-strong border-x-0 border-b-0 rounded-none" role="region" aria-label="Player">
        <div className="flex items-center gap-3 min-w-0">
          {current ? (
            <>
              <Cover src={current.coverUrl} alt="" className="w-14 h-14 shrink-0 shadow-glow" />
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate text-primary-400">{current.title}</p>
                <p className="text-xs text-ink-muted truncate">{current.artistName}</p>
              </div>
              <LikeButton songId={current.id} />
            </>
          ) : (
            <p className="text-sm text-ink-muted">Pick a song to start listening</p>
          )}
        </div>
        <div className="flex flex-col items-center">
          <PlayerControls />
          <ProgressBar />
        </div>
        <div className="flex items-center justify-end gap-1">
          <button onClick={toggleMute} aria-label={isMuted ? 'Unmute' : 'Mute'} className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/10 text-ink-muted hover:text-ink">
            <VolIcon className="w-5 h-5" />
          </button>
          <div className="w-28">
            <RangeSlider value={isMuted ? 0 : volume} max={1} step={0.01} onChange={setVolume} label="Volume" valueText={`${Math.round((isMuted ? 0 : volume) * 100)} percent`} />
          </div>
          <button onClick={() => setQueueOpen(true)} aria-label="Open queue" className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/10 text-ink-muted hover:text-ink">
            <ListMusic className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile mini player */}
      {current && (
        <div className={`lg:hidden fixed inset-x-2 z-50 ${hasTabBar ? 'bottom-[72px]' : 'bottom-2'} glass-strong rounded-2xl overflow-hidden`} role="region" aria-label="Mini player">
          <div className="flex items-center gap-3 p-2 pr-1">
            <button onClick={() => setSheetOpen(true)} className="flex items-center gap-3 min-w-0 flex-1 text-left min-h-[48px]" aria-label="Open now playing">
              <Cover src={current.coverUrl} alt="" className="w-12 h-12 shrink-0" rounded="rounded-lg" />
              <span className="min-w-0">
                <span className="flex items-center gap-2 text-sm font-semibold truncate text-primary-400">
                  {isPlaying && <Equalizer className="h-3 w-3 shrink-0" />}<span className="truncate">{current.title}</span>
                </span>
                <span className="block text-xs text-ink-muted truncate">{current.artistName}</span>
              </span>
            </button>
            <button onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'} className="w-11 h-11 flex items-center justify-center rounded-full bg-brand text-white">
              {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
            </button>
            <button onClick={() => setSheetOpen(true)} aria-label="Expand player" className="w-11 h-11 flex items-center justify-center rounded-full text-ink-muted"><Maximize2 className="w-4 h-4" /></button>
          </div>
          <div className="h-0.5 bg-white/10"><div className="h-full bg-brand" style={{ width: `${total ? Math.min(100, (currentTime / total) * 100) : 0}%` }} /></div>
        </div>
      )}

      <QueuePanel open={queueOpen} onClose={() => setQueueOpen(false)} />
      <NowPlayingSheet open={sheetOpen} onClose={() => setSheetOpen(false)} onOpenQueue={() => { setSheetOpen(false); setQueueOpen(true); }} />
    </>
  );
}
