/**
 * PAGE   : Checkout
 * ROUTE  : /checkout
 * ACCESS : Customer (login required)
 * OWNER  : Shorouk (suggested - change if the team reassigns)
 *
 * WHAT TO BUILD
 *  - Redirect to /cart if the cart is empty
 *  - Customer name and phone (prefilled from the logged-in user)
 *  - Pickup time: 'As soon as possible' or a time inside the opening hours (not in the past)
 *  - Payment: Cash on pickup OR Card (demo): card number, expiry, CVV with format validation
 *  - OrderSummary, and a 'Place order' button
 *  - On success: clear the cart and go to /orders/:id with a success message
 *
 * DATA / API  (functions live in src/services/api.js)
 *  - useAuth().user, useCart(), getSettings()
 *  - createOrder(order) then createOrderItem(item) for every cart line
 *
 * RULES  (full list: CLAUDE.md section 10)
 *  - Card number ending in 0000 is DECLINED: show an error and create NO order
 *  - NEVER store the card number, expiry, or CVV
 *  - Show the label: Demo mode - no real payment is processed
 *  - Order starts with status 'received'; order lines store the unit price (size + extras)
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
export default function Checkout() {
  return <PagePlaceholder title="Checkout" route="/checkout" />;
}
// ---- PLACEHOLDER (to here) ---------------------------------------------
