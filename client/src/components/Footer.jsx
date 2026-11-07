/**
 * COMPONENT : Footer
 * OWNER     : Shared (first version: Ahmed Taher)
 * NOTES     : Address and phone come from src/config/brand.js and are hidden while empty.
 */
import { Link } from "react-router-dom";
import { BRAND } from "../config/brand.js";
import Logo from "./Logo.jsx";

const YEAR = new Date().getFullYear();

export default function Footer() {
  const hasContact = BRAND.address || BRAND.phone || BRAND.email;

  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div>
          <Logo />
          <p className="site-footer__tagline">{BRAND.tagline}</p>
        </div>

        <nav aria-label="Footer">
          <h2 className="site-footer__title">Explore</h2>
          <ul>
            <li>
              <Link to="/menu">Menu</Link>
            </li>
            <li>
              <Link to="/reservation">Reserve a table</Link>
            </li>
            <li>
              <Link to="/about">About us</Link>
            </li>
            <li>
              <Link to="/login">Log in</Link>
            </li>
          </ul>
        </nav>

        {hasContact && (
          <div>
            <h2 className="site-footer__title">Visit and contact</h2>
            <address>
              {BRAND.address && <p className="mb-2">{BRAND.address}</p>}
              {BRAND.phone && (
                <p className="mb-2">
                  <a href={`tel:${BRAND.phone.replace(/\s/g, "")}`}>
                    {BRAND.phone}
                  </a>
                </p>
              )}
              {BRAND.email && (
                <p className="mb-0">
                  <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
                </p>
              )}
            </address>
          </div>
        )}
      </div>

      <p className="site-footer__legal">
        &copy; {YEAR} {BRAND.name}. Graduation project, Digital Egypt Pioneers
        Initiative.
      </p>
    </footer>
  );
}
