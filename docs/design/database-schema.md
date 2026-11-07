# Database Schema

The physical schema is `server/schema.sql` (SQLite). The diagram is `docs/design/erd.md`. The mock API (`server/mock/db.json`) has the same data in camelCase.

## Tables

### users
| Column | Type | Notes |
|---|---|---|
| id | integer, primary key | auto-increment |
| name | text | required |
| email | text | required, unique |
| password_hash | text | required; the mock file stores a plain `password` for demo only |
| phone | text | Egyptian format 01XXXXXXXXX |
| role | text | `customer` or `admin`, default `customer` |

### categories
| Column | Type | Notes |
|---|---|---|
| id | integer, primary key | |
| name | text | required, unique |
| name_ar | text | Arabic name |

### menu_items
| Column | Type | Notes |
|---|---|---|
| id | integer, primary key | |
| category_id | integer, foreign key | to categories.id, required |
| name, name_ar | text | |
| description | text | |
| base_price | real | 0 or more; this is the medium size price |
| image | text | path such as `/images/margherita-pizza.jpg` |
| is_vegetarian | integer | 0 or 1 |
| is_available | integer | 0 or 1; unavailable dishes cannot be ordered |

### menu_item_extras
| Column | Type | Notes |
|---|---|---|
| id | integer, primary key | |
| menu_item_id | integer, foreign key | to menu_items.id; deleted with the dish |
| name, name_ar | text | |
| price | real | 0 or more |

### orders
| Column | Type | Notes |
|---|---|---|
| id | integer, primary key | |
| user_id | integer, foreign key | to users.id, required |
| pickup_time | text | date and time chosen by the customer |
| payment_method | text | `cash` or `card_demo` |
| subtotal, total | real | equal, because pickup has no fees |
| status | text | `received`, `preparing`, `ready`, `picked_up`, `cancelled` |
| created_at | text | set by the database |

### order_items
| Column | Type | Notes |
|---|---|---|
| id | integer, primary key | |
| order_id | integer, foreign key | to orders.id; deleted with the order |
| menu_item_id | integer, foreign key | to menu_items.id; set to empty if the dish is deleted |
| name | text | dish name copied when the order is placed |
| quantity | integer | above 0 |
| size | text | `small`, `medium`, or `large` |
| extras | text | JSON list of the selected extra names |
| price | real | unit price after size and extras |

### reservations
| Column | Type | Notes |
|---|---|---|
| id | integer, primary key | |
| user_id | integer, foreign key | to users.id, required |
| date, time | text | |
| party_size | integer | 1 to 10 |
| phone, note | text | |
| status | text | `pending`, `confirmed`, `cancelled` |

## Price rule
Unit price = `round(base_price x size multiplier + selected extras)`, with multipliers small 0.7, medium 1, large 1.2 (from `settings`, which is a fixed object in the API and not a table). The server must recompute the price and ignore the total sent by the browser.

## Normalization notes
- **Extras have their own table.** A dish can have zero, one, or many extras, so putting them in a column would repeat groups of data. This follows first normal form.
- **Orders and order items are separate.** One order holds many dishes, and one dish appears in many orders. `order_items` resolves that many-to-many relation.
- **Categories are separate from dishes.** The category name is stored once, so renaming it changes one row.
- **Two deliberate copies.** `order_items.name` and `order_items.price` copy values from the menu, and `order_items.extras` is a JSON list of names. This breaks strict normalization on purpose: an order is a record of what was sold, so later menu edits must not change old orders.
- **Settings are not a table.** Opening hours, size multipliers, and status lists change rarely and live in one fixed object returned by `GET /settings`.
- **Naming.** The database uses snake_case (`base_price`); the API and the mock file use camelCase (`basePrice`). The backend converts between them.
