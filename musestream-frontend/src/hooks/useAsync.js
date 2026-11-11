import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Runs an async function on mount / when deps change.
 * Keeps previous data while reloading; ignores stale responses.
 */
export default function useAsync(fn, deps = [], { immediate = true } = {}) {
  const [state, setState] = useState({ data: null, loading: immediate, error: null });
  const reqId = useRef(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(async () => {
    const id = ++reqId.current;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await fn();
      if (id === reqId.current) setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      if (id === reqId.current) setState((s) => ({ ...s, loading: false, error }));
      return undefined;
    }
  }, deps);

  useEffect(() => {
    if (immediate) run();
  }, [run, immediate]);

  const setData = useCallback(
    (updater) => setState((s) => ({ ...s, data: typeof updater === 'function' ? updater(s.data) : updater })),
    []
  );

  return { ...state, reload: run, setData };
}
