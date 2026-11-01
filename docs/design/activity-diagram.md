<!--
FILE      : docs/design/activity-diagram.md
DEPI ITEM : System Analysis & Design - Activity Diagram
OWNER     : Shorouk (suggested - change if the team reassigns)
DUE       : 6 Nov 2026
WHAT TO DO:
  1. Required only if the instructor asks. Draw the workflow of ordering (browse -> cart -> login -> checkout -> track).
Delete this comment block when the file is done.
-->

# Activity Diagram

```mermaid
flowchart TD
  A([Start]) --> B[Browse menu]
  B --> C[Add dish to cart]
  C --> D{Logged in?}
  D -- No --> E[Login or register]
  D -- Yes --> F[Checkout]
  E --> F
  F --> G[Place order]
  G --> H([Track order])
```

TODO: add decisions for unavailable dishes and declined payment.
