/**
 * COMPONENT : Footer
 * OWNER     : Ahmed Taher (suggested - change if the team reassigns)
 * PURPOSE   : Site footer (Velora design). All texts come from src/config/brand.js.
 */
import { Fragment } from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { BRAND } from "../config/brand.js";
import { telHref } from "../utils/links.js";
import { publicLinks } from "./Navbar.jsx";
import AddressLink from "./AddressLink.jsx";
import BrandLink from "./BrandLink.jsx";
import Email from "./Email.jsx";

const explore = [...publicLinks, ["/reservation", "Book a table"]];

function Tagline() {
  return (
    <p className="foot-tag">
      <span className="visually-hidden">{BRAND.tagline}</span>
      <span aria-hidden="true">
        {BRAND.tagline.split(" ").map((word, w) => (
          <Fragment key={word}>
            {w > 0 && " "}
            <span className="foot-word" style={{ "--w": w }}>
              {[...word].map((letter, i) => (
                <span key={i} style={{ "--i": i }}>
                  {letter}
                </span>
              ))}
            </span>
          </Fragment>
        ))}
      </span>
    </p>
  );
}

export default function Footer() {
  return (
    <footer className="foot">
      <div className="container">
        <div className="foot-grid">
          <div className="foot-brand">
            <BrandLink size={44} />
            <p>{BRAND.blurb}</p>
          </div>
          <nav aria-label="Footer">
            <h2 className="foot-h">Explore</h2>
            <ul className="list">
              {explore.map(([to, label]) => (
                <li key={to}>
                  <Link to={to}>{label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <address>
            <h2 className="foot-h">Visit us</h2>
            <ul className="list">
              <li>
                <MapPin size={16} aria-hidden="true" />
                <AddressLink />
              </li>
              <li>
                <Phone size={16} aria-hidden="true" />
                <a href={telHref(BRAND.phone)}>{BRAND.phone}</a>
              </li>
              <li>
                <Mail size={16} aria-hidden="true" />
                <Email address={BRAND.email} />
              </li>
            </ul>
          </address>
          <div>
            <h2 className="foot-h">Opening hours</h2>
            <ul className="list hours">
              {BRAND.hours.map(([day, time]) => (
                <li key={day}>
                  <span>{day}</span>
                  <span>{time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="foot-bar">
          <p>
            © {new Date().getFullYear()} {BRAND.fullName} All right reserved
          </p>
          <Tagline />
        </div>
      </div>
    </footer>
  );
}
