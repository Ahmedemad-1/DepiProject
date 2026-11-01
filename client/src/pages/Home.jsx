/**
 * PAGE   : Home
 * ROUTE  : /
 * ACCESS : Public
 * OWNER  : Ahmed Taher (suggested - change if the team reassigns)
 *
 * WHAT TO BUILD
 *  - Hero banner with the restaurant name (placeholder) and two buttons: 'Order now' -> /menu and 'Book a table' -> /reservation
 *  - Featured dishes: first 4-6 available dishes shown with DishCard
 *  - Categories row: each category links to /menu?category=<id>
 *  - Opening hours section (from settings)
 *
 * DATA / API  (functions live in src/services/api.js)
 *  - getMenuItems(), getCategories(), getSettings()
 *
 * RULES  (full list: CLAUDE.md section 10)
 *  - Show loading and error states
 *  - Unavailable dishes must not appear as featured
 *
 * NOTE: the code below is a tiny working starter. Replace it with the real page.
 */
export default function Home() {
  return (
    <div>
      <h1>Welcome</h1>
      <p>Home page placeholder. Replace with the real home page.</p>
    </div>
  );
}
