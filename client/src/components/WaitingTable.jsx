import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function TableScene() {
  return (
    <svg
      className="waiting-scene"
      viewBox="0 14 741 568"
      role="img"
      aria-label="A table set for two with wine glasses, a vase of olive branches and a wall clock"
    >
      <defs>
        <g id="waiting-glass" className="scene-glass">
          <path className="glass-stem" d="M-1.6 0V-31h3.2V0Z" />
          <ellipse className="glass-foot" rx="17" ry="2.4" />
          <path
            className="glass-bowl"
            d="M-14-72c-1 20 2 40 14 42 12-2 15-22 14-42Z"
          />
          <path
            className="glass-wine"
            d="M-13.6-50C-13-40-10-32 0-30c10-2 13-10 13.6-20Z"
          />
          <ellipse className="glass-rim" cy="-72" rx="14" ry="2.6" />
        </g>
        <g id="waiting-chair">
          <path
            className="scene-chair-legs"
            d="M98 456h14l-20 102H81Zm26 0h10l-8 94h-10Zm116 0h12l8 102h-10Zm28 0h10l7 94h-10Z"
          />
          <path className="scene-chair-seat" d="M96 446h184v13H96Z" />
          <path
            className="scene-chair"
            d="M64 294c-2-12 8-20 22-19 32 2 72 53 108 131l-16 10c-20 32-60 34-76 28-18-46-34-106-38-150Z"
          />
          <path
            className="scene-dark"
            d="M107 286c27 4 57 50 79 112-16 14-44 14-62 6-12-36-19-76-17-118Z"
          />
          <path className="scene-rimline" d="M107 286c27 4 57 50 79 112" />
          <path
            className="scene-chair"
            d="M180 412c30-8 62-6 90 1q11 3 11 15v16q0 6-7 6h-76q-20-2-20-22Z"
          />
        </g>
      </defs>

      <path
        className="scene-arch"
        d="M127 330v-65a243.5 243.5 0 0 1 487 0v65Z"
      />
      <path
        className="scene-floor"
        d="M0 556q370.5-12 741 0Q370.5 594 0 556Z"
      />
      <g transform="translate(370.5 100)">
        <circle className="scene-face" r="62.5" />
        <circle
          className="scene-tick"
          r="54"
          strokeWidth="7"
          strokeDasharray="2.6 25.67"
          strokeDashoffset="1.3"
          transform="rotate(-90)"
        />
        <path className="scene-hand" d="M0 0V-38M0 0 27.7-16" />
        <circle className="scene-ink" r="4" />
      </g>

      <use href="#waiting-chair" />
      <use href="#waiting-chair" transform="translate(741 0) scale(-1 1)" />

      <path
        className="scene-ink"
        d="M348.5 351c10.5 31 11.5 69 11.5 109s-4 62-22 78c-18 14-44 14-44 20q0 4 8 4h137q8 0 8-4c0-6-26-6-44-20-18-16-22-38-22-78s1-78 11.5-109Z"
      />
      <path
        className="scene-ink"
        d="M192 333c0-6 24-7 178.5-7s178.5 1 178.5 7c0 11-33 18-178.5 18S192 344 192 333Z"
      />

      <use href="#waiting-glass" x="319.5" y="331" />
      <use href="#waiting-glass" x="421.5" y="331" />
      <ellipse className="scene-plate" cx="264" cy="338" rx="49" ry="5" />
      <ellipse className="scene-plate" cx="477" cy="338" rx="49" ry="5" />

      <path
        className="scene-ink"
        d="M361 264h19c1 12 11 20 11 40v18q0 9-9 9h-23q-9 0-9-9v-18c0-20 10-28 11-40Z"
      />
      <path
        className="scene-mid"
        d="M379 266c1 12 12 19 12 38v18q0 9-9 9h-3Z"
      />
      <path
        className="scene-sprig"
        d="M370 264q-2-36-11-83M370 264q8-36 18-84M370 264q-22-28-50-58M370 264q-14-20-64-35M370 264q22-24 48-70M370 264q26-14 52-37M370 264q-26-16-40-56"
      />
      <g className="scene-leaves">
        <ellipse
          cx="355"
          cy="202"
          rx="5"
          ry="15"
          transform="rotate(-48 355 202)"
        />
        <ellipse
          cx="384"
          cy="196"
          rx="5"
          ry="15"
          transform="rotate(42 384 196)"
        />
        <ellipse
          cx="339"
          cy="215"
          rx="5"
          ry="15"
          transform="rotate(-66 339 215)"
        />
        <ellipse
          cx="323"
          cy="232"
          rx="5"
          ry="15"
          transform="rotate(-72 323 232)"
        />
        <ellipse
          cx="405"
          cy="211"
          rx="5"
          ry="15"
          transform="rotate(48 405 211)"
        />
        <ellipse
          cx="417"
          cy="235"
          rx="5"
          ry="15"
          transform="rotate(66 417 235)"
        />
        <ellipse
          cx="346"
          cy="232"
          rx="5"
          ry="15"
          transform="rotate(-36 346 232)"
        />
      </g>
    </svg>
  );
}

export default function WaitingTable() {
  return (
    <section
      className="sec light waiting-table"
      aria-labelledby="waiting-table-title"
    >
      <div className="container">
        <div className="waiting-table-layout">
          <div className="waiting-table-copy">
            <h2 id="waiting-table-title">Your table is waiting</h2>
            <p>
              Browse the menu, choose your favourites, and plan the perfect
              evening with us.
            </p>
            <Link to="/menu" className="btn-solid">
              Explore our menu{" "}
              <ArrowRight className="arrow" size={16} aria-hidden="true" />
            </Link>
          </div>
          <TableScene />
        </div>
      </div>
    </section>
  );
}
