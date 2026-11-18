# Client (React)

React + Vite + Bootstrap + React Router. Design: Velora (by [FRIEND'S NAME]).

```bash
npm install
cp .env.example .env     # Windows: copy .env.example .env
npm run mock             # terminal 1: fake API on http://localhost:3001
npm run dev              # terminal 2: the website on http://localhost:5173
```

Open http://localhost:5173/menu to check that the menu loads from the mock API.

## Folders
- `src/pages` – one file per page (admin pages in `src/pages/admin`). **All of them already exist as placeholders**: open the file, read the header comment, paste your code, delete the placeholder lines. Full list: `../docs/pages.md`
- `src/components` – reusable pieces (Navbar, Footer, DishCard, Loader, ...)
- `src/hooks` – `useMenu` (loads dishes and categories once)
- `src/context` – AuthContext, CartContext (cart saved in localStorage)
- `src/services/api.js` – ALL API calls (single place to change)
- `src/utils` – validators, price helpers, translations
- `src/config/brand.js` – restaurant name, tagline, address, phone (change the name here)
- `src/styles` – the Velora design system (`theme.css` tokens + layout, home, components, menu, dish-details, pages). New CSS only in `app.css`. Rules: `../docs/design/ui-guidelines.md`
- `public/images` – site photos (hero, about, menu header, booking band). Dish photos are still missing: file names must match the `image` field in `server/mock/db.json`
- `public/fonts` – self-hosted Lora and Sora

## Formatting
`npm run format` formats `src/` with Prettier (config in `.prettierrc`). Run it before every commit.
