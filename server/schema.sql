-- Relational schema for the restaurant project (SQLite-compatible).
-- Matches docs/design/erd.md and the shape of server/mock/db.json.

PRAGMA foreign_keys = ON;

CREATE TABLE users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT    NOT NULL,
  email         TEXT    NOT NULL UNIQUE,
  password_hash TEXT    NOT NULL,
  phone         TEXT,
  role          TEXT    NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin'))
);

CREATE TABLE categories (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  name    TEXT NOT NULL UNIQUE,
  name_ar TEXT
);

CREATE TABLE menu_items (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id   INTEGER NOT NULL REFERENCES categories(id),
  name          TEXT    NOT NULL,
  name_ar       TEXT,
  description   TEXT,
  base_price    REAL    NOT NULL CHECK (base_price >= 0),
  image         TEXT,
  is_vegetarian INTEGER NOT NULL DEFAULT 0,
  is_available  INTEGER NOT NULL DEFAULT 1
);

-- Optional extras that only some dishes support.
CREATE TABLE menu_item_extras (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  menu_item_id INTEGER NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  name         TEXT    NOT NULL,
  name_ar      TEXT,
  price        REAL    NOT NULL CHECK (price >= 0)
);

CREATE TABLE orders (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id        INTEGER NOT NULL REFERENCES users(id),
  pickup_time    TEXT    NOT NULL,
  payment_method TEXT    NOT NULL CHECK (payment_method IN ('cash', 'card_demo')),
  subtotal       REAL    NOT NULL,
  total          REAL    NOT NULL,
  status         TEXT    NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'preparing', 'ready', 'picked_up', 'cancelled')),
  created_at     TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Each line keeps a copy of the dish name and the unit price at order time,
-- so old orders still read correctly after a dish is renamed or removed.
CREATE TABLE order_items (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id     INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE SET NULL,
  name         TEXT    NOT NULL, -- dish name copied at order time
  quantity     INTEGER NOT NULL CHECK (quantity > 0),
  size         TEXT    NOT NULL DEFAULT 'medium' CHECK (size IN ('small', 'medium', 'large')),
  extras       TEXT,             -- JSON list of selected extra names, e.g. ["Extra Cheese"]
  price        REAL    NOT NULL  -- unit price after size and extras
);

CREATE TABLE reservations (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id),
  date       TEXT    NOT NULL,
  time       TEXT    NOT NULL,
  party_size INTEGER NOT NULL CHECK (party_size BETWEEN 1 AND 10),
  phone      TEXT,
  note       TEXT,
  status     TEXT    NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled'))
);

CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_orders_user         ON orders(user_id);
CREATE INDEX idx_order_items_order   ON order_items(order_id);
CREATE INDEX idx_reservations_user   ON reservations(user_id);
