import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import * as recApi from '../api/recommendations';
import { isTyping } from '../hooks/useHotkeys';

const PlayerCtx = createContext(null);
const TimeCtx = createContext({ currentTime: 0 });
export const usePlayer = () => useContext(PlayerCtx);
/** Split out so only the progress UI re-renders on every timeupdate. */
export const usePlayerTime = () => useContext(TimeCtx);

const VOLUME_KEY = 'musestream_volume';

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(() => {
    const v = parseFloat(localStorage.getItem(VOLUME_KEY));
    return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0.8;
  });
  const [isMuted, setIsMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState('off'); // off | all | one
  const [isBuffering, setIsBuffering] = useState(false);
  const [error, setError] = useState(null);

  // Refs mirror state so audio event handlers (registered once) never go stale
  const queueRef = useRef([]);
  const indexRef = useRef(-1);
  const shuffleRef = useRef(false);
  const repeatRef = useRef('off');
  const recordRef = useRef(true); // false during onboarding preview
  const countedRef = useRef(true);
  const errStreakRef = useRef(0);
  const fnsRef = useRef({});

  useEffect(() => { shuffleRef.current = shuffle; }, [shuffle]);
  useEffect(() => { repeatRef.current = repeat; }, [repeat]);

  const loadIndex = useCallback((q, idx) => {
    const audio = audioRef.current;
    const song = q[idx];
    if (!audio || !song) return;
    queueRef.current = q;
    indexRef.current = idx;
    setQueue(q);
    setCurrentIndex(idx);
    countedRef.current = !recordRef.current; // history is recorded once per track start
    setError(null);
    setIsBuffering(true);
    setCurrentTime(0);
    setDuration(0);
    audio.src = song.audioUrl;
    audio.load();
    audio.play().catch((e) => {
      if (e?.name !== 'AbortError') setIsPlaying(false);
    });
  }, []);

  const pickNext = (auto) => {
    const q = queueRef.current;
    const i = indexRef.current;
    if (!q.length) return null;
    if (shuffleRef.current && q.length > 1) {
      let n;
      do { n = Math.floor(Math.random() * q.length); } while (n === i);
      return n;
    }
    if (i + 1 < q.length) return i + 1;
    if (repeatRef.current === 'all') return 0;
    return auto ? null : 0;
  };

  const next = useCallback(() => {
    const n = pickNext(false);
    if (n !== null) loadIndex(queueRef.current, n);
  }, [loadIndex]);

  const prev = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !queueRef.current.length) return;
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    const i = indexRef.current;
    const p = i > 0 ? i - 1 : repeatRef.current === 'all' ? queueRef.current.length - 1 : 0;
    loadIndex(queueRef.current, p);
  }, [loadIndex]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || indexRef.current < 0) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  }, []);

  const playQueue = useCallback((songs, startIndex = 0, opts = {}) => {
    if (!songs?.length) return;
    recordRef.current = opts.record !== false;
    const idx = shuffleRef.current && opts.startRandom ? Math.floor(Math.random() * songs.length) : startIndex;
    loadIndex(songs, Math.min(Math.max(idx, 0), songs.length - 1));
  }, [loadIndex]);

  /** Play a song within an optional queue. Clicking the current song toggles play/pause. */
  const playSong = useCallback((song, list, opts = {}) => {
    const cur = queueRef.current[indexRef.current];
    if (cur && cur.id === song.id && !opts.restart) {
      togglePlay();
      return;
    }
    let q = list?.length ? list : [song];
    let idx = q.findIndex((s) => s.id === song.id);
    if (idx < 0) { q = [song, ...q]; idx = 0; }
    recordRef.current = opts.record !== false;
    loadIndex(q, idx);
  }, [loadIndex, togglePlay]);

  const jumpTo = useCallback((i) => loadIndex(queueRef.current, i), [loadIndex]);

  const addToQueue = useCallback((song) => {
    if (!queueRef.current.length) {
      recordRef.current = true;
      loadIndex([song], 0);
      return;
    }
    const q = [...queueRef.current, song];
    queueRef.current = q;
    setQueue(q);
    toast.success('Added to queue');
  }, [loadIndex]);

  const seek = useCallback((t) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(t)) return;
    audio.currentTime = Math.max(0, t);
    setCurrentTime(audio.currentTime);
  }, []);

  const setVolume = useCallback((v) => {
    const vol = Math.min(1, Math.max(0, v));
    setVolumeState(vol);
    localStorage.setItem(VOLUME_KEY, String(vol));
    if (vol > 0) setIsMuted(false);
  }, []);

  const toggleMute = useCallback(() => setIsMuted((m) => !m), []);
  const toggleShuffle = useCallback(() => setShuffle((s) => !s), []);
  const cycleRepeat = useCallback(() => setRepeat((r) => (r === 'off' ? 'all' : r === 'all' ? 'one' : 'off')), []);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
      audio.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Audio element events (registered once)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const onWaiting = () => setIsBuffering(true);
    const onCanPlay = () => setIsBuffering(false);
    const onPlaying = () => {
      setIsBuffering(false);
      errStreakRef.current = 0;
      if (!countedRef.current) {
        countedRef.current = true;
        const song = queueRef.current[indexRef.current];
        if (song) recApi.recordPlay(song.id).catch(() => {}); // fire-and-forget
      }
    };
    const onEnded = () => {
      if (repeatRef.current === 'one') {
        countedRef.current = !recordRef.current; // a replay counts again
        audio.currentTime = 0;
        audio.play().catch(() => {});
        return;
      }
      const n = pickNext(true);
      if (n === null) {
        setIsPlaying(false);
        return;
      }
      loadIndex(queueRef.current, n);
    };
    const onError = () => {
      if (!audio.getAttribute('src')) return;
      setIsBuffering(false);
      setError("This track can't be played");
      toast.error("This track can't be played", { id: 'play-error' });
      errStreakRef.current += 1;
      if (errStreakRef.current >= queueRef.current.length) {
        setIsPlaying(false);
        return;
      }
      const n = pickNext(true);
      if (n !== null) loadIndex(queueRef.current, n);
    };

    const events = {
      play: onPlay, pause: onPause, timeupdate: onTime, loadedmetadata: onMeta, durationchange: onMeta,
      waiting: onWaiting, canplay: onCanPlay, playing: onPlaying, ended: onEnded, error: onError,
    };
    Object.entries(events).forEach(([k, fn]) => audio.addEventListener(k, fn));
    return () => Object.entries(events).forEach(([k, fn]) => audio.removeEventListener(k, fn));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadIndex]);

  const current = currentIndex >= 0 ? queue[currentIndex] || null : null;

  fnsRef.current = { next, prev, togglePlay, toggleMute, seek };

  // Media Session metadata
  useEffect(() => {
    if (!('mediaSession' in navigator) || !current) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: current.title,
      artist: current.artistName || '',
      album: current.genreName || '',
      artwork: current.coverUrl ? [{ src: current.coverUrl, sizes: '512x512' }] : [],
    });
  }, [current]);

  // Media Session hardware keys
  useEffect(() => {
    if (!('mediaSession' in navigator)) return undefined;
    const ms = navigator.mediaSession;
    const set = (action, handler) => { try { ms.setActionHandler(action, handler); } catch { /* unsupported */ } };
    set('play', () => audioRef.current?.play().catch(() => {}));
    set('pause', () => audioRef.current?.pause());
    set('previoustrack', () => fnsRef.current.prev());
    set('nexttrack', () => fnsRef.current.next());
    return () => ['play', 'pause', 'previoustrack', 'nexttrack'].forEach((a) => set(a, null));
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (isTyping(e.target) || e.ctrlKey || e.metaKey || e.altKey) return;
      const f = fnsRef.current;
      const audio = audioRef.current;
      if (e.code === 'Space') {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') return; // keep native button behaviour
        e.preventDefault();
        f.togglePlay();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (e.shiftKey) f.next();
        else if (audio) f.seek(audio.currentTime + 5);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (e.shiftKey) f.prev();
        else if (audio) f.seek(audio.currentTime - 5);
      } else if (e.key.toLowerCase() === 'm') {
        f.toggleMute();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const value = useMemo(
    () => ({
      queue, currentIndex, current, isPlaying, duration, volume, isMuted, shuffle, repeat, isBuffering, error,
      playSong, playQueue, togglePlay, next, prev, seek, setVolume, toggleMute, toggleShuffle, cycleRepeat, addToQueue, jumpTo,
    }),
    [queue, currentIndex, current, isPlaying, duration, volume, isMuted, shuffle, repeat, isBuffering, error,
      playSong, playQueue, togglePlay, next, prev, seek, setVolume, toggleMute, toggleShuffle, cycleRepeat, addToQueue, jumpTo]
  );
  const timeValue = useMemo(() => ({ currentTime }), [currentTime]);

  return (
    <PlayerCtx.Provider value={value}>
      <TimeCtx.Provider value={timeValue}>
        {children}
        <audio ref={audioRef} preload="metadata" />
      </TimeCtx.Provider>
    </PlayerCtx.Provider>
  );
}
