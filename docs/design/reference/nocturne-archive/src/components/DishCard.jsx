/**
 * COMPONENT : DishCard
 * OWNER     : Ahmed Taher (suggested)
 * PURPOSE   : One dish tile, used on the home page and the menu page.
 * PROPS     : item - a menuItems object (id, name, description, basePrice, image,
 *             isVegetarian, isAvailable)
 * NOTES     : - The whole tile links to /menu/:id (sizes, extras, and "Add to cart" live there).
 *             - Unavailable dishes are dimmed with an "Unavailable" label.
 *             - A missing photo falls back to /images/placeholder.jpg.
 *             - Wrap several tiles in <div className="dish-grid"> for the responsive grid.
 */
import { Link } from "react-router-dom";
import { formatPrice } from "../utils/formatPrice.js";

const FALLBACK_IMAGE = "/images/placeholder.jpg";

export default function DishCard({ item }) {
  const unavailable = !item.isAvailable;

  function useFallback(event) {
    // Guard so a missing fallback file cannot cause an endless loop.
    if (!event.currentTarget.src.endsWith(FALLBACK_IMAGE)) {
      event.currentTarget.src = FALLBACK_IMAGE;
    }
  }

  return (
    <article className={`dish${unavailable ? " dish--off" : ""}`}>
      <Link className="dish__link" to={`/menu/${item.id}`}>
        <div className="dish__media">
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            onError={useFallback}
          />
        </div>
        <div className="dish__top">
          <h3 className="dish__name">{item.name}</h3>
          <p className="dish__price">{formatPrice(item.basePrice)}</p>
        </div>
        <p className="dish__desc">{item.description}</p>
      </Link>
      {unavailable && <span className="dish__flag">Unavailable</span>}
      {item.isVegetarian && (
        <span className="dish__veg">
          <span aria-hidden="true">V</span>
          <span className="visually-hidden">Vegetarian</span>
        </span>
      )}
    </article>
  );
}
