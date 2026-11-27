/**
 * PAGE    : Menu
 * ROUTE   : /menu  (optional ?category=<id>)
 * OWNER   : Ahmed Taher (suggested - change if the team reassigns)
 * PURPOSE : Full menu with category tabs, search, price band, vegetarian switch.
 * ORIGIN  : Velora design by [FRIEND'S NAME]; data and rules from the Nocturne system.
 * DATA    : useMenu() -> getMenuItems + getCategories. Filters run in the browser.
 * RULES   : unavailable dishes are listed but dimmed (DishCard); price bands are in US dollars (Velora's original bands).
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";
import DishCard from "../components/DishCard.jsx";
import { useMenu } from "../hooks/useMenu.js";
import { sitePhoto } from "../config/photos.js";
import Loader from "../components/Loader.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import Dropdown from "../components/Dropdown.jsx";

// Price bands in US dollars (Velora's original bands).
const BANDS = [
  [0, Infinity, "Any price"],
  [0, 10, "Under $10"],
  [10, 15, "$10 to $15"],
  [15, 20, "$15 to $20"],
  [20, Infinity, "Over $20"],
];

export default function Menu() {
  const {
    items: dishes,
    categories,
    loading,
    error,
    reload,
    categoryName,
  } = useMenu();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [band, setBand] = useState(0);
  const [veg, setVeg] = useState(false);
  // The category is kept in the URL as the category id: /menu?category=3 (Nocturne contract).
  const category = params.get("category") || "All";
  const setCategory = (c) => setParams(c === "All" ? {} : { category: c });

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    const [min, max] = BANDS[band];
    return dishes.filter(
      (d) =>
        (category === "All" || String(d.categoryId) === category) &&
        d.basePrice >= min &&
        d.basePrice < max &&
        (!veg || d.isVegetarian) &&
        d.name.toLowerCase().includes(q),
    );
  }, [dishes, query, band, veg, category]);

  const groups = !shown.length
    ? []
    : category === "All"
      ? [{ name: "", items: shown }]
      : [
          {
            ...categories.find((c) => String(c.id) === category),
            items: shown,
          },
        ];
  const filtersActive = Boolean(query || band || veg || category !== "All");
  const clearAll = () => {
    setQuery("");
    setBand(0);
    setVeg(false);
    setCategory("All");
  };

  const tabsRef = useRef(null);
  useEffect(() => {
    const box = tabsRef.current;
    const on = box?.querySelector(".tab.on");
    if (!on || box.scrollWidth <= box.clientWidth) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    box.scrollTo({
      left: on.offsetLeft - (box.clientWidth - on.offsetWidth) / 2,
      behavior: calm ? "auto" : "smooth",
    });
  }, [category]);

  const topRef = useRef(null);
  useEffect(() => {
    const el = topRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 200;
    if (window.scrollY > top) window.scrollTo({ top, behavior: "smooth" });
  }, [category, band, veg, query]);

  return (
    <main id="main">
      <section
        className="page-head menu-head"
        style={{ "--photo": `url(${sitePhoto.menuHead})` }}
      >
        <div className="container">
          <h1>Our Menu</h1>
          <p className="lead">
            Seasonal plates, fresh pasta and wood-fired favourites. Choose a
            course or search for a dish.
          </p>
        </div>
      </section>

      <section className="toolbar" aria-label="Menu filters">
        <div className="container">
          <div
            className="tabs"
            ref={tabsRef}
            role="group"
            aria-label="Filter by category"
          >
            {[
              { id: "All", name: "All" },
              ...categories.map((c) => ({ id: String(c.id), name: c.name })),
            ].map((c) => (
              <button
                key={c.id}
                type="button"
                className={`tab ${c.id === category ? "on" : ""}`}
                aria-pressed={c.id === category}
                onClick={() => setCategory(c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>
          <div className="tools">
            <div className="search">
              <Search size={17} aria-hidden="true" />
              <input
                type="text"
                className="form-control"
                placeholder="Search dishes by name"
                aria-label="Search dishes by name"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button
                  type="button"
                  className="icon-btn"
                  aria-label="Clear search"
                  onClick={() => setQuery("")}
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <Dropdown
              label="Filter by price"
              options={BANDS.map((b) => b[2])}
              value={band}
              onChange={setBand}
            />
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="veg"
                checked={veg}
                onChange={(e) => setVeg(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="veg">
                Vegetarian only
              </label>
            </div>
            <button
              type="button"
              className="btn-ghost sm"
              disabled={!filtersActive}
              onClick={clearAll}
            >
              Clear all filters
            </button>
          </div>
        </div>
      </section>

      <section className="container menu-wrap" ref={topRef}>
        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorMessage
            message={`We couldn’t load the menu. ${error}`}
            onRetry={reload}
          />
        ) : groups.length === 0 ? (
          <div className="state">
            <h2 className="h4">No dishes match your filters</h2>
            <p>Try another name, price range or course.</p>
            <button type="button" className="btn-solid sm" onClick={clearAll}>
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <p className="muted small mb-4" aria-live="polite">
              {shown.length} {shown.length === 1 ? "dish" : "dishes"}
            </p>
            {groups.map((g) => (
              <section key={g.name || "all"} className="menu-group">
                {g.name && (
                  <header className="group-head">
                    <h2>{g.name}</h2>
                    <p className="muted">{g.description}</p>
                  </header>
                )}
                <div className="row g-4">
                  {g.items.map((d) => (
                    <div key={d.id} className="col-sm-6 col-lg-4">
                      <DishCard
                        item={d}
                        category={categoryName(d.categoryId)}
                      />
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </>
        )}
      </section>
    </main>
  );
}
