# ERD

GitHub renders this diagram automatically. Keep it in sync with `server/schema.sql`.

```mermaid
erDiagram
  USERS ||--o{ ORDERS : places
  USERS ||--o{ RESERVATIONS : makes
  CATEGORIES ||--o{ MENU_ITEMS : contains
  MENU_ITEMS ||--o{ MENU_ITEM_EXTRAS : offers
  ORDERS ||--|{ ORDER_ITEMS : includes
  MENU_ITEMS ||--o{ ORDER_ITEMS : "ordered as"

  USERS { int id PK string name string email string password_hash string phone string role }
  CATEGORIES { int id PK string name string name_ar }
  MENU_ITEMS { int id PK int category_id FK string name string description float base_price string image bool is_vegetarian bool is_available }
  MENU_ITEM_EXTRAS { int id PK int menu_item_id FK string name float price }
  ORDERS { int id PK int user_id FK string pickup_time string payment_method float total string status string created_at }
  ORDER_ITEMS { int id PK int order_id FK int menu_item_id FK int quantity string size string extras float price }
  RESERVATIONS { int id PK int user_id FK string date string time int party_size string note string status }
```
