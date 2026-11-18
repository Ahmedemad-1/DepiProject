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
 * VELORA  : Velora has no page for this route, so this is a Velora-styled placeholder.
 * STYLE  : Velora design (rules: docs/design/ui-guidelines.md). Reuse Velora's classes from
 *           src/styles (theme.css tokens, .page-head, .sec, .btn-solid / .btn-ghost,
 *           .form-control, .state). New CSS goes in src/styles/app.css with NEW class names.
 *           Every page renders its own <main id="main">.
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
