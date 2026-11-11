/** Tiny class-name joiner: cn('a', cond && 'b', ['c']) */
export default function cn(...args) {
  return args.flat(Infinity).filter(Boolean).join(' ');
}
