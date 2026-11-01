/**
 * PAGE   : ManageOrders
 * ROUTE  : /admin/orders
 * ACCESS : Admin only
 * OWNER  : Heba Talaat (suggested - change if the team reassigns)
 *
 * WHAT TO BUILD
 *  - Table of all orders (number, customer, pickup time, total, StatusBadge), newest first, filter by status
 *  - Expand a row to see the order items
 *  - Buttons to move an order to the next status: received -> preparing -> ready -> picked_up
 *  - Cancel button only while status is 'received'
 *
 * DATA / API  (functions live in src/services/api.js)
 *  - getAllOrders(), getOrderItems(orderId), updateOrder(id, { status })
 *
 * RULES  (full list: CLAUDE.md section 10)
 *  - Use NEXT_ORDER_STATUS from utils/constants.js so invalid jumps are impossible
 *
 * HOW TO FINISH
 *  1. Paste your code below and delete the PLACEHOLDER lines.
 *  2. Keep the default export and the file name (App.jsx already imports it).
 *  3. Run the project, test it on a phone-sized screen, then open a Pull Request.
 */
import PagePlaceholder from "../../components/PagePlaceholder.jsx";

// ---- PLACEHOLDER (delete from here) -----------------------------------
export default function ManageOrders() {
  return <PagePlaceholder title="ManageOrders" route="/admin/orders" />;
}
// ---- PLACEHOLDER (to here) ---------------------------------------------
