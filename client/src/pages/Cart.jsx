/**
 * PAGE   : Cart
 * ROUTE  : /cart
 * ACCESS : Public (login is required only at checkout)
 * OWNER  : Shorouk (suggested - change if the team reassigns)
 *
 * WHAT TO BUILD
 *  - List of CartItem (image, name, size, extras, quantity controls, line total, remove button)
 *  - OrderSummary with the total, 'Clear cart' button, and 'Proceed to checkout' button -> /checkout
 *  - Friendly empty-cart message with a link to /menu
 *
 * DATA / API  (functions live in src/services/api.js)
 *  - useCart()  (items, updateQuantity, removeItem, clearCart, total)
 *
 * RULES  (full list: CLAUDE.md section 10)
 *  - Total is computed from the items, never stored
 *  - Cart persists in localStorage (handled in CartContext)
 *
 * HOW TO FINISH
 *  1. Paste your code below and delete the PLACEHOLDER lines.
 *  2. Keep the default export and the file name (App.jsx already imports it).
 *  3. Run the project, test it on a phone-sized screen, then open a Pull Request.
 */
import PagePlaceholder from "../components/PagePlaceholder.jsx";

// ---- PLACEHOLDER (delete from here) -----------------------------------
export default function Cart() {
  return <PagePlaceholder title="Cart" route="/cart" />;
}
// ---- PLACEHOLDER (to here) ---------------------------------------------
