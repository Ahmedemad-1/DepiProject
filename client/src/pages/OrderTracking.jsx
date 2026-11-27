/**
 * PAGE   : OrderTracking
 * ROUTE  : /orders/:id
 * ACCESS : Customer (login required)
 * OWNER  : Shorouk
 */
import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Check } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { formatPrice } from "../utils/formatPrice.js";
import { getOrder, getOrderItems, updateOrder } from "../services/api.js";

const STEPS = [
  { key: "received", label: "Received" },
  { key: "preparing", label: "Preparing" },
  { key: "ready", label: "Ready" },
  { key: "picked_up", label: "Picked up" },
];

const PAYMENT_LABELS = {
  cash: "Cash on pickup",
  card: "Card (demo)",
};

const REFRESH_MS = 30000; // auto-refresh every 30 seconds

function formatPickup(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ---------- StatusStepper ---------- */
function StatusStepper({ status }) {
  if (status === "cancelled") {
    return <p className="track-cancelled">This order was cancelled.</p>;
  }

  const current = STEPS.findIndex((s) => s.key === status);

  return (
    <ol className="track-steps" aria-label="Order progress">
      {STEPS.map((step, index) => {
        const state =
          index < current ? "done" : index === current ? "current" : "todo";
        return (
          <li
            key={step.key}
            className={`track-step track-step--${state}`}
            aria-current={state === "current" ? "step" : undefined}
          >
            <span className="track-step-dot">
              {state === "done" ? <Check size={16} /> : index + 1}
            </span>
            <span className="track-step-label">{step.label}</span>
          </li>
        );
      })}
    </ol>
  );
}

export default function OrderTracking() {
  const { id } = useParams();
  const { user } = useAuth();
  const location = useLocation();

  // Set by Checkout right after the order is placed
  const justPlaced = location.state?.justPlaced === true;

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [actionError, setActionError] = useState("");

  // Load the order and its items
  const load = useCallback(async () => {
    try {
      const [orderData, itemsData] = await Promise.all([
        getOrder(id),
        getOrderItems(id),
      ]);
      setOrder(orderData);
      setItems(itemsData);
      setError("");
    } catch {
      setError("We could not find this order.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Load once, then refresh every 30 seconds (cleanup stops the timer)
  useEffect(() => {
    load();
    const timer = setInterval(load, REFRESH_MS);
    return () => clearInterval(timer);
  }, [load]);

  // Cancel is allowed only while the status is still 'received'
  async function handleCancel() {
    if (!window.confirm("Do you want to cancel this order?")) return;

    setCancelling(true);
    setActionError("");
    try {
      // Check the latest status first, the kitchen may have started already
      const latest = await getOrder(id);
      if (latest.status !== "received") {
        setOrder(latest);
        setActionError(
          "Sorry, we already started preparing this order, so it can no longer be cancelled.",
        );
        return;
      }
      const updated = await updateOrder(id, { status: "cancelled" });
      setOrder(updated);
    } catch {
      setActionError("Could not cancel the order. Please try again.");
    } finally {
      setCancelling(false);
    }
  }

  /* ---------- states: loading / not found / no access ---------- */
  if (loading) {
    return (
      <main id="main">
        <section className="sec">
          <div className="state">Loading your order...</div>
        </section>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main id="main">
        <section className="sec">
          <div className="state">
            <h1>Order not found</h1>
            <p>{error || "We could not find this order."}</p>
            <Link to="/orders" className="btn-solid">
              Back to my orders
            </Link>
          </div>
        </section>
      </main>
    );
  }

  // Rule: only the owner of the order (or an admin) may view it
  const allowed = user && (user.role === "admin" || order.userId === user.id);
  if (!allowed) {
    return (
      <main id="main">
        <section className="sec">
          <div className="state">
            <h1>No access</h1>
            <p>You can only view your own orders.</p>
            <Link to="/" className="btn-solid">
              Back to home
            </Link>
          </div>
        </section>
      </main>
    );
  }

  /* ---------- the page ---------- */
  return (
    <main id="main">
      <section className="sec">
        <div className="page-head">
          <h1>Order #{order.id}</h1>
        </div>

        <div className="track-layout">
          {justPlaced && (
            <p className="track-banner" role="status">
              Thank you! Your order has been placed.
            </p>
          )}

          <StatusStepper status={order.status} />

          <p className="track-note">
            This page updates automatically every 30 seconds.
          </p>

          {/* ---- Details ---- */}
          <div className="track-card">
            <p className="track-row">
              <span>Pickup time</span>
              <strong>{formatPickup(order.pickupTime)}</strong>
            </p>
            <p className="track-row">
              <span>Payment</span>
              <strong>
                {PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}
              </strong>
            </p>
          </div>

          {/* ---- Items ---- */}
          <div className="track-card">
            <h2 className="track-title">Your items</h2>
            <ul className="track-items">
              {items.map((item) => (
                <li key={item.id} className="track-item">
                  <div>
                    <p className="track-item-name">
                      {item.quantity} x {item.name}
                    </p>
                    {item.size && (
                      <p className="track-item-meta">Size: {item.size}</p>
                    )}
                    {item.extras?.length > 0 && (
                      <p className="track-item-meta">
                        Extras: {item.extras.join(", ")}
                      </p>
                    )}
                  </div>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <p className="track-row track-total">
              <span>Total</span>
              <strong>{formatPrice(order.total)}</strong>
            </p>
          </div>

          {actionError && (
            <p className="track-error" role="alert">
              {actionError}
            </p>
          )}

          {/* Cancel button: visible only while the status is 'received' */}
          {order.status === "received" && (
            <button
              type="button"
              className="btn-ghost"
              onClick={handleCancel}
              disabled={cancelling}
            >
              {cancelling ? "Cancelling..." : "Cancel order"}
            </button>
          )}

          <Link to="/orders" className="btn-ghost">
            Back to my orders
          </Link>
        </div>
      </section>
    </main>
  );
}