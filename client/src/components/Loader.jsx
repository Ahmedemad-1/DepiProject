/**
 * COMPONENT : Loader
 * OWNER     : Ahmed Taher (suggested - change if the team reassigns)
 * PURPOSE   : Loading indicator (the Velora logo inside a spinning ring) for any page that fetches data.
 * ORIGIN    : Velora design by [FRIEND'S NAME], wired to the Nocturne data layer.
 * PROPS     : full?, className?, label? (screen-reader text), text? (alias of label, kept from the old Nocturne Loader)
 */
import { LogoMark } from "./Logo.jsx";

export default function Loader({
  full = false,
  className = "",
  label = "Loading",
  text,
}) {
  return (
    <div className={`loader ${full ? "full" : ""} ${className}`} role="status">
      <div className="loader-mark">
        <svg className="loader-ring" viewBox="0 0 100 100" aria-hidden="true">
          <circle className="loader-track" cx="50" cy="50" r="47" />
          <circle
            className="loader-arc"
            cx="50"
            cy="50"
            r="47"
            pathLength="100"
          />
        </svg>
        <LogoMark size={54} />
      </div>
      <span className="visually-hidden">{text || label}</span>
    </div>
  );
}
