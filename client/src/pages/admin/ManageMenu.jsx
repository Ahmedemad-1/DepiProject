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
 * STYLE  : dark Nocturne theme. Use Bootstrap classes and the helpers in src/styles/theme.css
 *           (page-title, t-title, text-link, btn btn-primary). Rules: docs/design/ui-guidelines.md
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
