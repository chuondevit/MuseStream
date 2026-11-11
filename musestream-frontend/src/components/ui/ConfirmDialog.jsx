import Modal from './Modal';
import GradientButton from './GradientButton';

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', loading, onConfirm, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-sm">
      <p className="text-sm text-ink-muted mb-6">{message}</p>
      <div className="flex justify-end gap-2">
        <GradientButton variant="ghost" onClick={onClose}>Cancel</GradientButton>
        <GradientButton variant="danger" loading={loading} onClick={onConfirm}>{confirmLabel}</GradientButton>
      </div>
    </Modal>
  );
}
