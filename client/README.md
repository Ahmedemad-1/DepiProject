# Client (React)

React + Vite + Bootstrap + React Router.

```bash
npm install
cp .env.example .env     # Windows: copy .env.example .env
npm run mock             # terminal 1: fake API on http://localhost:3001
npm run dev              # terminal 2: the website on http://localhost:5173
```

Open http://localhost:5173/menu to check that the menu loads from the mock API.

## Folders
- `src/pages` – one file per page (admin pages in `src/pages/admin`)
- `src/components` – reusable pieces (Navbar, DishCard, ...)
- `src/context` – AuthContext, CartContext
- `src/services/api.js` – ALL API calls (single place to change)
- `src/utils` – validators, price helpers, translations
- `public/images` – dish photos (file names match the `image` field in `server/mock/db.json`)
