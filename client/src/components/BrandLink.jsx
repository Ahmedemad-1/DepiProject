import Logo from './Logo.jsx';
import { BRAND } from '../config/brand.js';

function toTop(e) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  window.scrollTo({ top: 0, behavior: 'instant' });
}

export default function BrandLink({ size = 48 }) {
  return (
    <a href="/" className="brand" onClick={toTop} aria-label={BRAND.fullName} title={BRAND.fullName}>
      <Logo size={size} />
    </a>
  );
}
