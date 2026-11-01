/**
 * PAGE   : DishDetails
 * ROUTE  : /menu/:id
 * ACCESS : Public
 * OWNER  : Ahmed Taher (suggested - change if the team reassigns)
 *
 * WHAT TO BUILD
 *  - Read :id with useParams() and load the dish
 *  - Image, name, description, base price, vegetarian badge
 *  - SizeSelector (small/medium/large, default medium), ExtrasSelector (only if the dish has extras), QuantitySelector
 *  - Live unit price with calcUnitPrice() from utils/formatPrice.js
 *  - 'Add to cart' button (disabled if the dish is unavailable) then show a success message with a link to /cart
 *
 * DATA / API  (functions live in src/services/api.js)
 *  - getMenuItem(id)
 *  - useCart().addItem(...)
 *
 * RULES  (full list: CLAUDE.md section 10)
 *  - Same dish with another size or other extras is a separate cart line
 *  - Handle 'dish not found'
 *
 * HOW TO FINISH
 *  1. Paste your code below and delete the PLACEHOLDER lines.
 *  2. Keep the default export and the file name (App.jsx already imports it).
 *  3. Run the project, test it on a phone-sized screen, then open a Pull Request.
 */
import PagePlaceholder from "../components/PagePlaceholder.jsx";

// ---- PLACEHOLDER (delete from here) -----------------------------------
export default function DishDetails() {
  return <PagePlaceholder title="DishDetails" route="/menu/:id" />;
}
// ---- PLACEHOLDER (to here) ---------------------------------------------
