import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, ListMusic, Sparkles, Play, SkipBack, SkipForward } from 'lucide-react';
import Logo from '../components/ui/Logo';
import GradientButton from '../components/ui/GradientButton';
import Equalizer from '../components/music/Equalizer';
import PlaysAreaChart from '../components/dashboard/PlaysAreaChart';
import usePageTitle from '../hooks/usePageTitle';

const reveal = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.5, ease: 'easeOut' } };

const FEATURES = [
  { icon: Sparkles, title: 'Personalized onboarding', text: 'Pick a few songs, artists and genres and your feed is tuned to you from the first minute.' },
  { icon: ListMusic, title: 'Smart, explainable picks', text: 'Rule-based recommendations that tell you exactly why a song was chosen.' },
  { icon: BarChart3, title: 'Playlists & library', text: 'Like songs, build playlists and review your listening in a personal dashboard.' },
];
const STEPS = ['Sign up', 'Tell us your taste', 'Get recommendations', 'Listen & improve'];

const sample = (() => {
  const base = [3, 6, 4, 9, 7, 12, 8];
  const now = new Date();
  return base.map((plays, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (6 - i));
    return { date: d.toISOString().slice(0, 10), plays };
  });
})();

function PlayerMock() {
  return (
    <motion.div
      initial={{ opacity: 0, rotateY: -25 }} animate={{ opacity: 1, rotateY: -14, rotateX: 6 }} transition={{ duration: 0.9 }}
      style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
      className="animate-float glass p-5 w-full max-w-sm mx-auto shadow-glow-lg"
      aria-hidden="true"
    >
      <img src="https://picsum.photos/seed/musestream-hero/480" alt="" className="w-full aspect-square object-cover rounded-xl" loading="lazy" />
      <div className="flex items-end justify-between mt-4">
        <div>
          <p className="font-bold">Midnight Drive</p>
          <p className="text-xs text-ink-muted">Neon Harbor</p>
        </div>
        <Equalizer className="h-6 w-6" />
      </div>
      <div className="mt-4 h-1.5 rounded-full bg-white/10 overflow-hidden"><motion.div className="h-full bg-brand" animate={{ width: ['10%', '85%'] }} transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse' }} /></div>
      <div className="flex items-center justify-center gap-5 mt-4 text-ink-muted">
        <SkipBack className="w-5 h-5" />
        <span className="w-12 h-12 rounded-full bg-brand flex items-center justify-center text-white"><Play className="w-5 h-5 fill-white ml-0.5" /></span>
        <SkipForward className="w-5 h-5" />
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
  usePageTitle('');
  return (
    <div className="min-h-screen overflow-x-hidden">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-base/40 border-b border-soft">
        <div className="max-w-content mx-auto flex items-center gap-6 px-4 sm:px-8 h-16">
          <Logo />
          <nav className="hidden md:flex gap-6 text-sm text-ink-muted ml-6" aria-label="Sections">
            <a href="#features" className="hover:text-ink">Features</a>
            <a href="#how" className="hover:text-ink">How it works</a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <GradientButton to="/login" variant="ghost">Log in</GradientButton>
            <GradientButton to="/register">Get started</GradientButton>
          </div>
        </div>
      </header>

      <section className="relative max-w-content mx-auto px-4 sm:px-8 pt-16 pb-20 sm:pt-24 grid lg:grid-cols-2 gap-12 items-center">
        <div className="absolute -top-20 -left-20 w-[420px] h-[420px] rounded-full bg-primary-500/25 blur-[120px] -z-10" />
        <div className="absolute top-40 right-0 w-[420px] h-[420px] rounded-full bg-accent-pink/20 blur-[120px] -z-10" />
        <div>
          <motion.span initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-primary-400">
            <Sparkles className="w-4 h-4" /> Personalized music, powered by you
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl sm:text-7xl font-extrabold leading-[1.05] mt-6">
            Your Music. <span className="text-gradient">Your Vibe.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-ink-muted mt-6 max-w-lg">
            MuseStream learns what you love and builds a feed that explains itself. Tell us your taste once, then just press play.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap gap-3 mt-8">
            <GradientButton to="/register" className="px-7 min-h-[52px]">Start Listening</GradientButton>
            <GradientButton to="/login" variant="glass" className="px-7 min-h-[52px]">I already have an account</GradientButton>
          </motion.div>
          <p className="mt-10 text-sm text-ink-muted">36+ tracks · 8 genres · 12 artists</p>
        </div>
        <PlayerMock />
      </section>

      <section id="features" className="max-w-content mx-auto px-4 sm:px-8 py-16">
        <motion.h2 {...reveal} className="text-3xl sm:text-4xl font-extrabold mb-10">Built around your taste</motion.h2>
        <div className="grid md:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} {...reveal} transition={{ ...reveal.transition, delay: i * 0.08 }} className="glass p-6 hover:shadow-glow transition-shadow">
              <span className="w-12 h-12 rounded-2xl bg-brand flex items-center justify-center mb-4"><f.icon className="w-6 h-6 text-white" /></span>
              <h3 className="text-lg font-bold">{f.title}</h3>
              <p className="text-sm text-ink-muted mt-2">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="how" className="max-w-content mx-auto px-4 sm:px-8 py-16">
        <motion.h2 {...reveal} className="text-3xl sm:text-4xl font-extrabold mb-10">How it works</motion.h2>
        <ol className="grid md:grid-cols-4 gap-6 relative">
          {STEPS.map((s, i) => (
            <motion.li key={s} {...reveal} transition={{ ...reveal.transition, delay: i * 0.1 }} className="relative">
              <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center font-bold shadow-glow mb-3">{i + 1}</div>
              {i < STEPS.length - 1 && <div className="hidden md:block absolute top-5 left-12 right-0 h-px bg-gradient-to-r from-primary-400/60 to-transparent" aria-hidden="true" />}
              <h3 className="font-bold">{s}</h3>
            </motion.li>
          ))}
        </ol>
      </section>

      <section className="max-w-content mx-auto px-4 sm:px-8 py-16 grid lg:grid-cols-2 gap-10 items-center">
        <motion.div {...reveal}>
          <h2 className="text-3xl sm:text-4xl font-extrabold">See your listening, clearly</h2>
          <p className="text-ink-muted mt-4 max-w-md">Weekly activity, top genres and artists, and an estimate of your listening time — all in a dashboard that updates as you play.</p>
        </motion.div>
        <motion.div {...reveal} className="glass p-5">
          <p className="text-sm font-semibold mb-3">Plays in the last 7 days <span className="text-ink-muted font-normal">(example)</span></p>
          <PlaysAreaChart data={sample} />
        </motion.div>
      </section>

      <section className="max-w-content mx-auto px-4 sm:px-8 py-16">
        <motion.div {...reveal} className="relative overflow-hidden rounded-3xl bg-brand p-10 sm:p-16 text-center shadow-glow-lg">
          <h2 className="text-3xl sm:text-5xl font-extrabold">Ready to hear what&apos;s next?</h2>
          <p className="mt-3 text-white/80">Create your free account and get your first picks in about a minute.</p>
          <Link to="/register" className="inline-flex items-center justify-center mt-8 min-h-[52px] px-8 rounded-xl bg-white text-base font-bold hover:scale-105 transition">Start Listening</Link>
        </motion.div>
      </section>

      <footer className="border-t border-soft py-8 text-center text-sm text-ink-muted">MuseStream – Graduation Project</footer>
    </div>
  );
}
