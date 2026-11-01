/**
 * PAGE   : Menu
 * ROUTE  : /menu
 * ACCESS : Public
 * OWNER  : Ahmed Taher (suggested - change if the team reassigns)
 *
 * WHAT TO BUILD
 *  - CategoryTabs (All + 8 categories), SearchBar, filters (max price, vegetarian only)
 *  - Grid of DishCard; unavailable dishes shown dimmed with an 'Unavailable' label and disabled Add button
 *  - Read ?category=<id> from the URL (useSearchParams) to preselect a category
 *  - Loading, error, and empty ('no dishes found') states
 *
 * DATA / API  (functions live in src/services/api.js)
 *  - getMenuItems(), getCategories()  (json-server supports ?categoryId=4, ?isVegetarian=true, ?q=pizza)
 *
 * RULES  (full list: CLAUDE.md section 10)
 *  - Filtering can be done in the browser after one fetch
 *  - Clicking a card opens /menu/:id
 *
 * NOTE: the code below is a tiny working starter. Replace it with the real page.
 */
import { useEffect, useState } from "react";
import { getMenuItems } from "../services/api.js";
import { formatPrice } from "../utils/formatPrice.js";

// Starter example: loads menu items from the API (json-server for now)
// and shows them as a simple list. Replace with DishCard components.
export default function Menu() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getMenuItems()
      .then(setItems)
      .catch(() =>
        setError(
          "Could not load the menu. Is the mock API running? (npm run mock)",
        ),
      );
  }, []);

  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h1>Menu</h1>
      <ul className="list-group">
        {items.map((item) => (
          <li
            key={item.id}
            className="list-group-item d-flex justify-content-between"
          >
            <span>
              {item.name}
              {!item.isAvailable && " (Unavailable)"}
            </span>
            <span>{formatPrice(item.basePrice)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
