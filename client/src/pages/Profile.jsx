/**
 * PAGE   : Profile
 * ROUTE  : /profile
 * ACCESS : Customer (login required)
 * OWNER  : Heba Talaat (suggested - change if the team reassigns)
 *
 * WHAT TO BUILD
 *  - User info (name, email, phone) and a Logout button
 *  - My reservations list with StatusBadge; allow cancelling a pending reservation
 *  - Link to /orders
 *
 * DATA / API  (functions live in src/services/api.js)
 *  - useAuth(), getMyReservations(userId), updateReservation(id, { status: 'cancelled' })
 *
 * RULES  (full list: CLAUDE.md section 10)
 *  - A customer must only see their own data
 *
 * HOW TO FINISH
 *  1. Paste your code below and delete the PLACEHOLDER lines.
 *  2. Keep the default export and the file name (App.jsx already imports it).
 *  3. Run the project, test it on a phone-sized screen, then open a Pull Request.
 */
import PagePlaceholder from "../components/PagePlaceholder.jsx";

// ---- PLACEHOLDER (delete from here) -----------------------------------
export default function Profile() {
  return <PagePlaceholder title="Profile" route="/profile" />;
}
// ---- PLACEHOLDER (to here) ---------------------------------------------
