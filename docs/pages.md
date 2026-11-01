# Pages, files, and owners

Every page and component below **already exists as a placeholder file** with a comment at the top
that lists what to build, which API functions to use, and the rules to follow.
To work on a page: open its file, read the header comment, paste or write your code,
and delete the lines between `PLACEHOLDER (delete from here)` and `PLACEHOLDER (to here)`.
All routes are already registered in `client/src/App.jsx`.

Owners are suggestions (see `CLAUDE.md` section 3). Change the `OWNER` line in a file if the team reassigns it.

All paths are inside `client/src/`.

## Public pages
| Route | File | Suggested owner |
|---|---|---|
| `/` | `pages/Home.jsx` | Ahmed Taher |
| `/menu` | `pages/Menu.jsx` | Ahmed Taher |
| `/menu/:id` | `pages/DishDetails.jsx` | Ahmed Taher |
| `/cart` | `pages/Cart.jsx` | Shorouk |
| `/about` | `pages/About.jsx` | Ahmed Taher |
| `/login` | `pages/Login.jsx` | Heba Talaat |
| `/register` | `pages/Register.jsx` | Heba Talaat |
| `*` (404) | `pages/NotFound.jsx` | Ahmed Taher |

## Customer pages (login required)
| Route | File | Suggested owner |
|---|---|---|
| `/reservation` | `pages/Reservation.jsx` | Heba Talaat |
| `/checkout` | `pages/Checkout.jsx` | Shorouk |
| `/orders` | `pages/Orders.jsx` | Shorouk |
| `/orders/:id` | `pages/OrderTracking.jsx` | Shorouk |
| `/profile` | `pages/Profile.jsx` | Heba Talaat |

## Admin pages (role = admin)
| Route | File | Suggested owner |
|---|---|---|
| `/admin` | `pages/admin/Dashboard.jsx` | Heba Talaat |
| `/admin/menu` | `pages/admin/ManageMenu.jsx` | Heba Talaat |
| `/admin/orders` | `pages/admin/ManageOrders.jsx` | Heba Talaat |
| `/admin/reservations` | `pages/admin/ManageReservations.jsx` | Heba Talaat |

## Components (`components/`)
| File | Used by | Suggested owner |
|---|---|---|
| `Layout.jsx`, `Navbar.jsx`, `Footer.jsx` | every page (working shells) | Shared (Ahmed Taher) |
| `ProtectedRoute.jsx` | route guard (**`BYPASS_AUTH = true` for now**) | Heba Talaat |
| `DishCard.jsx` | Home, Menu | Ahmed Taher |
| `CategoryTabs.jsx`, `SearchBar.jsx`, `FilterBar.jsx` | Menu | Ahmed Taher |
| `SizeSelector.jsx`, `ExtrasSelector.jsx` | DishDetails | Ahmed Taher |
| `QuantitySelector.jsx` | DishDetails, CartItem | Shared |
| `CartItem.jsx`, `OrderSummary.jsx` | Cart, Checkout | Shorouk |
| `OrderCard.jsx`, `StatusStepper.jsx` | Orders, OrderTracking | Shorouk |
| `StatusBadge.jsx` | Orders, Profile, admin pages | Shared |
| `FormInput.jsx` | Login, Register, Reservation, Checkout | Heba Talaat |
| `DishForm.jsx`, `ConfirmModal.jsx` | ManageMenu, Profile | Heba Talaat |
| `Loader.jsx`, `ErrorMessage.jsx` | any page that loads data | Shared |
| `PagePlaceholder.jsx` | placeholders only (delete when everything is built) | – |

## Context, services, utils
| File | What it is |
|---|---|
| `context/AuthContext.jsx` | Working base: `useAuth()` gives `{ user, login, logout }` (saved in localStorage). Owner: Heba Talaat |
| `context/CartContext.jsx` | **Stub with the final shape**: `useCart()` gives `{ items, itemCount, total, addItem, updateQuantity, removeItem, clearCart }`. The functions are TODO. Owner: Shorouk |
| `services/api.js` | All network calls (already has the functions every page needs) |
| `utils/formatPrice.js` | `formatPrice()`, `calcUnitPrice()`, `SIZE_MULTIPLIERS` |
| `utils/validators.js` | email / phone / password checks |
| `utils/constants.js` | order and reservation statuses, labels, `NEXT_ORDER_STATUS` |
| `utils/storage.js` | safe `loadJSON` / `saveJSON` / `removeKey` for localStorage |
| `utils/translations.js` | all UI text (English now, Arabic later) |
| `styles/theme.css` | brand colors and fonts (CSS variables). Owner: Ahmed Taher |
| `../public/images/*` and `../public/logo.svg` | placeholder pictures and logo: replace with real files using the same names |

Every document the project needs is listed in `docs/DELIVERABLES.md`.
