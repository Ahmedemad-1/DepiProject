/**
 * PAGE   : Reservation
 * ROUTE  : /reservation
 * ACCESS : Customer (login required)
 * OWNER  : Heba Talaat (suggested - change if the team reassigns)
 *
 * WHAT TO BUILD
 *  - Form: date, time, party size (1-10), phone, note
 *  - Validation: date not in the past, time inside opening hours, party size 1-10, phone format 01XXXXXXXXX
 *  - Block a second pending reservation for the same user at the same date and time
 *  - On success show 'Reservation received - status: pending'
 *
 * DATA / API  (functions live in src/services/api.js)
 *  - getSettings(), getMyReservations(userId), createReservation(reservation)
 *
 * RULES  (full list: CLAUDE.md section 10)
 *  - New reservations always start with status 'pending'
 *  - Show clear error messages next to each field
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
export default function Reservation() {
  return <PagePlaceholder title="Reservation" route="/reservation" />;
}
// ---- PLACEHOLDER (to here) ---------------------------------------------
