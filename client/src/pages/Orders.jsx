/**
 * PAGE   : Orders
 * ROUTE  : /orders
 * ACCESS : Customer (login required)
 * OWNER  : Shorouk (suggested - change if the team reassigns)
 *
 * WHAT TO BUILD
 *  - List of the logged-in user's orders, newest first, using OrderCard
 *  - Each card shows order number, date, total, StatusBadge, and a link to /orders/:id
 *  - Empty state with a link to /menu
 *
 * DATA / API  (functions live in src/services/api.js)
 *  - getMyOrders(userId)
 *
 * RULES  (full list: CLAUDE.md section 10)
 *  - A customer must only see their own orders
 *
 * STYLE  : dark Nocturne theme. Use Bootstrap classes and the helpers in src/styles/theme.css
 *           (page-title, t-title, text-link, btn btn-primary). Rules: docs/design/ui-guidelines.md
 *
 * HOW TO FINISH
 *  1. Paste your code below and delete the PLACEHOLDER lines.
 *  2. Keep the default export and the file name (App.jsx already imports it).
 *  3. Run the project, test it on a phone-sized screen, then open a Pull Request.
 */
import PagePlaceholder from "../components/PagePlaceholder.jsx";

// ---- PLACEHOLDER (delete from here) -----------------------------------
export default function Orders() {
  return <PagePlaceholder title="Orders" route="/orders" />;
}
// ---- PLACEHOLDER (to here) ---------------------------------------------
