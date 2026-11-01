<!--
FILE      : docs/design/class-diagram.md
DEPI ITEM : System Analysis & Design - Class Diagram
OWNER     : Ahmed Emad (suggested - change if the team reassigns)
DUE       : 6 Nov 2026
WHAT TO DO:
  1. Required only if the instructor asks.
  2. Base it on the models in docs/design/erd.md: User, Category, MenuItem, Order, OrderItem, Reservation (attributes, methods, relationships).
Delete this comment block when the file is done.
-->

# Class Diagram

```mermaid
classDiagram
  class User { +id +name +email +role }
  class MenuItem { +id +name +basePrice +isAvailable }
  class Order { +id +status +total +pickupTime }
  class OrderItem { +quantity +size +price }
  class Reservation { +date +time +partySize +status }
  User "1" --> "*" Order
  User "1" --> "*" Reservation
  Order "1" --> "*" OrderItem
  OrderItem "*" --> "1" MenuItem
```

TODO: add methods and the remaining classes.
