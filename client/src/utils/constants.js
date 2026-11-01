// Shared constants. Keep these in sync with server/mock/db.json (settings) and docs/api.md.

export const ORDER_STATUSES = [
  "received",
  "preparing",
  "ready",
  "picked_up",
  "cancelled",
];

export const ORDER_STATUS_LABELS = {
  received: "Received",
  preparing: "Preparing",
  ready: "Ready for pickup",
  picked_up: "Picked up",
  cancelled: "Cancelled",
};

// The only allowed next step for each status (the admin moves orders forward one step at a time).
export const NEXT_ORDER_STATUS = {
  received: "preparing",
  preparing: "ready",
  ready: "picked_up",
  picked_up: null,
  cancelled: null,
};

// A customer or admin may cancel only while the order is still 'received'.
export const CANCELLABLE_ORDER_STATUSES = ["received"];

export const RESERVATION_STATUSES = ["pending", "confirmed", "cancelled"];

export const RESERVATION_STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
};

export const PAYMENT_METHODS = {
  cash: "Cash on pickup",
  card_demo: "Card (demo - no real payment)",
};

export const PARTY_SIZE = { min: 1, max: 10 };
