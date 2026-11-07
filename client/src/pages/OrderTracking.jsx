/**
 * PAGE   : OrderTracking
 * ROUTE  : /orders/:id
 * ACCESS : Customer (login required)
 * OWNER  : Shorouk (suggested - change if the team reassigns)
 *
 * WHAT TO BUILD
 *  - Read :id, load the order and its items
 *  - StatusStepper: received -> preparing -> ready -> picked_up (or a 'Cancelled' state)
 *  - Items list, pickup time, payment method, total
 *  - Auto-refresh every 30 seconds (setInterval inside useEffect, with cleanup)
 *  - 'Cancel order' button, visible only while status is 'received'
 *  - Show a success banner when the user arrives right after placing the order
 *
 * DATA / API  (functions live in src/services/api.js)
 *  - getOrder(id), getOrderItems(orderId), updateOrder(id, { status: 'cancelled' })
 *
 * RULES  (full list: CLAUDE.md section 10)
 *  - Only the owner of the order (or an admin) may view it
 *  - Cancel is allowed only before 'preparing'
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
export default function OrderTracking() {
  return <PagePlaceholder title="OrderTracking" route="/orders/:id" />;
}
// ---- PLACEHOLDER (to here) ---------------------------------------------
