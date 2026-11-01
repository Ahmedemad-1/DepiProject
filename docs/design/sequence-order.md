<!--
FILE      : docs/design/sequence-order.md
DEPI ITEM : System Analysis & Design - Sequence Diagram (place an order)
OWNER     : Shorouk (suggested - change if the team reassigns)
DUE       : 6 Nov 2026
WHAT TO DO:
  1. Check the steps against what the code really does, and add the error paths (declined card, unavailable dish).
Delete this comment block when the file is done.
-->

# Sequence Diagram: Place an Order

```mermaid
sequenceDiagram
  actor Customer
  participant UI as React site
  participant API as API (json-server / backend)
  participant DB as Database
  Customer->>UI: Open checkout (cart has items)
  UI->>Customer: Ask pickup time and payment method
  Customer->>UI: Confirm order
  UI->>UI: Validate (demo card: 0000 is declined)
  UI->>API: POST /orders
  API->>DB: Save order
  loop each cart line
    UI->>API: POST /orderItems
    API->>DB: Save item
  end
  API-->>UI: Order created
  UI-->>Customer: Show order tracking page
```
