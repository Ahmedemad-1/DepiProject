"""
FILE    : server/app/deps.py
OWNER   : Ahmed Emad
STACK   : PROPOSED Python + FastAPI + SQLite. If you choose Node/Express instead,
          delete the server/app folder and replace these files with the Express equivalents.
PURPOSE : Reusable dependencies for the routers.

TODO:
  1. get_current_user(): reads the Bearer token and loads the user.
  2. require_admin(): returns 403 when the user's role is not 'admin'.

Remove this PLACEHOLDER note when the file is real. Follow docs/api.md and CLAUDE.md section 12.
"""
