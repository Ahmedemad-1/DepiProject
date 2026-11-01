/**
 * CONTEXT : CartContext
 * OWNER   : Shorouk (suggested - change if the team reassigns)
 * PURPOSE : Holds the shopping cart so any page can read and change it with useCart().
 *
 * CART LINE SHAPE:
 *   { lineId, menuItemId, name, image, size, extras: [{ name, price }], quantity, unitPrice }
 *   - lineId must be unique per (menuItemId + size + sorted extras): the same dish with a
 *     different size or different extras is a SEPARATE line.
 *   - unitPrice = calcUnitPrice(basePrice, size, extras)   (utils/formatPrice.js)
 *
 * TODO (Shorouk):
 *   1. addItem(line)            - add a line, or increase quantity if the same lineId exists
 *   2. updateQuantity(lineId,n) - n <= 0 removes the line
 *   3. removeItem(lineId), clearCart()
 *   4. Persist items in localStorage (use loadJSON/saveJSON from utils/storage.js)
 *   5. Keep total and itemCount COMPUTED from items (never store them)
 *
 * NOTE: the functions below are stubs so the rest of the app can already import useCart().
 */
import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // TODO: initialise from localStorage

  // ---- PLACEHOLDER (replace with real logic) ----------------------------
  const addItem = (line) => {
    console.warn("addItem not implemented yet", line);
  };
  const updateQuantity = (lineId, quantity) => {
    console.warn("updateQuantity not implemented yet", lineId, quantity);
  };
  const removeItem = (lineId) => {
    console.warn("removeItem not implemented yet", lineId);
  };
  const clearCart = () => setItems([]);
  // ------------------------------------------------------------------------

  // Computed values (keep these computed, never stored)
  const itemCount = items.reduce((sum, line) => sum + line.quantity, 0);
  const total = items.reduce(
    (sum, line) => sum + line.unitPrice * line.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        total,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
