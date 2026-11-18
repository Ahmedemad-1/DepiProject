<!--
FILE      : docs/design/ui-guidelines.md
DEPI ITEM : System Analysis & Design - UI/UX Guidelines
OWNER     : Ahmed Taher (suggested)
DUE       : 6 Nov 2026
STATUS    : rewritten after the Velora merge. Review it as a team and adjust the TODO lines.
-->

# UI/UX Guidelines: "Velora"

The website uses the **Velora** design by [FRIEND'S NAME]: a dark, warm, editorial look with cream text,
a serif for headings and a clean sans-serif for the body. This file turns the real code into rules every
page follows. The code lives in `client/src/styles/`:

| File | What it holds |
|---|---|
| `theme.css` | tokens (colors, radius, page width, gutter), body/heading base, focus ring, skip link, page-root layout |
| `layout.css` | buttons (`btn-solid`, `btn-ghost`), navbar, logo, mobile menu |
| `home.css` | hero, sections, "From our kitchen" plate, category cards, dish cards |
| `components.css` | about frame, booking band, waiting-table scene, footer |
| `menu.css` | menu page header, toolbar, tabs, search, dropdown, option controls, mobile menu layout |
| `dish-details.css` | dish page: size and extras choices, quantity, total |
| `pages.css` | About and Contact pages, forms, selection color, scrollbar, reduced motion |
| `fonts.css`, `loader.css` | self-hosted fonts; loading screen and ring |
| `app.css` | the ONLY file added by the merge: new classes for the Nocturne system (unavailable dishes, placeholder chip) |

The seven big files are Velora's original single `main.css` cut in order (nothing was edited), so the
cascade is unchanged. **New CSS goes in `app.css` with new class names. Never edit or rename a Velora class.**

## 1. Brand
- **Name:** VELORA (working value from the Velora project). One place to change it: `client/src/config/brand.js`,
  plus `<title>` in `client/index.html`, `settings.restaurantName` in `server/mock/db.json` and `client/public/logo.svg`.
  Never type the name inside a page: import `BRAND`.
- **Tagline:** "Good Food Great Mood" (`BRAND.tagline`).
- **Logo:** the Velora mark (an SVG path in `components/Logo.jsx`) next to the name in spaced capitals and the small word
  "Restaurant". Stand-alone files: `client/public/logo.svg`, `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`.
- **Voice:** plain and warm. Say what happens ("Book a Table", "Add to Cart"). Errors say what went wrong and what to do next.
- **TODO (team):** address, phone, e-mail and opening hours in `brand.js` come from the Velora project and must be confirmed.

## 2. Colors (tokens in `theme.css`)
| Token | Hex | Use | Contrast |
|---|---|---|---|
| `--black` | `#0b0b0a` | page background, text on cream | |
| `--ink` | `#141311` | cards, form panel | |
| `--ink-2` | `#1e1c18` | hovered cards | |
| `--cream` | `#e7dac1` | main text, buttons, the only accent | 14.2:1 on black |
| `--cream-hi` | `#f3ead8` | hover and highlight text | 16.5:1 on black |
| `--cream-lo` | `#c6b89c` | taglines, icons, plate shading | 10.1:1 on black |
| `--mute` | cream at 66% | secondary text on dark | 6.5:1 on black, 6.3:1 on ink |
| `--mute` (in `.light`) | black at 66% | secondary text on the cream band | 5.7:1 on cream |
| `--line` | text color at 16% | hairlines and borders | decorative |
| error `#e8a898` | | field errors | 9.8:1 on black |

Black text on a cream button or band is 14.2:1. All text pairs are above 4.5:1 (ratios computed with the WCAG formula).
Rules: use the variables, never new hex values. Cream is the only accent. A light band is a `.sec.light` section
(it swaps `--bg` / `--fg`). Status colors stay simple: errors use the soft red above.

## 3. Typography
| Use | Font | Notes |
|---|---|---|
| Headings, dish names, prices, logo | **Lora** (variable, normal + italic) | weight 400-500, never `fw-bold` |
| Body, buttons, nav, forms | **Sora** (variable) | 16 px base, line height 1.7; small caps labels use letter-spacing |
Both are self-hosted in `client/public/fonts` (no external request). Minimum text size 13 px.

## 4. Layout and shapes
- Mobile first; test at 390 px and 1440 px. No horizontal scrolling.
- Page width `--page-max` 1460 px, gutter `--gutter` (clamp 1.25 to 2.5 rem). Bootstrap grid inside `.container`.
- Each page renders its own `<main id="main">`. Inner pages start with a `.page-head` band; sections use `.sec` (add `.light` for a cream band).
- Corners use `--radius` (0.65 rem) on controls; cards are square. 1 px hairlines (`--line`).
- Breakpoints are Bootstrap's (576, 768, 992 px) plus 991.98 / 575.98 px max-width rules used by Velora.

## 5. Components
| Need | Use |
|---|---|
| Main action | `btn-solid` (`sm` for small) |
| Secondary action | `btn-ghost` |
| Dish | `<DishCard item category />` in a `row g-4` with `col-sm-6 col-lg-4` |
| Dish photo | `<Img>` (logo placeholder when the file is missing) |
| Loading / error / empty | `<Loader />`, `<ErrorMessage />`, a `.state` block |
| Form field | the Contact page pattern: `.field`, `<label>`, `.form-control`, `.field-err`, `.form-error` |
| Dropdown | `<Dropdown>` |
| Icons | `lucide-react` (always `aria-hidden` when decorative) |

## 6. Accessibility
- Visible focus ring (2 px cream, 3 px offset) on every interactive element; "Skip to content" link first on every page.
- `alt` text on images (decorative images use `alt=""`), a `<label>` for every input, real `<button>` and `<a>` elements.
- Text contrast at least 4.5:1 (see section 2). Keyboard: the mobile menu closes with Esc and returns focus to the burger.

## 7. Motion
Velora animates the hero, the plate, the footer tagline and hover states. All of it is switched off or reduced under
`prefers-reduced-motion` (end of `pages.css`). New motion must follow the same rule.

## 8. What the team may and may not change
- **May:** texts through `brand.js` and `translations.js`; photos (same file names); new classes in `app.css`; new pages that follow section 4.
- **May not:** rename or edit Velora classes, add a second design system, add colors or fonts outside the tokens, load fonts from a CDN.

## History
The team first chose a dark and gold **Nocturne** direction (Italiana + Manrope fonts, gold accent). It was retired when the
Velora design was merged in. Its files are kept in `docs/design/reference/nocturne-archive/` and the concept page in
`docs/design/reference/nocturne-concept.html`; neither is used by the code.
