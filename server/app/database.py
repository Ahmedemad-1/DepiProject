"""
FILE    : server/app/database.py
OWNER   : Ahmed Emad
STACK   : PROPOSED Python + FastAPI + SQLite. If you choose Node/Express instead,
          delete the server/app folder and replace these files with the Express equivalents.
PURPOSE : Database connection and session (SQLite via SQLAlchemy).

TODO:
  1. Create the engine from DATABASE_URL (default sqlite:///./restaurant.db).
  2. Create SessionLocal and the Base class for models.
  3. Provide get_db() that opens and closes a session per request.

Remove this PLACEHOLDER note when the file is real. Follow docs/api.md and CLAUDE.md section 12.
"""
