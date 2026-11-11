import { motion } from 'framer-motion';
import Logo from './Logo';

export default function Splash() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-6 bg-base z-[100]" role="status" aria-label="Loading MuseStream">
      <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 1.6, repeat: Infinity }}>
        <Logo size="lg" to="#" className="pointer-events-none text-3xl" />
      </motion.div>
      <div className="w-40 h-1 rounded-full bg-white/10 overflow-hidden">
        <motion.div className="h-full w-1/2 bg-brand rounded-full" animate={{ x: ['-100%', '200%'] }} transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }} />
      </div>
    </div>
  );
}
