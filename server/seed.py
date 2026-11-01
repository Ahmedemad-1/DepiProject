"""
FILE    : server/seed.py
OWNER   : Ahmed Emad
STACK   : PROPOSED Python + FastAPI + SQLite. If you choose Node/Express instead,
          delete the server/app folder and replace these files with the Express equivalents.
PURPOSE : One-time script that creates the tables and loads server/mock/db.json into the database.

TODO:
  1. Read server/mock/db.json.
  2. Create the tables from the models (or run schema.sql).
  3. Insert categories, menu items + extras, users (HASH the demo passwords), orders, order items, reservations.
  4. Make it safe to run twice (clear the tables first or skip existing rows).

Remove this PLACEHOLDER note when the file is real. Follow docs/api.md and CLAUDE.md section 12.
"""
