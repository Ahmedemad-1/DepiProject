<!--
FILE      : docs/design/ui-guidelines.md
DEPI ITEM : System Analysis & Design - UI/UX Guidelines
OWNER     : Ahmed Taher (suggested)
DUE       : 6 Nov 2026
STATUS    : written (Nocturne direction). Review it as a team and adjust the TODO lines.
-->

# UI/UX Guidelines: "Nocturne"

The team chose the dark, gold, editorial look of the **Nocturne** concept
(`docs/design/reference/nocturne-concept.html`). This file turns it into rules every page follows.
The code lives in `client/src/styles/theme.css`, `layout.css`, `components.css`, and `home.css`.

## 1. Brand
- **Name:** Nocturne (working name). One place to change it: `client/src/config/brand.js`
  (and `settings.restaurantName` in `server/mock/db.json`). Never type the name inside a page.
- **Logo:** a square gold outline with the first letter of the name, next to the name in spaced capitals.
  Built in HTML/CSS (`components/Logo.jsx`); stand-alone version in `client/public/logo.svg` and `favicon.svg`.
- **Voice:** plain and warm. Say what happens ("Reserve a table", "Order for pickup"). Sentence case.
  Errors say what went wrong and what to do next. The same action keeps the same name everywhere.

## 2. Colors
| Token | Hex | Use | Contrast |
|---|---|---|---|
| `--noir-black` | `#0b0b0a` | page background | |
| `--noir-surface` | `#14120f` | inputs, tiles, tables | |
| `--noir-surface-2` | `#1c1a16` | raised surfaces | |
| `--noir-cream` | `#eee7db` | main text, the cream band | 16.0:1 on black |
| `--noir-muted` | `#a9a195` | secondary text on dark | 7.7:1 on black |
| `--noir-gold` | `#c2a46f` | accent: buttons, links, prices, outlines | 8.3:1 on black |
| `--noir-gold-bright` | `#d6bb86` | hover for gold | 10.6:1 on black |
| `--noir-gold-ink` | `#7a6137` | gold text on the cream band | 4.8:1 on cream |
| `--noir-cream-ink` | `#5f5a51` | secondary text on the cream band | 5.6:1 on cream |
| `--noir-line` | cream at 18% | hairline borders | |

Rules: use the variables, never new hex values. Gold is the only accent. Button text on gold is black (8.3:1).
Status colors stay Bootstrap's (green success, red error, yellow warning).

## 3. Typography
| Role | Font | Notes |
|---|---|---|
| Headings, dish names, logo | **Italiana** (one weight, 400) | big and light; never bold it |
| Body, buttons, forms, nav | **Manrope** (300 to 600) | 16 px base, line height 1.65 |

Both are installed with npm (`@fontsource/...`), so there is no Google Fonts request.
Scale: display `clamp(3.4rem, 8vw, 7.5rem)` (home headline only), page/section title `clamp(2.4rem, 5vw, 4.4rem)`,
dish name 1.5 rem, body 1 rem, small 0.875 rem. Nothing smaller than 13 px.
Keep paragraphs under 62 characters wide (`.measure`). Capital letters with wide spacing are used only for
navigation, buttons, and the wordmark.

## 4. Layout
- Sharp corners everywhere (radius 0). Structure comes from 1 px hairlines, not shadows.
- Page gutter `clamp(1.25rem, 5vw, 5.25rem)`; section spacing `clamp(4.5rem, 9vw, 8.5rem)`.
- Left aligned text. The home page is full width; every other page sits in a Bootstrap `container` (Layout does this).
- Home: hero photo + headline, cream band with key facts, four dishes, reservation band with photo.
- Menu grid: 4 columns on desktop, 2 on phones (`.dish-grid`).

## 5. Components and classes
| Need | Use |
|---|---|
| Main action | `<button class="btn btn-primary">` (gold fill) |
| Secondary action | `btn btn-outline-primary` (gold outline) |
| Action link under text | `<Link class="text-link">` |
| Page title | `<h1 class="page-title">` |
| Section title | `<h2 class="t-title">` |
| Gold word or phrase | `.t-gold` |
| Dish tile | `<DishCard item={...} />` inside `<div class="dish-grid">` |
| Loading / error | `<Loader />`, `<ErrorMessage message=... onRetry=... />` |
| Forms | Bootstrap `form-label`, `form-control`, `form-select` (already dark and gold-focused) |
| Admin tables | Bootstrap `table` (already themed) |

## 6. Accessibility
- Text contrast is at least 4.5:1 everywhere (table above). The concept's faint 44% text was raised to the muted token.
- Visible gold focus ring on every interactive element; "Skip to content" link first on every page.
- Every image has `alt` text (decorative photos use empty alt); every input has a `<label>`.
- Touch targets are at least 44 px tall; the navbar folds into a Menu button below 992 px.
- Motion: one entrance on the home headline only. `prefers-reduced-motion` turns animation off.
- Language: `<html lang="en">`. For the Arabic version, set `dir="rtl"`; the CSS uses logical properties, and the
  display font needs an Arabic fallback (for example `@fontsource/cairo`).

## 7. What changed from the concept
| Concept | Our version | Why |
|---|---|---|
| Faint 44% grey notes, 11 px | Muted token, 13 px minimum | readable (AA contrast) |
| Fixed 3-column navbar | Collapsing menu on phones, cart badge, login state | works on a phone |
| Remote Unsplash photos | Local files in `client/public/images/` | no hotlinking, works offline |
| Fonts from Google Fonts import | `@fontsource` packages | no external request |
| Tasting-menu copy | Pickup and reservation copy | matches what the site does |
| "01 / The experience" label | Real facts (hours, pickup, tables) | labels should carry information |
| Hover scaling and fades | Only the headline entrance | motion only where it helps |

## 8. TODO (team)
- Replace the placeholder photos in `client/public/images/` with real ones (same file names).
- Decide the final name; if it changes, edit `brand.js`, `db.json`, `index.html` title, and `logo.svg`.
- Fill in the address and phone in `brand.js`.
