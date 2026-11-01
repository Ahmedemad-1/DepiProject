"""
FILE    : server/app/routers/auth.py
OWNER   : Ahmed Emad
STACK   : PROPOSED Python + FastAPI + SQLite. If you choose Node/Express instead,
          delete the server/app folder and replace these files with the Express equivalents.
PURPOSE : POST /auth/register and POST /auth/login.

TODO:
  1. Register: reject a duplicate email, hash the password, role is always 'customer'.
  2. Login: verify the password and return a JWT plus the safe user object.
  3. Return clear JSON error messages.

Remove this PLACEHOLDER note when the file is real. Follow docs/api.md and CLAUDE.md section 12.
"""
