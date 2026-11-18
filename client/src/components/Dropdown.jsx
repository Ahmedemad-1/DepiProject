import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export default function Dropdown({ id, label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const box = useRef(null);
  const trigger = () => box.current.querySelector('.dd-btn');

  useEffect(() => {
    if (!open) return undefined;
    box.current.querySelector('[aria-selected="true"]')?.focus({ preventScroll: true });
    const away = e => { if (!box.current.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', away);
    return () => document.removeEventListener('pointerdown', away);
  }, [open]);

  const pick = i => { onChange(i); setOpen(false); trigger().focus(); };
  const onKeyDown = e => {
    if (!open) return;
    if (e.key === 'Tab') setOpen(false);
    else if (e.key === 'Escape') { setOpen(false); trigger().focus(); }
    else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const items = [...box.current.querySelectorAll('.dd-list button')];
      const next = items.indexOf(document.activeElement) + (e.key === 'ArrowDown' ? 1 : -1);
      items[(next + items.length) % items.length].focus();
    }
  };

  return (
    <div className="dd" ref={box} onKeyDown={onKeyDown}>
      <button type="button" id={id} className="dd-btn" aria-haspopup="listbox" aria-expanded={open} aria-label={`${label}: ${options[value]}`} onClick={() => setOpen(o => !o)}>
        <span>{options[value]}</span><ChevronDown size={16} aria-hidden="true" />
      </button>
      {open && (
        <ul className="dd-list" role="listbox" aria-label={label}>
          {options.map((o, i) => (
            <li key={o} role="presentation">
              <button type="button" role="option" aria-selected={i === value} onClick={() => pick(i)}>{o}{i === value && <Check size={15} aria-hidden="true" />}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
