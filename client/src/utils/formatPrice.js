export const SIZE_MULTIPLIERS = { small: 0.7, medium: 1, large: 1.2 };

// Prices are in US dollars, shown with cents: $14.00 (Velora's original format).
export function formatPrice(amount) {
  return `$${amount.toFixed(2)}`;
}

// Unit price = base price x size multiplier + selected extras, rounded to whole cents.
// `extras` is the list of selected extra objects: [{ name, price }]
export function calcUnitPrice(basePrice, size = "medium", extras = []) {
  const extrasTotal = extras.reduce((sum, e) => sum + e.price, 0);
  return Math.round((basePrice * SIZE_MULTIPLIERS[size] + extrasTotal) * 100) / 100;
}
