export const SIZE_MULTIPLIERS = { small: 0.8, medium: 1, large: 1.3 }

export function formatPrice(amount) {
  return `${Math.round(amount)} EGP`
}

// Unit price = base price x size multiplier + selected extras.
// `extras` is the list of selected extra objects: [{ name, price }]
export function calcUnitPrice(basePrice, size = 'medium', extras = []) {
  const extrasTotal = extras.reduce((sum, e) => sum + e.price, 0)
  return Math.round(basePrice * SIZE_MULTIPLIERS[size] + extrasTotal)
}
