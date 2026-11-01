<!--
FILE      : docs/design/state-diagram.md
DEPI ITEM : System Analysis & Design - State Diagram
OWNER     : Shorouk (suggested - change if the team reassigns)
DUE       : 6 Nov 2026
WHAT TO DO:
  1. Required only if the instructor asks (DEPI lists it). Review the starter diagrams.
Delete this comment block when the file is done.
-->

# State Diagrams

## Order
```mermaid
stateDiagram-v2
  [*] --> received
  received --> preparing
  received --> cancelled
  preparing --> ready
  ready --> picked_up
  picked_up --> [*]
  cancelled --> [*]
```

## Reservation
```mermaid
stateDiagram-v2
  [*] --> pending
  pending --> confirmed
  pending --> cancelled
  confirmed --> cancelled
```
