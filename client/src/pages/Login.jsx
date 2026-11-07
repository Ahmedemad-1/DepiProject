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
export default function Login() {
  return <PagePlaceholder title="Login" route="/login" />;
}
// ---- PLACEHOLDER (to here) ---------------------------------------------
