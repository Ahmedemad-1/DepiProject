# API contract

The frontend talks to this API. For now it is served by **json-server** from
`server/mock/db.json`; the real backend must keep the same paths and fields.

Base URL (dev): `http://localhost:3001` (set with `VITE_API_URL` in `client/.env`)

## Mock API (json-server) – what exists today
| Method | Path | Purpose |
|---|---|---|
| GET | `/settings` | Opening hours, size multipliers, statuses |
| GET | `/categories` | All categories |
| GET | `/menuItems` | All dishes. Filters: `?categoryId=4`, `?isVegetarian=true`, `?q=pizza` |
| GET | `/menuItems/:id` | One dish |
| POST / PATCH / DELETE | `/menuItems`, `/menuItems/:id` | Admin: add / edit / delete a dish |
| GET | `/users?email=...` | Used for the demo login |
| POST | `/users` | Register |
| POST | `/orders` + `/orderItems` | Create an order and its items |
| GET | `/orders?userId=2` | My orders |
| GET | `/orderItems?orderId=1` | Items of an order |
| PATCH | `/orders/:id` | Admin: change `status` |
| POST | `/reservations` | Create a reservation |
| GET | `/reservations?userId=2` | My reservations |
| PATCH | `/reservations/:id` | Admin: confirm / cancel (`status`) |

## Real backend (target)
| Method | Path | Notes |
|---|---|---|
| POST | `/auth/register`, `/auth/login` | Returns a JWT; passwords stored hashed |
| GET | `/menu`, `/menu/{id}` | Public |
| POST / PUT / DELETE | `/menu`, `/menu/{id}` | Admin only |
| POST | `/orders` | Customer; body includes the items |
| GET | `/orders` | Customer: own orders. Admin: all orders |
| PATCH | `/orders/{id}/status` | Admin only |
| POST | `/reservations` | Customer |
| GET | `/reservations` | Customer: own. Admin: all |
| PATCH | `/reservations/{id}` | Admin only |

Differences from the mock (menu path, nested order items, JWT) will be listed here when the backend is built.

## Additions made by the Velora merge (backward compatible)
- `categories[].description` (string, optional, may be empty): short line shown on the Home category cards and above a category on the Menu page. Only "Desserts" has text (taken from Velora). The backend (`server/schema.sql`, `models`, `schemas`) does not have this column yet: add it as a nullable text column, or ignore it (the website works without it).
- `categories[].image` (string, optional): photo for the Home category card (a URL or `/images/...` path). Only Velora's categories have one.
- `menuItems[].imageSquare` (string, optional): a second, square photo used by the Home showcase and the dish page; when missing the website uses `image`. Dishes that have it are the ones the Home showcase rotates through.
- **Velora's 13 original dishes were added to `menuItems`** (ids 117-129, in Velora's order) with their original names, descriptions, vegetarian flags and Unsplash photo URLs, plus 7 categories (ids 13-19: Starters, Salads, Pizza, Pasta, Burgers, Main Courses, Drinks). Velora's "Desserts" dish went into the existing Desserts category (id 9). Extras per category are Velora's original ones. `nameAr` and `descriptionAr` are empty strings (no translation was invented).
- **Currency is now US dollars.** `settings.currency` = "USD". Velora's 13 dishes keep their original dollar prices. The 116 original dishes, their extras and the 4 sample orders were converted from EGP at a flat **50 EGP = $1** (`price / 50`, 2 decimals), so most Egyptian dishes cost under $5 (range $0.20 to $19). Edit any price in `db.json` or with the menu editor. Prices may have cents; unit price is rounded to cents.
- `settings.restaurantName` is now `"VELORA"`.
- No field was renamed or removed. The website uses `categoryId`, `basePrice`, `availableSizes`, `extras`, `isVegetarian`, `isAvailable`, `image` of each menu item.
- The contact form does not use this API: it posts to Web3forms (`sendContactMessage` in `services/api.js`, key from `VITE_WEB3FORMS_KEY`).

## Data rules
- Size multipliers: small = 0.7, medium = 1, large = 1.2 (`settings.sizeMultipliers`)
- Unit price = `basePrice × size multiplier + selected extras`
- Order statuses: `received → preparing → ready → picked_up` (cancel only before `preparing`)
- Reservation: party size 1–10, no past dates, within opening hours
- Order JSON example:
```json
{ "userId": 2, "pickupTime": "2026-11-12T20:15", "paymentMethod": "cash",
  "subtotal": 207, "total": 207, "status": "received", "createdAt": "2026-11-12T19:40:00" }
```
