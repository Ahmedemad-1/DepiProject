/**
 * COMPONENT : Logo
 * OWNER     : Ahmed Taher (suggested)
 * PURPOSE   : The brand lockup: a square gold monogram + the restaurant name.
 *             The name and the monogram letter come from src/config/brand.js.
 * USAGE     : <Logo />   (it links to the home page)
 */
import { Link } from "react-router-dom";
import { BRAND } from "../config/brand.js";

export default function Logo() {
  return (
    <Link className="brand" to="/" aria-label={`${BRAND.name}, home`}>
      <span className="brand__mark" aria-hidden="true">
        {BRAND.name.charAt(0)}
      </span>
      <span className="brand__word">{BRAND.name}</span>
    </Link>
  );
}
