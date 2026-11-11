const STYLES = {
  pop: ['#EC4899', '#8B5CF6', '🎤'],
  rock: ['#F97316', '#DC2626', '🎸'],
  'hip-hop': ['#FACC15', '#EA580C', '🎧'],
  'hip hop': ['#FACC15', '#EA580C', '🎧'],
  hiphop: ['#FACC15', '#EA580C', '🎧'],
  'r&b': ['#A855F7', '#6366F1', '🎷'],
  rnb: ['#A855F7', '#6366F1', '🎷'],
  edm: ['#22D3EE', '#3B82F6', '⚡'],
  electronic: ['#22D3EE', '#3B82F6', '⚡'],
  jazz: ['#F59E0B', '#B45309', '🎺'],
  classical: ['#94A3B8', '#475569', '🎻'],
  'lo-fi': ['#34D399', '#0D9488', '☕'],
  lofi: ['#34D399', '#0D9488', '☕'],
  'lo fi': ['#34D399', '#0D9488', '☕'],
};
const FALLBACK = [
  ['#8B5CF6', '#EC4899', '🎵'],
  ['#06B6D4', '#8B5CF6', '🎶'],
  ['#F472B6', '#FB923C', '🎼'],
  ['#34D399', '#22D3EE', '🎹'],
];

export function genreStyle(genre) {
  const key = (genre?.name || '').trim().toLowerCase();
  const [from, to, emoji] = STYLES[key] || FALLBACK[(genre?.id || 0) % FALLBACK.length];
  return { background: `linear-gradient(135deg, ${from}, ${to})`, emoji };
}
