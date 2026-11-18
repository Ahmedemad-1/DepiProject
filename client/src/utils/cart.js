// Helper for cart lines. lineId = menuItemId + size + sorted extra names, so the same dish
// with another size or other extras becomes a separate cart line (see CartContext).
export const makeLineId = (menuItemId, size, extras = []) =>
  [menuItemId, size, ...extras.map((e) => e.name).sort()].join("|");
