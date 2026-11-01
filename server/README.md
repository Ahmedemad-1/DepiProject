# Server (backend + database)

**Owner:** Ahmed Emad. **Status:** placeholder files created, backend not built yet.
**Stack:** PROPOSED Python + FastAPI + SQLite (not final). If you pick Node/Express instead,
delete `app/`, `seed.py`, `requirements.txt` and create the Express equivalents.

Until the real backend is ready, the frontend uses the mock API:
`server/mock/db.json` served by json-server (see `client/README.md`).

## The contract
The real backend must expose the **same data shape** as the mock API, documented in `docs/api.md`,
so the frontend only changes `VITE_API_URL` (and the few paths listed as different in `docs/api.md`).

## Files (each one starts with a comment that says what to do)
```
server/
├── mock/db.json            mock database for json-server (32 dishes, demo users, sample orders)
├── schema.sql              relational schema (SQLite)
├── seed.py                 loads mock/db.json into the real database (hash the passwords!)
├── requirements.txt        Python packages (proposed)
├── .env.example            settings template (copy to .env)
├── app/
│   ├── main.py             FastAPI app, CORS, routers
│   ├── config.py           environment settings
│   ├── database.py         engine and sessions
│   ├── models.py           database models (match schema.sql)
│   ├── schemas.py          request/response models
│   ├── security.py         password hashing + JWT
│   ├── deps.py             current user + admin check
│   └── routers/            auth, categories, menu, orders, reservations, settings
└── tests/test_api.py       automated API tests (optional)
```

## Planned work order
1. Tables from `schema.sql` and `seed.py` (by 6 Nov)
2. Auth + menu endpoints (by 13 Nov)
3. Orders + reservations + admin endpoints (by 20 Nov)
4. API documentation (FastAPI generates it at `/docs`), deployment, tests (by 30 Nov)

## Demo-data warning
Passwords in `mock/db.json` are plain text on purpose (mock API only). The real backend must store hashes.
