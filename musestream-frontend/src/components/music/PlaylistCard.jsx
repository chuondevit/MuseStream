import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Lock } from 'lucide-react';
import PlaylistCover from './PlaylistCover';

export default function PlaylistCard({ playlist }) {
  return (
    <motion.div whileHover={{ y: -4 }}>
      <Link to={`/library/playlists/${playlist.id}`} className="block glass p-3 hover:shadow-glow hover:bg-white/[0.08] transition">
        <PlaylistCover playlist={playlist} />
        <h3 className="mt-3 text-sm font-semibold truncate font-sans tracking-normal">{playlist.name}</h3>
        <div className="flex items-center gap-2 text-xs text-ink-muted mt-0.5">
          <span>{playlist.songCount ?? 0} songs</span>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/10">
            {playlist.isPublic ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
            {playlist.isPublic ? 'Public' : 'Private'}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
