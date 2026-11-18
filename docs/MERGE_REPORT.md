# Merge report: Velora (design) + Nocturne (system)

Merged on 18 Nov 2026. Velora design author: **[FRIEND'S NAME]** (credit kept in `docs/design/ui-guidelines.md`, `CLAUDE.md` section 11a and file headers).
Both originals were left untouched; all work was done on copies.

> **Read this first: what was and was NOT verified.**
> The environment used for the merge had **no internet access**, so `npm install` could not run. Therefore these checks were **NOT run**:
> `npm install`, `npm run lint`, `npm run format` / `format:check`, `npm run build`, `npm run mock`, the dev server, any browser or screenshot,
> and the Velora before/after screenshot comparison at 1440 x 900 and 390 x 844. **Nobody has seen the merged site running yet.**
> What WAS run (evidence in section 6): a JSX syntax check of all 65 source files, a check that every relative import resolves,
> a check that every public asset referenced by `index.html`/CSS exists, a byte-for-byte check that the split CSS equals Velora's `main.css`,
> and 12 pure-logic checks (pricing rule, cart line ids, data integrity) in plain Node. The first thing to do after unzipping is section 8, step 4.

## 1. Inventory

### 1a. Files
- Velora: 52 files (a Vite + React 19 JS project, 5 pages, about 2,760 lines of CSS in one file). Nocturne: 139 files (client, server placeholders, docs). Merged project: 193 files (before the dishes were re-added; data only changed afterwards).

### 1b. Comparison table (Step 0)
| Area | Velora | Nocturne | Conflict? | Resolution |
|---|---|---|---|---|
| Build tool | Vite 8, `@vitejs/plugin-react` ^6.2.1 | Vite 8, plugin-react ^6.1.2 | no | kept Vite; plugin ^6.2.1 |
| Language | JavaScript (`.jsx`) | JavaScript (`.jsx`) | no | no TypeScript needed |
| Router | react-router-dom ^7.18.5, `<Routes>` in App | react-router-dom ^7.18.5, nested routes + `Layout` | yes (two route tables) | Nocturne `App.jsx` kept; Velora routes added under `Layout` |
| Styling | Bootstrap 5.3 + one custom `main.css` + PurgeCSS in build | Bootstrap 5.3 (dark) + own theme/layout/components/home CSS | yes (two design systems) | Velora CSS kept (split verbatim), Nocturne CSS archived (rule 3c/a: Bootstrap + Velora overrides) |
| Fonts | Lora + Sora, self-hosted woff2 in `public/fonts` | Italiana + Manrope from `@fontsource` | yes | Velora fonts; `@fontsource/*` removed |
| Icons | `lucide-react` ^1.68 | none | no | added `lucide-react` |
| Animation | pure CSS + small JS timers | none | no | kept as is |
| State | local `useState`, window event for cart | Auth + Cart context, localStorage | yes (two cart ideas) | Nocturne contexts only; Velora's `velora:add-to-cart` event removed |
| Data source | hard-coded `data/dishes.js` (13 Italian-style dishes, USD) | `services/api.js` + `db.json` (116 Egyptian dishes, EGP) | yes | API is the only source; Velora data files removed |
| Images | 8 site photos in `public/images`, dish photos from Unsplash URLs | no photos in the zip (docs mention 32 placeholders that are not there) | partly | site photos copied; Unsplash dish photos NOT used (they show other dishes) |
| Formatter | `formatPrice` -> "$14.00" | `formatPrice` -> "25 EGP" | yes | Nocturne `formatPrice` only |
| Brand data | `data/site.js` | `config/brand.js` (empty) | yes | filled into `brand.js` |
| Lint / format | none | oxlint + Prettier | no | Nocturne's kept |
| Deploy files | none | `vercel.json`, `public/_redirects` | no | kept |
| Contact form | Web3forms service | none | no | moved into `api.js` |

## 2. Page and route map (Step 1)
| Velora page / path | Nocturne route | Action |
|---|---|---|
| Home `/` | `/` Home | Velora page, adapted to data (categories + dishes from the API) |
| Menu `/menu` | `/menu` Menu | Velora page, adapted to data (category in the URL as `?category=<id>`; EGP price bands) |
| Dish details `/menu/:id` | `/menu/:id` DishDetails | Velora page, adapted to data, Nocturne pricing and cart line |
| About `/about` | `/about` About | Velora page as is |
| Contact `/contact` | none | **NEW extra route** (registered in `App.jsx`, `docs/pages.md`) |
| 404 (inline in App) | `*` NotFound | Velora markup moved into `pages/NotFound.jsx` |
| (none; Velora links to `/cart`, `/login`, `/reservation`) | `/cart` Cart | Velora-styled placeholder |
| (none) | `/login` Login, `/register` Register | Velora-styled placeholders |
| (none) | `/reservation` Reservation | Velora-styled placeholder (protected) |
| (none) | `/checkout`, `/orders`, `/orders/:id`, `/profile` | Velora-styled placeholders (protected) |
| (none) | `/admin`, `/admin/menu`, `/admin/orders`, `/admin/reservations` | Velora-styled placeholders (admin only) |

Result: 18 routes (the 17 Nocturne routes + `/contact`). Velora really has only 5 pages (not "many"), so 13 of the 17 plan pages remain placeholders.

## 3. Decisions and conflict resolutions
| # | Decision | Why |
|---|---|---|
| D1 | Base = the Nocturne Vite project; Velora is plain Vite too, so no framework port was needed | decision table, Step 2 |
| D2 | Velora's `main.css` cut into 7 contiguous files + `app.css` (new). Verified byte-identical to the original when joined in order | one cascade, no visual change; `theme.css` holds the tokens |
| D3 | Bootstrap kept (both projects use it). Bootstrap JS bundle removed from `main.jsx` | nothing in the code uses Bootstrap's JavaScript today. **If you build a Bootstrap modal/dropdown (e.g. ManageMenu, ConfirmModal) re-add `import "bootstrap/dist/js/bootstrap.bundle.min.js";` to `main.jsx`**, or build it with React state |
| D4 | PurgeCSS config from Velora kept in `vite.config.js` | Velora's CSS relies on it; all JSX is under `./src`, so new files are scanned automatically |
| D5 | **Size multipliers: Nocturne wins** (0.7 / 1 / 1.2). Velora used 1 / 1.3 / 1.6 with default Small | hard rule 3. **Visible change**: Small is now cheaper than the base price, default size is Medium. Prices are different from Velora's |
| D6 | Currency: "EGP" via Nocturne `formatPrice` instead of "$" | one formatter, data is EGP. **Visible change** |
| D7 | Price filter bands changed from dollars to EGP: under 50 / 50-100 / 100-200 / over 200 (69 / 29 / 19 / 12 dishes; the 13 Velora dishes all fall under 50 until their prices are set in EGP) | the dollar bands would match nothing useful |
| D8 | Dish page options come from the dish (`availableSizes`, `extras`) not from Velora's per-category extras. Size block hidden for single-size dishes, extras block hidden when a dish has none | Nocturne data contract. Velora markup unchanged otherwise |
| D9 | Menu page shows all 129 dishes in one grid (Velora behavior) and 20 category tabs; Home "From our kitchen" shows Velora's original 13 dishes in the original order (the dishes that have `imageSquare`); fallback: one dish per category | restores the original showcase. **Visible change**: the Menu has 129 dishes and the Home has 19 category cards instead of 8 |
| D10 | Home category cards: photo = `categories[].image` (Velora's own photos for its 8 categories) or the first dish of the category; text = `categories[].description` (Velora's text for its 8 categories, empty for the Egyptian ones) | no copy invented |
| D10b | **Velora's 13 dishes restored** in `db.json` (ids 117-129) with the original names, descriptions, categories, vegetarian flags, photo URLs (card and square), and extras; 7 Velora categories added (ids 13-19). Velora's string slugs (`/menu/margherita`) became numeric ids (`/menu/117`) because the contract says ids are numbers. Prices kept as Velora's numbers (**they were dollars**, the rest of the menu is EGP): set real EGP prices | user request; verified by a 159-check parity test (section 6) |
| D11 | Unavailable dishes: shown dimmed with an "Unavailable" tag and cannot be added (`app.css`) | needed by the Nocturne `isAvailable` rule, Velora had no such case |
| D12 | One router, one cart, one auth, one formatter, one reset, one set of tokens. Removed Velora's `dishService.js`, `useDishes.js`, `data/*`, `contactService.js`, `FoodCard.jsx`, its inline 404 and `ScrollManager` (moved into `Layout`) | hard rule 5 |
| D13 | `CartContext` was a stub; **implemented** (localStorage `cart_items`, merge by `lineId`) | the dish page needs a working cart. Shorouk should review it |
| D14 | `ProtectedRoute`: the docs promised `BYPASS_AUTH = true` but the file had no such flag (guard was always on). Added `BYPASS_AUTH = true` that only works with `npm run dev` (`import.meta.env.DEV`); production builds always enforce the guard | Login is a placeholder, nobody can log in. Safe assumption: never bypass in production |
| D15 | `Layout` no longer wraps pages in a container; every page renders its own `<main id="main">` | Velora CSS uses `#root > main` |
| D16 | Navbar/Footer: Velora design + Nocturne behavior (links by role, cart count, profile/log-in icon, log-out button, active link, mobile menu, skip link, scroll handling, tab title from `BRAND`). A visitor sees exactly Velora's navbar | Step 4 |
| D17 | Contact form key: Web3forms access key from the Velora project is the default; `VITE_WEB3FORMS_KEY` overrides it | the key is a public client-side key but belongs to the friend; use your own before launch |
| D18 | Velora's phone check on Contact (11 chars of digits, spaces, + - ( ) .) kept; email check now reuses `validators.isValidEmail` (same regex) | keep Velora UI, avoid a duplicate regex |
| D19 | Brand: name VELORA / "VELORA RESTAURANT", tagline, address, phone, e-mail, hours copied from Velora into `brand.js`; `db.json` `restaurantName` = "VELORA" | Step 3 |
| D20 | **Opening hours conflict, left unresolved on purpose**: Footer/Contact show Velora's hours (Mon-Thu 12-22, Fri-Sat 12-23:30, Sun 13-21) but the booking rules use `settings.openingHours` 08:00-23:59 (Nocturne contract) | rule 3 keeps the contract, rule 2 keeps Velora's text. The team must pick ONE schedule |
| D21 | Placeholders `CategoryTabs`, `SearchBar`, `FilterBar`, `SizeSelector`, `ExtrasSelector`, `QuantitySelector` kept (file audit) with a header note: Velora's pages do this inline | not deleted silently |
| D22 | Nocturne files replaced and archived (not deleted) in `docs/design/reference/nocturne-archive/`: old Navbar, Footer, Layout, Logo, Loader, DishCard, ErrorMessage, Home, Menu, About, DishDetails, NotFound, theme/layout/components/home CSS, `index.css`, `main.jsx`, logo, favicon, icons, `index.html` | hard rules 1 and 5 |

### Visible differences from the original Velora (cannot be confirmed by screenshots, see top)
1. Prices show "N EGP" instead of "$N.00"; Small/Medium/Large prices differ (D5, D6).
2. Menu has 129 dishes (116 Egyptian + Velora's 13) and 20 tabs instead of 13 dishes and 9 tabs; price dropdown labels are in EGP; the Velora dish URLs are numeric (D7, D9, D10b).
3. Dish photos: the 13 Velora dishes use their original Unsplash photos; the 116 Egyptian dishes use the logo placeholder until real photos are added (db paths like `/images/ful-medames.jpg` do not exist).
4. Home "From our kitchen" cycles through at most 8 dishes; category cards have no text line except Desserts (D9, D10).
5. Logged-in users see two extra nav items (My orders, Admin for admins) and a log-out icon. Visitors see none.
6. The splash/loader is unchanged. Home copy still talks about pasta and wood-fired cooking (see risks).

## 4. Files added, changed, moved, removed (versus the original Nocturne project)
**Added (55)**
- `client/public/`: `apple-touch-icon.png`, `favicon.ico`
- `client/public/fonts/`: 3 files
- `client/public/images/`: `about.jpg`, `book-table.webp`, `hero-1.jpg`, `hero-2.jpg`, `hero-3.jpg`, `hero-candlelight.webp`, `hero-oven.webp`, `menu-head.jpg`
- `client/src/components/`: `AddressLink.jsx`, `BrandLink.jsx`, `Dropdown.jsx`, `Email.jsx`, `HeroBackdrop.jsx`, `Img.jsx`, `MenuShowcase.jsx`, `WaitingTable.jsx`
- `client/src/config/`: `photos.js`
- `client/src/hooks/`: `useMenu.js`
- `client/src/pages/`: `Contact.jsx`
- `client/src/styles/`: `app.css`, `dish-details.css`, `fonts.css`, `loader.css`, `menu.css`, `pages.css`
- `client/src/utils/`: `cart.js`, `links.js`, `splash.js`
- `docs/design/reference/nocturne-archive/public/`: 4 files
- `docs/design/reference/nocturne-archive/src/components/`: 7 files
- `docs/design/reference/nocturne-archive/src/`: 2 files
- `docs/design/reference/nocturne-archive/src/pages/`: 5 files
- `docs/design/reference/nocturne-archive/src/styles/`: 4 files

**Changed (66)**
- `(root)/`: `CLAUDE.md`, `CONTRIBUTING.md`, `README.md`
- `client/`: `.env.example`, `README.md`, `index.html`, `package.json`, `vite.config.js`
- `client/public/`: `favicon.svg`, `logo.svg`
- `client/src/`: `App.jsx`, `main.jsx`
- `client/src/components/`: `CartItem.jsx`, `CategoryTabs.jsx`, `ConfirmModal.jsx`, `DishCard.jsx`, `DishForm.jsx`, `ErrorMessage.jsx`, `ExtrasSelector.jsx`, `FilterBar.jsx`, `Footer.jsx`, `FormInput.jsx`, `Layout.jsx`, `Loader.jsx`, `Logo.jsx`, `Navbar.jsx`, `OrderCard.jsx`, `OrderSummary.jsx`, `PagePlaceholder.jsx`, `ProtectedRoute.jsx`, `QuantitySelector.jsx`, `SearchBar.jsx`, `SizeSelector.jsx`, `StatusBadge.jsx`, `StatusStepper.jsx`
- `client/src/config/`: `brand.js`
- `client/src/context/`: `CartContext.jsx`
- `client/src/pages/`: `About.jsx`, `Cart.jsx`, `Checkout.jsx`, `DishDetails.jsx`, `Home.jsx`, `Login.jsx`, `Menu.jsx`, `NotFound.jsx`, `OrderTracking.jsx`, `Orders.jsx`, `Profile.jsx`, `Register.jsx`, `Reservation.jsx`
- `client/src/pages/admin/`: `Dashboard.jsx`, `ManageMenu.jsx`, `ManageOrders.jsx`, `ManageReservations.jsx`
- `client/src/services/`: `api.js`
- `client/src/styles/`: `components.css`, `home.css`, `layout.css`, `theme.css`
- `docs/`: `api.md`, `pages.md`, `technical-documentation.md`
- `docs/design/`: `README.md`, `ui-guidelines.md`
- `docs/design/wireframes/`: `README.md`
- `server/mock/`: `db.json`

**Moved / archived** to `docs/design/reference/nocturne-archive/` (22 files, see D22): the Nocturne originals of every file the merge replaced.

**Removed (1)**
- `client/src/index.css` (replaced by Velora's `theme.css`/`main.jsx` imports; the old content is archived in `docs/design/reference/nocturne-archive/src/`)

Not touched: `docs/planning/PROJECT_PLAN.docx`, `server/` except `server/mock/db.json`, `server/mock/db.backup*.json` (verified identical), `.github/`, `.gitignore`.

## 5. Dependencies and data
**Dependencies** (`client/package.json`)
- Added: `lucide-react ^1.68.0` (dependency), `@fullhuman/postcss-purgecss ^9.1.0` (dev).
- Removed: `@fontsource/italiana`, `@fontsource/manrope` (fonts replaced), `@types/react`, `@types/react-dom` (project is plain JavaScript, nothing used them).
- Version changes: `@vitejs/plugin-react ^6.1.2 -> ^6.2.1`.
- Kept: `bootstrap ^5.3.8`, `react`, `react-dom ^19.3.1`, `react-router-dom ^7.18.5`, `vite ^8.3.5`, `oxlint`, `prettier`, `json-server 0.17.4` (pinned), optional `@rolldown/binding-win32-x64-msvc`.
- `package-lock.json` was **not regenerated** (no network; the original zip had none either). Run `npm install` and commit the new lock file.

**Data / API additions** (also in `docs/api.md`, `CLAUDE.md`)
- `categories[].description` (optional string; only Desserts filled with Velora's text). The SQL schema/backend does not have it yet.
- `settings.restaurantName` = "VELORA".
- New external call `sendContactMessage()` in `api.js` (Web3forms) and optional env `VITE_WEB3FORMS_KEY`.
- No field renamed or removed. `db.backup.json` untouched.

## 6. Quality gates and evidence
| Gate | Result |
|---|---|
| `npm install` from scratch | **NOT RUN** (no network) |
| `npm run lint`, `format`, `format:check`, `build` | **NOT RUN** (tools not installable). Ported Velora files keep Velora's single-quote style: run `npm run format` once, it only changes formatting |
| `npm run mock` + dev/preview server, every route in a browser, console errors | **NOT RUN** |
| Screenshots 1440x900 / 390x844 before and after | **NOT RUN** |
| Functional checks (cart + size/extras, refresh persistence, admin login, 0000 card, reservation validation, admin status change) | **NOT RUN in a browser.** Login, Checkout, Reservation, Orders and Admin pages are placeholders, so those checks cannot pass until the team builds them. The cart-and-pricing part is covered by the logic test below |
| Accessibility spot checks | Contrast computed (ratios in `ui-guidelines.md`, all above 4.5:1). Focus ring, skip link, labels, alt text come from Velora's code and were read, not tested in a browser |
| JSX syntax of all 65 `src` files (TypeScript transpile, no diagnostics) | **PASS** (0 problems) |
| Every relative import resolves to an existing file | **PASS** (0 missing) |
| Public assets referenced by `index.html` and CSS exist | **PASS** |
| Split CSS equals Velora `main.css` byte for byte | **PASS** (`cmp`) |
| **Velora data parity test** (Node + a stand-in server that mimics json-server GET routes; json-server itself was not run) | **PASS 159/159**: for each of the 13 dishes the name, description, category, price number, vegetarian flag, card photo URL, square photo URL, extras (names, prices, order) and `getMenuItem(id)` match Velora's original `dishes.js`/`extras.js`; 8 category texts and photos match `categories.js`; the 13 keep Velora's order; unknown id rejects with 404 (the page shows Velora's "That dish is not on our menu."); ids unique numbers. Size prices differ on purpose (D5) |
| Pure-logic test `client/src/utils` + `db.json` (Node) | **PASS 12/12**: multipliers 0.7/1/1.2; medium = base price; large + extra = round(base x 1.2 + extra); small = round(base x 0.7); price text "N EGP"; other size or extras = other `lineId`; extras order irrelevant; every dish category exists; every dish has sizes and extras; `restaurantName` = VELORA; admin demo user exists |
| File audit: names in `docs/pages.md` exist | **PASS** (0 missing); every placeholder file has its header comment (26 placeholders with the `PLACEHOLDER` markers) |

Not verifiable here: that `lucide-react`, `bootstrap` and `react-router-dom` resolve, that PurgeCSS keeps every class used (e.g. classes added only at runtime), and that `oxlint` accepts the Velora files.

## 7. Known issues and risks
1. **Unverified build** (see top). Expect small fixes on first `npm run build` / `npm run lint`.
2. **Copy vs menu mismatch**: Velora's hero, about and Menu header text describe wood-fired Italian-style cooking and fresh pasta; the database menu is Egyptian (ful, grills, fiteer...). Copy was not changed (hard rule 6). The team must rewrite the texts in `Home.jsx`, `About.jsx`, `Menu.jsx` (and the About values).
3. **Opening hours** conflict (D20). **Brand details** (address in Maadi, phone, e-mail) come from the Velora project and are unconfirmed.
4. **Photos**: the 116 Egyptian dishes have no photo file (logo placeholder). Velora's 13 use remote Unsplash URLs, so they need internet.
4b. **Velora dish prices are dollar numbers** shown as EGP (6 to 34 EGP): fix in `db.json`.
5. `BYPASS_AUTH = true` only in dev; deployed builds enforce login but Login is a placeholder, so a deployed build today cannot open protected pages.
6. **Home loading**: the splash can wait up to 3 s (plan NFR1: 3 s); the Home page now also needs the API before the dish showcase and categories appear.
7. Menu/Home depend on `npm run mock` (or the backend) being up; otherwise they show the error block with "Try again".
8. The Web3forms key is the friend's; messages go to his/her account until you replace it.
9. `docs/design/reference/nocturne-concept.html` still shows the old look (kept as history).
10. Velora has no tests; none were added.

### Plan file (`docs/planning/PROJECT_PLAN.docx`, untouched): points that are now outdated
- Section 1/20: "restaurant name and identity not decided": a working identity now exists (VELORA, cream/black, Lora + Sora).
- Section 5 (sitemap): add `/contact`; the Home description (banner with "order now", featured dishes, opening hours on the page) differs: Velora Home has hero with "Explore Our Menu" / "Book a Table", dish showcase, category cards, about teaser and a booking band; hours are in the footer and on Contact.
- Design/Figma: the real design is the Velora code, not a Figma file.
- NFR1 (3 s page load): the splash may take up to 3 s by itself.
- Still valid: size multipliers 0.7 / 1 / 1.2, party size 1-10, pickup only, cart persistence.

## 8. Team TODO, next steps and Git
### TODO list
| Item | Owner |
|---|---|
| Run `npm install`, `npm run format`, `npm run lint`, `npm run build`, fix what appears; commit `package-lock.json` | Ahmed Emad |
| Confirm the final restaurant name; update `brand.js`, `index.html` `<title>`, `db.json`, `logo.svg` | Ahmed Taher |
| Confirm address, phone, e-mail, ONE opening-hours schedule (also `settings.openingHours`) | Ahmed Taher + Ahmed Emad |
| Rewrite Home/About/Menu copy to match the Egyptian menu | Ahmed Taher |
| Dish photos for the 116 Egyptian dishes (names in `db.json` `image`); real EGP prices for Velora's 13 dishes | Ahmed Taher |
| Own Web3forms key in `client/.env` | Ahmed Emad |
| Backend: add `categories.description` (optional), real API, deployment | Ahmed Emad |
| Review `CartContext`, then Cart, Checkout, Orders, OrderTracking, tests | Shorouk |
| Login, Register (then set `BYPASS_AUTH = false`), Reservation, Profile, Admin pages | Heba Talaat |
| Update wireframes folder with Velora screenshots | each owner |

### Next steps per teammate (open these files first)
- **Ahmed Emad** (backend, db, GitHub, deployment, docs): `docs/MERGE_REPORT.md`, `client/package.json`, `client/vite.config.js`, `docs/api.md`, `server/mock/db.json`, `server/schema.sql`, `docs/deployment.md`.
- **Ahmed Taher** (Home, Menu, Dish details, About, design): `client/src/config/brand.js`, `client/src/pages/Home.jsx`, `Menu.jsx`, `DishDetails.jsx`, `About.jsx`, `docs/design/ui-guidelines.md`, `client/src/styles/app.css`.
- **Shorouk** (Cart, Checkout, Orders, tracking, tests): `client/src/context/CartContext.jsx`, `client/src/utils/cart.js`, `client/src/pages/Cart.jsx`, `Checkout.jsx`, `Orders.jsx`, `OrderTracking.jsx`, `client/src/components/CartItem.jsx`.
- **Heba Talaat** (Login, Register, Reservation, Profile, Admin): `client/src/pages/Login.jsx`, `Register.jsx`, `client/src/components/ProtectedRoute.jsx`, `client/src/context/AuthContext.jsx`, `client/src/pages/Reservation.jsx`, `Profile.jsx`, `client/src/pages/admin/`, `client/src/pages/Contact.jsx` (form pattern to copy).

### Applying the zip to your Git repository (keep history)
1. `git checkout main && git pull && git checkout -b feature/velora-merge`
2. Unzip `DepiProject.zip` somewhere else. Copy its CONTENTS over your repo folder (overwrite). **Do not** delete or replace the `.git` folder (the zip has none). Delete from your repo: `client/src/index.css` (the only removed file).
3. `cd client && npm install` (creates the lock file), then `npm run format`, `npm run lint`, `npm run build`.
4. `npm run mock` in one terminal, `npm run dev` in another; open `/`, `/menu`, `/menu/1`, `/about`, `/contact` and check them against your Velora project at 1440 px and 390 px wide.
5. `git status` and `git diff --stat` to review. Make sure no `node_modules`, `dist` or `.env` is staged.
6. `git add -A && git commit -m "Merge Velora design into the Nocturne system"`, `git push -u origin feature/velora-merge`, open a Pull Request with `docs/MERGE_REPORT.md` linked, get a teammate to review, merge.

## 9. Replaced services and hooks: how each one still behaves (answer to "do they work as before?")
| Velora original | Now | Same behavior? |
|---|---|---|
| `getDishes()` (cached, 350 ms fake delay) | `getMenuItems()` in `api.js`, cached by `useMenu` | yes, minus the fake delay |
| `getDishById(id)` (throws "That dish is not on our menu.") | `getMenuItem(id)`; the dish page shows the same text on a 404 | yes |
| `getCategories()` (8 names, texts, photos) | `getCategories()` + `description` / `image` fields in `db.json` | yes for the 8 Velora categories (parity test) |
| `getExtrasFor(category)` | `dish.extras` in `db.json` (same extras, order and prices for the 13) | yes |
| `formatPrice` ("$14.00") | `formatPrice` ("14 EGP") | **no, on purpose** (D6) |
| size prices x1 / x1.3 / x1.6 | x0.7 / x1 / x1.2 | **no, on purpose** (D5) |
| `handOffToCart` (window event nobody listened to) | `useCart().addItem(line)` | better: it really adds to the cart |
| `useDishes()` (cache, loading, error, reload) | `useMenu()` (same, also loads categories) | yes by reading the code; **not executed** (no browser/DOM here) |
