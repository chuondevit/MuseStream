import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import GradientButton from '../ui/GradientButton';
import * as playlistsApi from '../../api/playlists';
import { getErrorMessage, getFieldErrors } from '../../api/client';
import { usePlaylists } from '../../context/PlaylistsContext';

const EMPTY = { name: '', description: '', coverUrl: '', isPublic: false };

/** Create (no `playlist` prop) or edit (with `playlist`). */
export default function PlaylistModal({ open, onClose, playlist, onSaved }) {
  const { refresh } = usePlaylists();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setErrors({});
      setForm(playlist
        ? { name: playlist.name || '', description: playlist.description || '', coverUrl: playlist.coverUrl || '', isPublic: !!playlist.isPublic }
        : EMPTY);
    }
  }, [open, playlist]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (saving) return;
    if (!form.name.trim()) return setErrors({ name: 'Name is required' });
    setSaving(true);
    const body = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      coverUrl: form.coverUrl.trim() || undefined,
      isPublic: form.isPublic,
    };
    try {
      const saved = playlist ? await playlistsApi.update(playlist.id, body) : await playlistsApi.create(body);
      toast.success(playlist ? 'Playlist updated' : 'Playlist created');
      refresh();
      onSaved?.(saved);
      onClose();
    } catch (err) {
      const fe = getFieldErrors(err);
      if (Object.keys(fe).length) setErrors(fe);
      else toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full min-h-[44px] rounded-xl bg-elevated border border-white/10 px-3 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/40';
  return (
    <Modal open={open} onClose={onClose} title={playlist ? 'Edit playlist' : 'New playlist'}>
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="pl-name" className="text-xs text-ink-muted">Name *</label>
          <input id="pl-name" value={form.name} onChange={set('name')} className={inputCls} maxLength={100} />
          {errors.name && <p className="text-xs text-danger mt-1">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="pl-desc" className="text-xs text-ink-muted">Description</label>
          <textarea id="pl-desc" value={form.description} onChange={set('description')} rows={3} className={`${inputCls} py-2`} />
          {errors.description && <p className="text-xs text-danger mt-1">{errors.description}</p>}
        </div>
        <div>
          <label htmlFor="pl-cover" className="text-xs text-ink-muted">Cover image URL</label>
          <input id="pl-cover" value={form.coverUrl} onChange={set('coverUrl')} placeholder="https://…" className={inputCls} />
          {errors.coverUrl && <p className="text-xs text-danger mt-1">{errors.coverUrl}</p>}
        </div>
        <label className="flex items-center justify-between gap-4 min-h-[44px] cursor-pointer">
          <span className="text-sm">Public playlist</span>
          <input type="checkbox" checked={form.isPublic} onChange={set('isPublic')} className="w-5 h-5 accent-primary-500" />
        </label>
        <div className="flex justify-end gap-2 pt-2">
          <GradientButton type="button" variant="ghost" onClick={onClose}>Cancel</GradientButton>
          <GradientButton type="submit" loading={saving}>{playlist ? 'Save changes' : 'Create playlist'}</GradientButton>
        </div>
      </form>
    </Modal>
  );
}
