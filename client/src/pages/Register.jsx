/**
 * PAGE   : Register
 * ROUTE  : /register
 * ACCESS : Public
 * OWNER  : Heba Talaat (suggested - change if the team reassigns)
 *
 * WHAT TO BUILD
 *  - Form: name, email, phone, password, confirm password, with validation (utils/validators.js)
 *  - Check that the email is not already used (emailExists)
 *  - Create the user with role 'customer', log them in, and redirect to /
 *
 * DATA / API  (functions live in src/services/api.js)
 *  - emailExists(email), register(user), useAuth().login(user)
 *
 * RULES  (full list: CLAUDE.md section 10)
 *  - Role is always 'customer' when registering
 *  - Show field-level errors
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
export default function Register() {
  return <PagePlaceholder title="Register" route="/register" />;
}
// ---- PLACEHOLDER (to here) ---------------------------------------------
