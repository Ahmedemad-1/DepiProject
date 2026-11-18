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
| `/` | `pages/Home.jsx` (**built**: Velora hero, dish showcase, categories, about, booking band; data from the API) | Ahmed Taher |
| `/menu` | `pages/Menu.jsx` (**built**: tabs, search, price band in EGP, vegetarian switch) | Ahmed Taher |
| `/menu/:id` | `pages/DishDetails.jsx` (**built**: size, extras, quantity, Add to Cart) | Ahmed Taher |
| `/cart` | `pages/Cart.jsx` | Shorouk |
| `/about` | `pages/About.jsx` (**built**, Velora page) | Ahmed Taher |
| `/contact` | `pages/Contact.jsx` (**built**, Velora page; EXTRA route that Nocturne did not have) | Ahmed Taher / Heba Talaat |
| `/login` | `pages/Login.jsx` | Heba Talaat |
| `/register` | `pages/Register.jsx` | Heba Talaat |
| `*` (404) | `pages/NotFound.jsx` (**built**) | Ahmed Taher |

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
| `Layout.jsx`, `Navbar.jsx`, `Footer.jsx`, `Logo.jsx`, `BrandLink.jsx`, `AddressLink.jsx`, `Email.jsx` | every page (**built**: Velora look, links by role, cart count, mobile menu) | Shared (Ahmed Taher) |
| `Img.jsx`, `Dropdown.jsx`, `HeroBackdrop.jsx`, `MenuShowcase.jsx`, `WaitingTable.jsx` | Velora building blocks (**built**) | Ahmed Taher |
| `ProtectedRoute.jsx` | route guard (**`BYPASS_AUTH = true` in development only**; always enforced in a production build) | Heba Talaat |
| `DishCard.jsx` | Home, Menu (**built**) | Ahmed Taher |
| `CategoryTabs.jsx`, `SearchBar.jsx`, `FilterBar.jsx` | Menu (placeholders: Velora's Menu page already does this inline) | Ahmed Taher |
| `SizeSelector.jsx`, `ExtrasSelector.jsx` | DishDetails (placeholders: done inline in the Velora page) | Ahmed Taher |
| `QuantitySelector.jsx` | DishDetails, CartItem | Shared |
| `CartItem.jsx`, `OrderSummary.jsx` | Cart, Checkout | Shorouk |
| `OrderCard.jsx`, `StatusStepper.jsx` | Orders, OrderTracking | Shorouk |
| `StatusBadge.jsx` | Orders, Profile, admin pages | Shared |
| `FormInput.jsx` | Login, Register, Reservation, Checkout | Heba Talaat |
| `DishForm.jsx`, `ConfirmModal.jsx` | ManageMenu, Profile | Heba Talaat |
| `Loader.jsx`, `ErrorMessage.jsx` | any page that loads data (**built**, Velora style) | Shared |
| `PagePlaceholder.jsx` | placeholders only, Velora-styled (delete when everything is built) | – |

## Context, services, utils
| File | What it is |
|---|---|
| `context/AuthContext.jsx` | Working base: `useAuth()` gives `{ user, login, logout }` (saved in localStorage). Owner: Heba Talaat |
| `context/CartContext.jsx` | **Working** (implemented during the merge): `useCart()` gives `{ items, itemCount, total, addItem, updateQuantity, removeItem, clearCart }`, saved in localStorage. Shorouk: review it and build Cart, Checkout, Orders on top. |
| `hooks/useMenu.js` | loads dishes + categories once (Home, Menu, showcase, DishDetails) |
| `services/api.js` | All network calls (already has the functions every page needs) |
| `utils/formatPrice.js` | `formatPrice()`, `calcUnitPrice()`, `SIZE_MULTIPLIERS` |
| `utils/cart.js` | `makeLineId()` (same dish + size + extras = same cart line) |
| `utils/links.js`, `utils/splash.js` | `telHref()`; hides the loading splash (from Velora) |
| `utils/validators.js` | email / phone / password checks |
| `utils/constants.js` | order and reservation statuses, labels, `NEXT_ORDER_STATUS` |
| `utils/storage.js` | safe `loadJSON` / `saveJSON` / `removeKey` for localStorage |
| `utils/translations.js` | all UI text (English now, Arabic later) |
| `config/brand.js`, `config/photos.js` | restaurant name, tagline, address, phone, hours (one place); site photo paths. Owner: Ahmed Taher |
| `styles/theme.css`, `layout.css`, `home.css`, `components.css`, `menu.css`, `dish-details.css`, `pages.css`, `fonts.css`, `loader.css` | the Velora design system (rules: `docs/design/ui-guidelines.md`). Do not edit. Owner: Ahmed Taher |
| `styles/app.css` | the only place for NEW css (new class names). |
| `../public/images/*`, `../public/fonts/*`, `../public/logo.svg` | Velora site photos, fonts and logo. Dish photos are missing: add them using the names in `db.json` |

Every document the project needs is listed in `docs/DELIVERABLES.md`.
