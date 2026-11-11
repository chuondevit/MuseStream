import { useCallback, useEffect, useRef, useState } from 'react';

/** Pagination helper for Spring-style page responses ({content, last, totalElements}). */
export default function usePaged(fetchPage, deps = []) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [last, setLast] = useState(true);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reqId = useRef(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const load = useCallback(async (p, reset) => {
    const id = ++reqId.current;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchPage(p);
      if (id !== reqId.current) return;
      const content = res?.content || [];
      setItems((prev) => (reset ? content : [...prev, ...content]));
      setPage(p);
      setLast(res?.last !== false);
      setTotal(res?.totalElements ?? content.length);
    } catch (e) {
      if (id === reqId.current) setError(e);
    } finally {
      if (id === reqId.current) setLoading(false);
    }
  }, deps);

  useEffect(() => {
    load(0, true);
  }, [load]);

  return {
    items, loading, error, last, total,
    loadMore: () => load(page + 1, false),
    reload: () => load(0, true),
  };
}
