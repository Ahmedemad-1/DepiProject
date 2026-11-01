"""
FILE    : server/app/main.py
OWNER   : Ahmed Emad
STACK   : PROPOSED Python + FastAPI + SQLite. If you choose Node/Express instead,
          delete the server/app folder and replace these files with the Express equivalents.
PURPOSE : Creates the FastAPI app, enables CORS, and includes all routers.

TODO:
  1. Create the FastAPI() app with a title.
  2. Allow CORS for http://localhost:5173 and the deployed frontend URL (from config.py).
  3. Include the routers from app/routers/.
  4. Create the tables on startup (or via seed.py).
  5. Add GET /health that returns {"status": "ok"}.

Remove this PLACEHOLDER note when the file is real. Follow docs/api.md and CLAUDE.md section 12.
"""
