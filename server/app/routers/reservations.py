"""
FILE    : server/app/routers/reservations.py
OWNER   : Ahmed Emad
STACK   : PROPOSED Python + FastAPI + SQLite. If you choose Node/Express instead,
          delete the server/app folder and replace these files with the Express equivalents.
PURPOSE : Reservation endpoints.

TODO:
  1. POST /reservations - customer; validate: date not in the past, time inside opening hours, party size 1-10, one pending reservation per user per date+time.
  2. GET /reservations - customer: own; admin: all.
  3. PATCH /reservations/{id} - admin confirms/cancels; the owner may cancel a pending one.

Remove this PLACEHOLDER note when the file is real. Follow docs/api.md and CLAUDE.md section 12.
"""
