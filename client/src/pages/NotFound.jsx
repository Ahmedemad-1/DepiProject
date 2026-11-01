/**
 * PAGE   : NotFound
 * ROUTE  : *
 * ACCESS : Public
 * OWNER  : Ahmed Taher (suggested - change if the team reassigns)
 *
 * WHAT TO BUILD
 *  - Friendly 404 message with a link back to / and /menu
 *
 * DATA / API  (functions live in src/services/api.js)
 *  - none
 *
 * RULES  (full list: CLAUDE.md section 10)
 *  - none
 *
 * HOW TO FINISH
 *  1. Paste your code below and delete the PLACEHOLDER lines.
 *  2. Keep the default export and the file name (App.jsx already imports it).
 *  3. Run the project, test it on a phone-sized screen, then open a Pull Request.
 */
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="text-center py-5">
      <h1>404</h1>
      <p>This page does not exist.</p>
      <Link to="/" className="btn btn-dark me-2">
        Home
      </Link>
      <Link to="/menu" className="btn btn-outline-dark">
        Menu
      </Link>
    </div>
  );
}
