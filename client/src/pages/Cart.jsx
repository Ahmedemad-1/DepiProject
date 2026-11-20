/**
 * PAGE   : Cart
 * ROUTE  : /cart
 * ACCESS : Public (login is required only at checkout)
 * OWNER  : Shorouk
 */
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { formatPrice } from "../utils/formatPrice.js";

export default function Cart() {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();

  // Empty cart: friendly message + link to the menu
  if (items.length === 0) {
    return (
      <main id="main">
        <section className="sec">
          <div className="state cart-empty">
            <h1>Your cart is empty</h1>
            <p>Pick a dish from the menu and it will show up here.</p>
            <Link to="/menu" className="btn-solid">
              Browse the menu
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main id="main">
      <section className="sec">
        <div className="page-head">
          <h1>Your cart</h1>
        </div>

        <div className="cart-layout">
          {/* ---- List of cart lines ---- */}
          <ul className="cart-list">
            {items.map((line) => (
              <li key={line.lineId} className="cart-item">
                <img
                  className="cart-item-img"
                  src={line.image}
                  alt={line.name}
                />

                <div className="cart-item-info">
                  <h2 className="cart-item-name">{line.name}</h2>
                  {line.size && (
                    <p className="cart-item-meta">Size: {line.size}</p>
                  )}
                  {line.extras?.length > 0 && (
                    <p className="cart-item-meta">
                      Extras: {line.extras.map((e) => e.name).join(", ")}
                    </p>
                  )}

                  <div className="cart-qty">
                    <button
                      type="button"
                      className="cart-qty-btn"
                      aria-label={`Decrease quantity of ${line.name}`}
                      onClick={() =>
                        updateQuantity(line.lineId, line.quantity - 1)
                      }
                    >
                      <Minus size={16} />
                    </button>
                    <span className="cart-qty-value">{line.quantity}</span>
                    <button
                      type="button"
                      className="cart-qty-btn"
                      aria-label={`Increase quantity of ${line.name}`}
                      onClick={() =>
                        updateQuantity(line.lineId, line.quantity + 1)
                      }
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="cart-item-side">
                  <p className="cart-item-total">
                    {formatPrice(line.unitPrice * line.quantity)}
                  </p>
                  <button
                    type="button"
                    className="cart-remove"
                    aria-label={`Remove ${line.name}`}
                    onClick={() => removeItem(line.lineId)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* ---- Order summary ---- */}
          <aside className="cart-summary">
            <h2>Order summary</h2>
            <p className="cart-summary-row">
              <span>Total</span>
              <strong>{formatPrice(total)}</strong>
            </p>
            <Link to="/checkout" className="btn-solid">
              Proceed to checkout
            </Link>
            <button type="button" className="btn-ghost" onClick={clearCart}>
              Clear cart
            </button>
          </aside>
        </div>
      </section>
    </main>
  );
}