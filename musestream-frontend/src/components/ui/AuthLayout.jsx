import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Sparkles, ListMusic, BarChart3 } from 'lucide-react';
import Logo from './Logo';

const SLIDES = [
  { icon: Sparkles, title: 'Music that gets you', text: 'Tell us what you love once and get recommendations that explain themselves.' },
  { icon: ListMusic, title: 'Your library, your rules', text: 'Like songs, build playlists and pick up exactly where you left off.' },
  { icon: BarChart3, title: 'See your listening', text: 'A personal dashboard with your top genres, artists and weekly activity.' },
];

export default function AuthLayout({ title, subtitle, children, footer }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % SLIDES.length), 4500);
    return () => clearInterval(t);
  }, []);
  const Slide = SLIDES[i];

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <aside className="hidden lg:flex relative overflow-hidden flex-col justify-between p-12 bg-surface">
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-primary-500/30 blur-[120px]" />
        <div className="absolute -bottom-32 -right-24 w-[480px] h-[480px] rounded-full bg-accent-pink/25 blur-[120px]" />
        <Logo className="relative" />
        <div className="relative">
          {[0, 1, 2].map((n) => (
            <motion.img
              key={n}
              src={`https://picsum.photos/seed/muse-auth-${n}/240`}
              alt=""
              loading="lazy"
              className="absolute w-36 h-36 rounded-2xl object-cover shadow-glow border border-white/10"
              style={{ top: -230 + n * 20, left: n * 130 }}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5 + n, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
          <div className="mt-24 min-h-[140px]">
            <AnimatePresence mode="wait">
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
                <Slide.icon className="w-8 h-8 text-primary-400 mb-4" aria-hidden="true" />
                <h2 className="text-4xl font-extrabold mb-3">{Slide.title}</h2>
                <p className="text-ink-muted max-w-md">{Slide.text}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div className="relative flex gap-2" aria-hidden="true">
          {SLIDES.map((_, n) => (
            <span key={n} className={`h-1.5 rounded-full transition-all ${n === i ? 'w-8 bg-primary-400' : 'w-3 bg-white/20'}`} />
          ))}
        </div>
      </aside>

      <main className="flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink mb-8 min-h-[44px]">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass p-6 sm:p-8">
            <Logo className="lg:hidden mb-6" />
            <h1 className="text-3xl font-extrabold">{title}</h1>
            <p className="text-ink-muted text-sm mt-1 mb-6">{subtitle}</p>
            {children}
          </motion.div>
          <p className="text-center text-sm text-ink-muted mt-6">{footer}</p>
        </div>
      </main>
    </div>
  );
}
