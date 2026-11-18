/**
 * PAGE   : ManageMenu
 * ROUTE  : /admin/menu
 * ACCESS : Admin only
 * OWNER  : Heba Talaat (suggested - change if the team reassigns)
 *
 * WHAT TO BUILD
 *  - Table of all dishes (image, name, category, base price, available?) with search
 *  - Add dish and Edit dish using DishForm (in a Bootstrap modal or a separate form)
 *  - Delete with a ConfirmModal; toggle 'available' without opening the form
 *  - Success and error messages
 *
 * DATA / API  (functions live in src/services/api.js)
 *  - getMenuItems(), getCategories(), createMenuItem(item), updateMenuItem(id, patch), deleteMenuItem(id)
 *
 * RULES  (full list: CLAUDE.md section 10)
 *  - Validate required fields (name, price > 0, category)
 *  - Keep the data shape from server/mock/db.json (see CLAUDE.md section 8)
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
export default function ManageMenu() {
  return <PagePlaceholder title="ManageMenu" route="/admin/menu" />;
}
// ---- PLACEHOLDER (to here) ---------------------------------------------
