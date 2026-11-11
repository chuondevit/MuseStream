import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Portal-based dropdown so menus are never clipped by scrollers/tables.
 * trigger(props) -> element ; children({ close }) -> menu content
 */
export default function Dropdown({ trigger, children, align = 'right', width = 232 }) {
  const [open, setOpen] = useState(false);
  const [style, setStyle] = useState({});
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  const toggle = (e) => {
    e?.stopPropagation();
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      const left = align === 'right' ? Math.max(8, r.right - width) : Math.min(r.left, window.innerWidth - width - 8);
      const below = window.innerHeight - r.bottom;
      setStyle(
        below < 320
          ? { left, bottom: window.innerHeight - r.top + 6, width }
          : { left, top: r.bottom + 6, width }
      );
    }
    setOpen((o) => !o);
  };

  useEffect(() => {
    if (!open) return undefined;
    const close = () => setOpen(false);
    const onDown = (e) => {
      if (menuRef.current?.contains(e.target) || btnRef.current?.contains(e.target)) return;
      close();
    };
    const onKey = (e) => e.key === 'Escape' && close();
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', close);
    window.addEventListener('scroll', close, true);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', close);
      window.removeEventListener('scroll', close, true);
    };
  }, [open]);

  return (
    <>
      {trigger({ ref: btnRef, onClick: toggle, 'aria-haspopup': 'menu', 'aria-expanded': open })}
      {open &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={style}
            onClick={(e) => e.stopPropagation()}
            className="fixed z-[80] max-h-[70vh] overflow-y-auto rounded-2xl glass-strong p-1.5 shadow-2xl"
          >
            {children({ close: () => setOpen(false) })}
          </div>,
          document.body
        )}
    </>
  );
}

export function MenuItem({ icon: Icon, children, onClick, danger, ...rest }) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 min-h-[44px] rounded-xl text-left text-sm transition hover:bg-white/10 ${danger ? 'text-danger' : 'text-ink'}`}
      {...rest}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0 text-ink-muted" aria-hidden="true" />}
      <span className="truncate flex-1">{children}</span>
    </button>
  );
}
