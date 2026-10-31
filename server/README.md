# Server (backend + database)

Status: **in progress** (owner: Ahmed Emad).

Until the real backend is ready, the frontend uses the mock API:
`server/mock/db.json` served by json-server (see `client/README.md`).

## The contract
The real backend must expose the **same endpoints and data shape** as the mock API,
documented in `docs/api.md`. That way the frontend only changes `VITE_API_URL`.

## Files
- `mock/db.json` – mock database (32 dishes, 8 categories, demo users, sample orders and reservations)
- `schema.sql` – relational schema (SQLite-compatible) matching the ERD in `docs/design/erd.md`

## Planned work
1. Create tables from `schema.sql` and seed them from `mock/db.json`
2. Auth (register / login with hashed passwords + JWT)
3. Menu, orders, reservations endpoints
4. Admin-only endpoints (role check)
5. Auto-generated API docs and deployment

## Demo-data warning
Passwords in `mock/db.json` are plain text on purpose. They are for the mock API only.
The real backend must store hashed passwords.
