/**
 * PAGE   : Login
 * ROUTE  : /login
 * ACCESS : Public
 * OWNER  : Heba Talaat (suggested - change if the team reassigns)
 *
 * WHAT TO BUILD
 *  - Form: email and password with validation (valid email, password >= 6 characters)
 *  - On submit call login(email, password) from api.js, then useAuth().login(user)
 *  - Redirect to the page the user came from (location.state.from) or to / ; admins may go to /admin
 *  - Link to /register, and a clear 'Invalid email or password' error
 *
 * DATA / API  (functions live in src/services/api.js)
 *  - login(email, password) from api.js
 *  - useAuth().login(user)
 *
 * RULES  (full list: CLAUDE.md section 10)
 *  - Mock login is for demo only (plain-text passwords in db.json)
 *  - Demo accounts: admin@restaurant.test / Admin@123, customer1@example.test / Test@123
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
export default function Login() {
  return <PagePlaceholder title="Login" route="/login" />;
}
// ---- PLACEHOLDER (to here) ---------------------------------------------
