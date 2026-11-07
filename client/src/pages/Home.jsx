/**
 * PAGE   : Home
 * ROUTE  : /
 * ACCESS : Public
 * OWNER  : Ahmed Taher (suggested - change if the team reassigns)
 *
 * WHAT IT SHOWS (the Nocturne design, adapted to a pickup + reservation restaurant)
 *  - Hero: full-bleed photo, headline, "Order for pickup" button, "Reserve a table" link
 *  - Cream band: opening hours, pickup and table facts, and the promise in one sentence
 *  - From the kitchen: four dishes from the menu (one from each of four categories)
 *  - Reservation band: photo, short invitation, contact details (shown when filled in)
 *
 * DATA / API  (functions live in src/services/api.js)
 *  - getMenuItems(), getSettings()
 *
 * TODO
 *  - Replace client/public/images/hero.jpg and about.jpg with real photos.
 *  - Fill in the address and phone in src/config/brand.js.
 *  - Optional: a "featured" flag in db.json instead of picking by category.
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DishCard from "../components/DishCard.jsx";
import Loader from "../components/Loader.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { BRAND } from "../config/brand.js";
import { getMenuItems, getSettings } from "../services/api.js";
import "../styles/home.css";

// Category ids in db.json: 2 Main Dishes, 3 Grills, 4 Pasta & Pizza, 5 Desserts.
const FEATURED_CATEGORIES = [2, 3, 4, 5];

function pickFeatured(items) {
  const available = items.filter((item) => item.isAvailable);
  const picks = [];
  for (const categoryId of FEATURED_CATEGORIES) {
    const found = available.find((item) => item.categoryId === categoryId);
    if (found) picks.push(found);
  }
  return picks.length > 0 ? picks : available.slice(0, 4);
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M14 7l5 5-5 5" />
    </svg>
  );
}

export default function Home() {
  const [picks, setPicks] = useState([]);
  const [settings, setSettings] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getMenuItems(), getSettings()])
      .then(([items, config]) => {
        if (cancelled) return;
        setPicks(pickFeatured(items));
        setSettings(config);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  function retry() {
    setStatus("loading");
    setAttempt((n) => n + 1);
  }

  const hours = settings
    ? `${settings.openingHours.open} \u2013 ${settings.openingHours.close}`
    : null;
  const maxParty = settings?.reservation?.maxPartySize;

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <img className="hero__image" src="/images/hero.jpg" alt="" />
        <div className="hero__overlay" />

        <div className="hero__copy">
          <h1 className="t-display hero__title" id="hero-title">
            <span>A table for tonight,</span>
            <span className="t-gold">or dinner to go.</span>
          </h1>
          <p className="hero__lead">
            Browse the full menu, order for pickup, or reserve a table.
          </p>
          <div className="hero__actions">
            <Link className="btn btn-primary" to="/menu">
              Order for pickup
            </Link>
            <Link className="text-link" to="/reservation">
              Reserve a table <ArrowIcon />
            </Link>
          </div>
        </div>

        {hours && <span className="hero__hours">Open daily {hours}</span>}
      </section>

      <section className="band-cream" aria-label="How it works">
        <div className="band-cream__grid">
          <dl className="facts">
            <dt>Opening hours</dt>
            <dd>{hours ? `Every day, ${hours}` : "Every day"}</dd>
            <dt>Pickup</dt>
            <dd>Order online, collect at the restaurant</dd>
            <dt>Tables</dt>
            <dd>
              {maxParty
                ? `Reservations for 1 to ${maxParty} guests`
                : "Reservations for small and large groups"}
            </dd>
          </dl>
          <p className="statement">
            Order ahead and your food is ready when you arrive.{" "}
            <em>Reserve ahead and your table is waiting.</em>
          </p>
        </div>
      </section>

      <section className="picks" aria-labelledby="picks-title">
        <div className="section-head">
          <h2 className="t-title" id="picks-title">
            From the kitchen
          </h2>
          <Link className="text-link" to="/menu">
            See the full menu <ArrowIcon />
          </Link>
        </div>

        {status === "loading" && <Loader text="Loading the menu..." />}
        {status === "error" && (
          <ErrorMessage
            message="We could not load the menu. Check that the mock API is running (npm run mock), then try again."
            onRetry={retry}
          />
        )}
        {status === "ready" && (
          <div className="dish-grid">
            {picks.map((item) => (
              <DishCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      <section className="visit" aria-labelledby="visit-title">
        <div>
          <h2 className="t-title" id="visit-title">
            Dinner with company?
          </h2>
          <p className="visit__text">
            Choose a date, a time, and how many of you are coming. We confirm
            your table as soon as we see the request.
          </p>
          <Link className="btn btn-outline-primary" to="/reservation">
            Reserve a table
          </Link>
          {(BRAND.address || BRAND.phone) && (
            <address className="visit__contact">
              {BRAND.address && (
                <span className="d-block">{BRAND.address}</span>
              )}
              {BRAND.phone && <span className="d-block">{BRAND.phone}</span>}
            </address>
          )}
        </div>
        <img className="visit__image" src="/images/about.jpg" alt="" />
      </section>
    </>
  );
}
