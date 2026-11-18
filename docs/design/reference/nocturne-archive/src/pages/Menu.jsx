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
import DishCard from "../components/DishCard.jsx";
import Loader from "../components/Loader.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { getMenuItems } from "../services/api.js";

// Starter example: loads the menu from the API and shows it as a grid of DishCard.
// Add CategoryTabs, SearchBar, and FilterBar here (see the header comment above).
export default function Menu() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    getMenuItems()
      .then((data) => {
        setItems(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div>
      <h1 className="page-title">Menu</h1>
      {status === "loading" && <Loader text="Loading the menu..." />}
      {status === "error" && (
        <ErrorMessage message="We could not load the menu. Check that the mock API is running (npm run mock)." />
      )}
      {status === "ready" && (
        <div className="dish-grid">
          {items.map((item) => (
            <DishCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
