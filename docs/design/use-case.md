<!--
FILE      : docs/design/use-case.md
DEPI ITEM : System Analysis & Design - Use Case Diagram & Descriptions
OWNER     : Heba Talaat (suggested - change if the team reassigns)
DUE       : 6 Nov 2026
WHAT TO DO:
  1. Review and complete the starter diagram.
  2. Write a short description for each use case (actor, steps, result).
Delete this comment block when the file is done.
-->

# Use Case Diagram

```mermaid
flowchart LR
  V([Visitor])
  C([Customer])
  A([Admin])
  V --> UC1(Browse menu)
  V --> UC2(Add to cart)
  C --> UC3(Place pickup order)
  C --> UC4(Track order)
  C --> UC5(Reserve table)
  C --> UC6(Register / Login)
  A --> UC7(Manage menu)
  A --> UC8(Manage orders)
  A --> UC9(Manage reservations)
```

## Use case descriptions
TODO: one short table per use case.
