/**
 * PAGE   : ManageReservations
 * ROUTE  : /admin/reservations
 * ACCESS : Admin only
 * OWNER  : Heba Talaat (suggested - change if the team reassigns)
 *
 * WHAT TO BUILD
 *  - Table of all reservations (customer, date, time, party size, note, StatusBadge), sorted by date
 *  - Filter by status and by date
 *  - Confirm and Cancel buttons for pending reservations
 *
 * DATA / API  (functions live in src/services/api.js)
 *  - getAllReservations(), updateReservation(id, { status })
 *
 * RULES  (full list: CLAUDE.md section 10)
 *  - Only 'pending' reservations can be confirmed; admins may cancel pending or confirmed ones
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
import PagePlaceholder from "../../components/PagePlaceholder.jsx";

// ---- PLACEHOLDER (delete from here) -----------------------------------
export default function ManageReservations() {
  return (
    <PagePlaceholder title="ManageReservations" route="/admin/reservations" />
  );
}
// ---- PLACEHOLDER (to here) ---------------------------------------------
