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

## Data rules
- Size multipliers: small = 0.8, medium = 1, large = 1.3 (`settings.sizeMultipliers`)
- Unit price = `basePrice × size multiplier + selected extras`
- Order statuses: `received → preparing → ready → picked_up` (cancel only before `preparing`)
- Reservation: party size 1–10, no past dates, within opening hours
- Order JSON example:
```json
{ "userId": 2, "pickupTime": "2026-11-12T20:15", "paymentMethod": "cash",
  "subtotal": 207, "total": 207, "status": "received", "createdAt": "2026-11-12T19:40:00" }
```
