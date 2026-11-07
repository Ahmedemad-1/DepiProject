# Restaurant Website – DEPI Graduation Project

A restaurant website with online pickup ordering and table reservation, plus an admin dashboard.
Restaurant name: **Nocturne** (working name, one-line change in `client/src/config/brand.js`). Look: dark and gold, see `docs/design/ui-guidelines.md`.

## Features
- Browse the menu by category, search, and filter (price, vegetarian)
- Dish details with size (small / medium / large) and optional extras
- Cart saved in the browser, checkout for **pickup only**, demo payment (no real money)
- Order tracking: received → preparing → ready → picked up
- Table reservation
- Admin: manage menu items, orders, and reservations

## Team
| Member | Responsibility (proposed – edit as agreed) |
|---|---|
| Ahmed Emad | Backend and database, GitHub and deployment, README and API docs |
| Ahmed Taher | Home, Menu, Dish details |
| Shorouk | Cart, Checkout, Order tracking |
| Heba Talaat | Login/Register, Reservation, Admin dashboard (UI) |

## Tech stack
- Frontend: React (Vite), Bootstrap (dark theme), React Router, Italiana + Manrope fonts
- API for development: json-server (fake API from `server/mock/db.json`)
- Real backend + database: in progress in `server/` (proposed: Python + FastAPI + SQLite)
- Design: Figma
- Deployment: Netlify / Vercel (frontend)

## Repository structure
```
client/      React website
server/      backend, database schema, and mock data
docs/        planning, design, testing, API docs, user manual
.github/     pull request template
```

## Run it locally
Requirements: Node.js 20+ and Git.

```bash
git clone <repo-url>
cd restaurant-project/client
npm install
cp .env.example .env        # Windows: copy .env.example .env
npm run mock                # terminal 1 – API on http://localhost:3001
npm run dev                 # terminal 2 – site on http://localhost:5173
```

### Demo accounts (mock data only – never use real passwords)
| Role | Email | Password |
|---|---|---|
| Admin | admin@restaurant.test | Admin@123 |
| Customer | customer1@example.test | Test@123 |

## Documentation
- Project plan: `docs/planning/`
- Design (wireframes, ERD, diagrams): `docs/design/`
- Testing: `docs/testing/`
- Every deliverable, owner, and due date: `docs/DELIVERABLES.md`
- Pages, files, and owners: `docs/pages.md`
- API contract: `docs/api.md`
- User manual: `docs/user-manual.md`
- How we work on GitHub: `CONTRIBUTING.md`
- AI assistant instructions (for Claude): `CLAUDE.md`

## Live demo
Link: _to be added after deployment_
