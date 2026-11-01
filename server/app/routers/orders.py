"""
FILE    : server/app/routers/orders.py
OWNER   : Ahmed Emad
STACK   : PROPOSED Python + FastAPI + SQLite. If you choose Node/Express instead,
          delete the server/app folder and replace these files with the Express equivalents.
PURPOSE : Order endpoints.

TODO:
  1. POST /orders - customer; body includes the items; the server recomputes the prices (size multiplier + extras) and does not trust the client's total.
  2. GET /orders - customer: own orders only; admin: all orders.
  3. GET /orders/{id} - owner or admin.
  4. PATCH /orders/{id}/status - admin; allow only received -> preparing -> ready -> picked_up, and cancelled only from received (customers may cancel their own order while it is 'received').

Remove this PLACEHOLDER note when the file is real. Follow docs/api.md and CLAUDE.md section 12.
"""
