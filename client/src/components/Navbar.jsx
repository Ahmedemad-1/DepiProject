/**
 * COMPONENT : Navbar
 * OWNER     : Ahmed Taher (suggested - change if the team reassigns)
 * PURPOSE   : Top bar. Velora look + Nocturne behaviour.
 * BEHAVIOUR : links by role (visitor: Home, Menu, About, Contact; customer adds "My orders";
 *             admin adds "Admin"), cart count from CartContext, profile/log-in icon and a
 *             log-out button from AuthContext, active link, mobile menu (Esc closes, focus
 *             returns to the burger), solid background after scrolling.
 */
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { CalendarDays, LogOut, Menu as MenuIcon, Phone, ShoppingCart, User, X } from 'lucide-react';
import BrandLink from './BrandLink.jsx';
import { BRAND } from '../config/brand.js';
import { telHref } from '../utils/links.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

// Links every visitor sees (same four as the Velora design).
export const publicLinks = [['/', 'Home'], ['/menu', 'Menu'], ['/about', 'About'], ['/contact', 'Contact']];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount: cartCount } = useCart();
  const navLinks = [
    ...publicLinks,
    ...(user ? [['/orders', 'My orders']] : []),
    ...(user?.role === 'admin' ? [['/admin', 'Admin']] : []),
  ];
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const burger = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const desktop = window.matchMedia('(min-width: 992px)');
    const onKey = e => { if (e.key === 'Escape') { setOpen(false); burger.current?.focus(); } };
    const onChange = e => { if (e.matches) setOpen(false); };
    document.documentElement.classList.add('nav-locked');
    document.addEventListener('keydown', onKey);
    desktop.addEventListener('change', onChange);
    return () => {
      document.documentElement.classList.remove('nav-locked');
      document.removeEventListener('keydown', onKey);
      desktop.removeEventListener('change', onChange);
    };
  }, [open]);

  const closeOnLink = e => { if (e.target.closest('a')) setOpen(false); };

  return (
    <header className={`nav ${scrolled || open || pathname !== '/' ? 'solid' : ''}`}>
      <div className="container nav-in">
        <BrandLink size={48} />
        <nav id="site-nav" className={`links ${open ? 'open' : ''}`} aria-label="Main" onClick={closeOnLink}>
          {navLinks.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>)}
          <div className="panel-foot">
            <Link to="/reservation" className="btn-solid"><CalendarDays size={15} aria-hidden="true" /> Book a Table</Link>
            <a href={telHref(BRAND.phone)}><Phone size={15} aria-hidden="true" />{BRAND.phone}</a>
          </div>
        </nav>
        <div className="icons">
          <Link to="/reservation" className="btn-solid sm nav-cta"><CalendarDays size={15} aria-hidden="true" /> Book a Table</Link>
          <Link to="/cart" className="icon-btn" aria-label={cartCount ? `Cart, ${cartCount} items` : 'Cart'}>
            <ShoppingCart size={20} aria-hidden="true" />{cartCount > 0 && <span className="count">{cartCount}</span>}
          </Link>
          <Link to={user ? '/profile' : '/login'} className="icon-btn" aria-label={user ? 'My profile' : 'Log in'}><User size={20} aria-hidden="true" /></Link>
          {user && <button type="button" className="icon-btn" aria-label="Log out" onClick={logout}><LogOut size={20} aria-hidden="true" /></button>}
          <button ref={burger} type="button" className="icon-btn burger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen(o => !o)}>
            {open ? <X size={22} aria-hidden="true" /> : <MenuIcon size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );
}
