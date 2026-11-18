/**
 * CONTEXT : CartContext
 * OWNER   : Shorouk (suggested - change if the team reassigns)
 * PURPOSE : Holds the shopping cart so any page can read and change it with useCart().
 *
 * CART LINE SHAPE:
 *   { lineId, menuItemId, name, image, size, extras: [{ name, price }], quantity, unitPrice }
 *   - lineId is unique per (menuItemId + size + sorted extra names): the same dish with a
 *     different size or different extras is a SEPARATE line. Use makeLineId() (utils/cart.js) to build it.
 *   - unitPrice = calcUnitPrice(basePrice, size, extras)   (utils/formatPrice.js)
 *
 * STATUS  : IMPLEMENTED during the Velora merge (it was a stub) because the Velora dish
 *           page needs a working cart. Shorouk: review it, then build Cart, Checkout, Orders.
 *           Items are saved in localStorage ("cart_items"); total and itemCount are
 *           computed from items, never stored.
 */
import { createContext, useContext, useEffect, useState } from "react";
import { loadJSON, saveJSON } from "../utils/storage.js";

const CartContext = createContext(null);
const STORAGE_KEY = "cart_items";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => loadJSON(STORAGE_KEY, []));

  useEffect(() => {
    saveJSON(STORAGE_KEY, items);
  }, [items]);

  // Add a line, or increase the quantity when the same lineId already exists.
  const addItem = (line) =>
    setItems((prev) => {
      const found = prev.find((l) => l.lineId === line.lineId);
      if (!found) return [...prev, line];
      return prev.map((l) =>
        l.lineId === line.lineId
          ? { ...l, quantity: l.quantity + line.quantity }
          : l,
      );
    });

  // quantity <= 0 removes the line.
  const updateQuantity = (lineId, quantity) =>
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.lineId !== lineId)
        : prev.map((l) => (l.lineId === lineId ? { ...l, quantity } : l)),
    );

  const removeItem = (lineId) =>
    setItems((prev) => prev.filter((l) => l.lineId !== lineId));

  const clearCart = () => setItems([]);

  // Computed values (never stored)
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
