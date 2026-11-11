import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useAsync from '../hooks/useAsync';
import usePageTitle from '../hooks/usePageTitle';
import * as recApi from '../api/recommendations';
import { getErrorMessage } from '../api/client';
import Logo from '../components/ui/Logo';
import GradientButton from '../components/ui/GradientButton';
import ErrorState from '../components/ui/ErrorState';
import { GridSkeleton } from '../components/ui/Skeleton';
import { ArtistPicker, GenrePicker, SongPicker, toggleId } from '../components/onboarding/Pickers';
import cn from '../utils/cn';

const STEPS = ['Welcome', 'Songs', 'Artists', 'Genres'];
const MIN_SONGS = 3;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function Stepper({ step }) {
  return (
    <nav aria-label="Progress" className="mb-8">
      <div className="relative flex justify-between">
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-white/10" />
        <motion.div className="absolute top-4 left-4 h-0.5 bg-brand" animate={{ width: `calc(${(step / (STEPS.length - 1)) * 100}% - ${(step / (STEPS.length - 1)) * 32}px)` }} transition={{ duration: 0.4 }} />
        {STEPS.map((label, i) => (
          <div key={label} className="relative flex flex-col items-center gap-2" aria-current={i === step ? 'step' : undefined}>
            <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition', i < step ? 'bg-brand text-white' : i === step ? 'bg-brand text-white shadow-glow' : 'bg-elevated text-ink-muted border border-white/10')}>
              {i < step ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className={cn('text-xs', i === step ? 'text-ink' : 'text-ink-muted')}>{label}</span>
          </div>
        ))}
      </div>
    </nav>
  );
}

function BuildingScreen() {
  return (
    <div className="fixed inset-0 z-[95] bg-base flex flex-col items-center justify-center gap-8" role="status" aria-live="polite">
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 rounded-full bg-brand blur-2xl opacity-50" />
        <div className="absolute inset-0 rounded-full border-4 border-white/10 border-t-primary-400 border-r-accent-pink" style={{ animation: 'spin-slow 1.1s linear infinite' }} />
        <Sparkles className="absolute inset-0 m-auto w-10 h-10 text-white" />
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold">Building your taste profile…</h2>
        <p className="text-ink-muted mt-1">Matching your picks with our catalogue</p>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  usePageTitle('Welcome');
  const { user, setOnboarded } = useAuth();
  const navigate = useNavigate();
  const options = useAsync(() => recApi.onboardingOptions(), []);
  const [step, setStep] = useState(0);
  const [songIds, setSongIds] = useState([]);
  const [artistIds, setArtistIds] = useState([]);
  const [genreIds, setGenreIds] = useState([]);
  const [building, setBuilding] = useState(false);

  const canNext = [true, songIds.length >= MIN_SONGS, artistIds.length >= 1, genreIds.length >= 1][step];
  const last = step === STEPS.length - 1;
  const data = options.data;

  const finish = async () => {
    if (building) return;
    setBuilding(true);
    try {
      await Promise.all([
        recApi.submitOnboarding({ favoriteSongIds: songIds, favoriteArtistIds: artistIds, genreIds }),
        sleep(1300),
      ]);
      navigate('/home', { replace: true, state: { celebrate: true } });
      setOnboarded();
    } catch (err) {
      setBuilding(false);
      toast.error(getErrorMessage(err));
    }
  };

  const counter = [null, `Selected ${songIds.length} / min ${MIN_SONGS}`, `Selected ${artistIds.length} / min 1`, `Selected ${genreIds.length} / min 1`][step];

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 pb-32">
      {building && <BuildingScreen />}
      <Logo to="#" className="mb-6 pointer-events-none" />
      <div className="w-full max-w-4xl glass p-5 sm:p-8">
        <Stepper step={step} />

        {options.error && !data ? (
          <ErrorState message={getErrorMessage(options.error)} onRetry={options.reload} />
        ) : options.loading && !data ? (
          <GridSkeleton count={8} />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22 }}>
              {step === 0 && (
                <div className="text-center py-10">
                  <motion.div initial={{ scale: 0.6, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200 }} className="w-20 h-20 mx-auto rounded-3xl bg-brand flex items-center justify-center shadow-glow mb-6">
                    <Sparkles className="w-10 h-10 text-white" />
                  </motion.div>
                  <h1 className="text-4xl sm:text-5xl font-extrabold">Welcome, <span className="text-gradient">{user?.username}</span>!</h1>
                  <p className="text-ink-muted mt-4 max-w-md mx-auto">Let&apos;s make your music experience personal. Pick a few songs, artists and genres you love — it takes about a minute.</p>
                </div>
              )}
              {step === 1 && (
                <>
                  <h1 className="text-2xl sm:text-3xl font-extrabold">Pick your favorite songs</h1>
                  <p className="text-ink-muted text-sm mt-1 mb-5">Choose at least {MIN_SONGS}. Tap the play icon to preview.</p>
                  <SongPicker songs={data?.songs} selected={songIds} onToggle={(id) => setSongIds((l) => toggleId(l, id))} />
                </>
              )}
              {step === 2 && (
                <>
                  <h1 className="text-2xl sm:text-3xl font-extrabold">Who do you listen to?</h1>
                  <p className="text-ink-muted text-sm mt-1 mb-5">Choose at least one artist.</p>
                  <ArtistPicker artists={data?.artists} selected={artistIds} onToggle={(id) => setArtistIds((l) => toggleId(l, id))} />
                </>
              )}
              {step === 3 && (
                <>
                  <h1 className="text-2xl sm:text-3xl font-extrabold">What&apos;s your vibe?</h1>
                  <p className="text-ink-muted text-sm mt-1 mb-5">Choose at least one genre.</p>
                  <GenrePicker genres={data?.genres} selected={genreIds} onToggle={(id) => setGenreIds((l) => toggleId(l, id))} />
                </>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <div className="fixed bottom-[88px] lg:bottom-[104px] inset-x-0 z-40 px-4">
        <div className="max-w-4xl mx-auto glass-strong rounded-2xl p-3 flex items-center justify-between gap-3">
          <GradientButton variant="ghost" onClick={() => setStep((s) => s - 1)} disabled={step === 0 || building} icon={ArrowLeft}>Back</GradientButton>
          <span className="text-sm text-ink-muted tabular-nums" aria-live="polite">{counter}</span>
          {last ? (
            <GradientButton onClick={finish} disabled={!canNext || !data} loading={building}>Generate my profile</GradientButton>
          ) : (
            <GradientButton onClick={() => setStep((s) => s + 1)} disabled={!canNext || (step > 0 && !data)}>
              {step === 0 ? 'Continue' : 'Next'} <ArrowRight className="w-4 h-4" />
            </GradientButton>
          )}
        </div>
      </div>
    </div>
  );
}
