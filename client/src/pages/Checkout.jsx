/**
 * PAGE   : Checkout
 * ROUTE  : /checkout
 * ACCESS : Customer (login required)
 * OWNER  : Shorouk
 */
import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { formatPrice } from "../utils/formatPrice.js";
import {
  getSettings,
  createOrder,
  createOrderItem,
} from "../services/api.js";

/* ---------- small helpers ---------- */
const pad = (n) => String(n).padStart(2, "0");

// "2026-11-21T18:30:00" (local time, same style as db.json)
const toLocalIso = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
  `T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;

// "18:30" -> 1110 (minutes since midnight)
const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

const nowMinutes = () => {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
};

const DEMO_DECLINED_ENDING = "0000";

export default function Checkout() {
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();

  // Set to true once the order is placed, so we do not redirect to /cart
  // when the cart becomes empty after clearCart().
  const orderPlaced = useRef(false);

  const [hours, setHours] = useState(null); // { open: "08:00", close: "23:59" }
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [pickupMode, setPickupMode] = useState("asap"); // "asap" | "scheduled"
  const [pickupTime, setPickupTime] = useState(""); // "HH:MM"
  const [payment, setPayment] = useState("cash"); // "cash" | "card"
  const [cardNumber, setCardNumber] = useState(""); // digits only
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Opening hours come from the settings
  useEffect(() => {
    let cancelled = false;
    getSettings()
      .then((s) => {
        if (!cancelled) setHours(s.openingHours);
      })
      .catch(() => {
        if (!cancelled) setHours(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Rule: redirect to /cart if the cart is empty
  if (items.length === 0 && !orderPlaced.current) {
    return <Navigate to="/cart" replace />;
  }

  /* ---------- validation ---------- */
  function validate() {
    const e = {};

    if (!name.trim()) e.name = "Please enter your name.";

    const cleanPhone = phone.replace(/[\s-]/g, "");
    if (!/^\+?[0-9]{8,15}$/.test(cleanPhone)) {
      e.phone = "Please enter a valid phone number.";
    }

    if (!hours) {
      e.pickup = "Could not load the opening hours. Please try again.";
    } else if (pickupMode === "asap") {
      const now = nowMinutes();
      if (now < toMinutes(hours.open) || now > toMinutes(hours.close)) {
        e.pickup = `We are closed right now (open ${hours.open} - ${hours.close}). Choose a pickup time instead.`;
      }
    } else if (!pickupTime) {
      e.pickup = "Please choose a pickup time.";
    } else {
      const t = toMinutes(pickupTime);
      if (t < toMinutes(hours.open) || t > toMinutes(hours.close)) {
        e.pickup = `Pickup time must be between ${hours.open} and ${hours.close}.`;
      } else if (t < nowMinutes()) {
        e.pickup = "Pickup time cannot be in the past.";
      }
    }

    if (payment === "card") {
      if (cardNumber.length !== 16) {
        e.cardNumber = "Card number must be 16 digits.";
      }

      const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(expiry);
      if (!match) {
        e.expiry = "Use the format MM/YY.";
      } else {
        const month = Number(match[1]);
        const year = 2000 + Number(match[2]);
        const today = new Date();
        const expired =
          year < today.getFullYear() ||
          (year === today.getFullYear() && month < today.getMonth() + 1);
        if (expired) e.expiry = "This card has expired.";
      }

      if (!/^[0-9]{3,4}$/.test(cvv)) e.cvv = "CVV must be 3 or 4 digits.";
    }

    return e;
  }

  /* ---------- submit ---------- */
  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;

    const found = validate();

    if (!user) {
      found.form = "Please log in to place your order.";
    }

    // Demo rule: a card ending in 0000 is DECLINED and creates NO order
    if (
      Object.keys(found).length === 0 &&
      payment === "card" &&
      cardNumber.endsWith(DEMO_DECLINED_ENDING)
    ) {
      found.form = "Your card was declined. Please use another card.";
    }

    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      const now = new Date();
      const pickup =
        pickupMode === "asap"
          ? toLocalIso(now)
          : (() => {
              const [h, m] = pickupTime.split(":").map(Number);
              const d = new Date();
              d.setHours(h, m, 0, 0);
              return toLocalIso(d);
            })();

      const subtotal = Number(total.toFixed(2));

      // NOTE: card number, expiry and CVV are never sent or stored.
      const order = await createOrder({
        userId: user.id,
        pickupTime: pickup,
        paymentMethod: payment,
        subtotal,
        total: subtotal,
        status: "received",
        createdAt: toLocalIso(now),
      });

      await Promise.all(
        items.map((line) =>
          createOrderItem({
            orderId: order.id,
            menuItemId: line.menuItemId,
            name: line.name,
            quantity: line.quantity,
            size: line.size,
            extras: (line.extras ?? []).map((x) => x.name),
            price: line.unitPrice,
          }),
        ),
      );

      orderPlaced.current = true;
      clearCart();
      navigate(`/orders/${order.id}`, { state: { justPlaced: true } });
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
      setSubmitting(false);
    }
  }

  /* ---------- UI ---------- */
  return (
    <main id="main">
      <section className="sec">
        <div className="page-head">
          <h1>Checkout</h1>
        </div>

        <form className="checkout-layout" onSubmit={handleSubmit} noValidate>
          <div className="checkout-fields">
            {/* ---- Customer ---- */}
            <fieldset className="checkout-group">
              <legend>Your details</legend>

              <label className="checkout-label" htmlFor="co-name">
                Name
              </label>
              <input
                id="co-name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <p className="checkout-error">{errors.name}</p>}

              <label className="checkout-label" htmlFor="co-phone">
                Phone
              </label>
              <input
                id="co-phone"
                className="form-control"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && (
                <p className="checkout-error">{errors.phone}</p>
              )}
            </fieldset>

            {/* ---- Pickup ---- */}
            <fieldset className="checkout-group">
              <legend>Pickup time</legend>

              <label className="checkout-choice">
                <input
                  type="radio"
                  name="pickup"
                  checked={pickupMode === "asap"}
                  onChange={() => setPickupMode("asap")}
                />
                As soon as possible
              </label>

              <label className="checkout-choice">
                <input
                  type="radio"
                  name="pickup"
                  checked={pickupMode === "scheduled"}
                  onChange={() => setPickupMode("scheduled")}
                />
                Choose a time
              </label>

              {pickupMode === "scheduled" && (
                <input
                  className="form-control"
                  type="time"
                  aria-label="Pickup time"
                  min={hours?.open}
                  max={hours?.close}
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                />
              )}
              {hours && (
                <p className="checkout-hint">
                  Opening hours: {hours.open} - {hours.close}
                </p>
              )}
              {errors.pickup && (
                <p className="checkout-error">{errors.pickup}</p>
              )}
            </fieldset>

            {/* ---- Payment ---- */}
            <fieldset className="checkout-group">
              <legend>Payment</legend>

              <label className="checkout-choice">
                <input
                  type="radio"
                  name="payment"
                  checked={payment === "cash"}
                  onChange={() => setPayment("cash")}
                />
                Cash on pickup
              </label>

              <label className="checkout-choice">
                <input
                  type="radio"
                  name="payment"
                  checked={payment === "card"}
                  onChange={() => setPayment("card")}
                />
                Card (demo)
              </label>

              {payment === "card" && (
                <>
                  <label className="checkout-label" htmlFor="co-card">
                    Card number
                  </label>
                  <input
                    id="co-card"
                    className="form-control"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber.replace(/(.{4})/g, "$1 ").trim()}
                    onChange={(e) =>
                      setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))
                    }
                  />
                  {errors.cardNumber && (
                    <p className="checkout-error">{errors.cardNumber}</p>
                  )}

                  <div className="checkout-row">
                    <div>
                      <label className="checkout-label" htmlFor="co-exp">
                        Expiry
                      </label>
                      <input
                        id="co-exp"
                        className="form-control"
                        autoComplete="off"
                        placeholder="MM/YY"
                        maxLength={5}
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                      />
                      {errors.expiry && (
                        <p className="checkout-error">{errors.expiry}</p>
                      )}
                    </div>
                    <div>
                      <label className="checkout-label" htmlFor="co-cvv">
                        CVV
                      </label>
                      <input
                        id="co-cvv"
                        className="form-control"
                        inputMode="numeric"
                        autoComplete="off"
                        maxLength={4}
                        value={cvv}
                        onChange={(e) =>
                          setCvv(e.target.value.replace(/\D/g, ""))
                        }
                      />
                      {errors.cvv && (
                        <p className="checkout-error">{errors.cvv}</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              <p className="checkout-demo">
                Demo mode - no real payment is processed
              </p>
            </fieldset>
          </div>

          {/* ---- Order summary ---- */}
          <aside className="checkout-summary">
            <h2>Order summary</h2>
            <ul className="checkout-lines">
              {items.map((line) => (
                <li key={line.lineId} className="checkout-line">
                  <span>
                    {line.quantity} x {line.name}
                    {line.size ? ` (${line.size})` : ""}
                  </span>
                  <span>{formatPrice(line.unitPrice * line.quantity)}</span>
                </li>
              ))}
            </ul>
            <p className="checkout-total">
              <span>Total</span>
              <strong>{formatPrice(total)}</strong>
            </p>

            {errors.form && (
              <p className="checkout-error" role="alert">
                {errors.form}
              </p>
            )}

            <button type="submit" className="btn-solid" disabled={submitting}>
              {submitting ? "Placing order..." : "Place order"}
            </button>
          </aside>
        </form>
      </section>
    </main>
  );
}