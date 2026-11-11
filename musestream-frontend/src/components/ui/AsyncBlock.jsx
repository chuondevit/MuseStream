import ErrorState from './ErrorState';
import { getErrorMessage } from '../../api/client';

/**
 * Renders loading / error / empty / content for a useAsync() state.
 * `empty` = node shown for empty data (omit to render nothing).
 */
export default function AsyncBlock({ state, skeleton = null, empty = null, isEmpty, children }) {
  const { data, loading, error, reload } = state;
  if (loading && data == null) return skeleton;
  if (error && data == null) return <ErrorState message={getErrorMessage(error)} onRetry={reload} />;
  if (data == null) return empty;
  const emptyData = isEmpty ? isEmpty(data) : Array.isArray(data) && data.length === 0;
  if (emptyData) return empty;
  return children(data);
}
