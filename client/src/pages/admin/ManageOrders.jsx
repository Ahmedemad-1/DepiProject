import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarClock,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  UserRound,
} from "lucide-react";
import ConfirmModal from "../../components/ConfirmModal.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import Loader from "../../components/Loader.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import {
  getAllOrders,
  getOrderItems,
  updateOrder,
} from "../../services/api.js";
import {
  CANCELLABLE_ORDER_STATUSES,
  NEXT_ORDER_STATUS,
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
} from "../../utils/constants.js";
import { formatPrice } from "../../utils/formatPrice.js";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [itemsByOrder, setItemsByOrder] = useState({});
  const [itemsLoading, setItemsLoading] = useState(null);
  const [itemsError, setItemsError] = useState("");
  const [cancelTarget, setCancelTarget] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setLoadError("");
    getAllOrders()
      .then(setOrders)
      .catch(() => setLoadError("We couldn’t load orders. Try again."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const shownOrders = useMemo(
    () =>
      statusFilter === "all"
        ? orders
        : orders.filter((order) => order.status === statusFilter),
    [orders, statusFilter],
  );

  function countFor(status) {
    return status === "all"
      ? orders.length
      : orders.filter((order) => order.status === status).length;
  }

  async function toggleDetails(orderId) {
    setItemsError("");
    if (expandedId === orderId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(orderId);
    if (itemsByOrder[orderId]) return;

    setItemsLoading(orderId);
    try {
      const items = await getOrderItems(orderId);
      setItemsByOrder((current) => ({ ...current, [orderId]: items }));
    } catch {
      setItemsError("We couldn’t load this order’s items. Try again.");
    } finally {
      setItemsLoading(null);
    }
  }

  async function changeStatus(order, status) {
    const isNextStep = status === NEXT_ORDER_STATUS[order.status];
    const isAllowedCancellation =
      status === "cancelled" &&
      CANCELLABLE_ORDER_STATUSES.includes(order.status);
    if (!isNextStep && !isAllowedCancellation) return;
    setUpdatingId(order.id);
    setActionError("");
    try {
      await updateOrder(order.id, { status });
      setCancelTarget(null);
      load();
    } catch {
      setActionError("We couldn’t update the order status. Try again.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function cancelOrder() {
    if (
      !cancelTarget ||
      !CANCELLABLE_ORDER_STATUSES.includes(cancelTarget.status)
    )
      return;
    await changeStatus(cancelTarget, "cancelled");
  }

  return (
    <main id="main">
      <section className="page-head admin-head admin-management-head">
        <div className="container admin-head-content">
          <p className="tag">Service board</p>
          <h1>Manage orders</h1>
          <p className="lead">
            Keep every pickup moving, from the first ticket to collection.
          </p>
          <Link to="/admin" className="btn-ghost sm mt-3">
            Dashboard
          </Link>
        </div>
      </section>
      <section className="sec admin-dashboard admin-management-page">
        <div className="container">
          {actionError && (
            <p className="form-error admin-feedback" role="alert">
              {actionError}
            </p>
          )}

          <div className="admin-summary-row">
            <div>
              <p className="tag">Order queue</p>
              <h2 className="mb-0">{orders.length} orders</h2>
            </div>
            <div className="admin-order-summary">
              <span>{countFor("received")} new</span>
              <span>{countFor("preparing")} preparing</span>
              <span>{countFor("ready")} ready for pickup</span>
            </div>
          </div>

          <div
            className="admin-filter-strip"
            role="group"
            aria-label="Filter orders by status"
          >
            {["all", ...ORDER_STATUSES].map((status) => (
              <button
                type="button"
                key={status}
                className={`admin-filter-chip ${statusFilter === status ? "is-active" : ""}`}
                aria-pressed={statusFilter === status}
                onClick={() => setStatusFilter(status)}
              >
                {status === "all" ? "All orders" : ORDER_STATUS_LABELS[status]}
                <span>{countFor(status)}</span>
              </button>
            ))}
          </div>

          {loading ? (
            <Loader />
          ) : loadError ? (
            <ErrorMessage message={loadError} onRetry={load} />
          ) : shownOrders.length === 0 ? (
            <div className="admin-empty-state">
              <span className="admin-empty-icon">
                <ClipboardList size={24} aria-hidden="true" />
              </span>
              <h2>No orders in this view</h2>
              <p>When orders arrive, they’ll show up here for your team.</p>
            </div>
          ) : (
            <div className="admin-record-list">
              {shownOrders.map((order) => (
                <OrderRecord
                  key={order.id}
                  order={order}
                  expanded={expandedId === order.id}
                  items={itemsByOrder[order.id]}
                  itemsLoading={itemsLoading === order.id}
                  itemsError={expandedId === order.id ? itemsError : ""}
                  updating={updatingId === order.id}
                  onToggle={() => toggleDetails(order.id)}
                  onNext={(status) => changeStatus(order, status)}
                  onCancel={() => setCancelTarget(order)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      <ConfirmModal
        show={Boolean(cancelTarget)}
        title="Cancel this order?"
        message="This order will be marked as cancelled. You can only cancel an order before preparation starts."
        confirmLabel="Cancel order"
        busy={Boolean(cancelTarget && updatingId === cancelTarget.id)}
        onConfirm={cancelOrder}
        onCancel={() => setCancelTarget(null)}
      />
    </main>
  );
}

function OrderRecord({
  order,
  expanded,
  items,
  itemsLoading,
  itemsError,
  updating,
  onToggle,
  onNext,
  onCancel,
}) {
  const nextStatus = NEXT_ORDER_STATUS[order.status];
  const detailId = `order-items-${order.id}`;

  return (
    <article className={`admin-record-card ${expanded ? "is-expanded" : ""}`}>
      <div className="admin-record-main">
        <div className="admin-record-heading">
          <div>
            <p className="admin-record-kicker">Pickup order</p>
            <h2>Order #{order.id}</h2>
          </div>
          <StatusBadge status={order.status} />
        </div>
        <div className="admin-record-details">
          <div>
            <UserRound size={16} aria-hidden="true" />
            <span>Customer #{order.userId}</span>
          </div>
          <div>
            <CalendarClock size={16} aria-hidden="true" />
            <span>
              Pickup{" "}
              {order.pickupTime
                ? new Date(order.pickupTime).toLocaleString()
                : "time not set"}
            </span>
          </div>
          <div className="admin-record-total">
            <small>Order total</small>
            <strong>{formatPrice(Number(order.total) || 0)}</strong>
          </div>
        </div>
        <div className="admin-record-actions">
          <button
            type="button"
            className="btn-ghost sm"
            aria-expanded={expanded}
            aria-controls={detailId}
            onClick={onToggle}
          >
            {expanded ? (
              <ChevronUp size={15} aria-hidden="true" />
            ) : (
              <ChevronDown size={15} aria-hidden="true" />
            )}
            {expanded ? "Hide items" : "View items"}
          </button>
          {nextStatus && (
            <button
              type="button"
              className="btn-solid sm"
              onClick={() => onNext(nextStatus)}
              disabled={updating}
            >
              {updating
                ? "Saving…"
                : `Move to ${ORDER_STATUS_LABELS[nextStatus]}`}
              {!updating && <ArrowRight size={15} aria-hidden="true" />}
            </button>
          )}
          {CANCELLABLE_ORDER_STATUSES.includes(order.status) && (
            <button
              type="button"
              className="btn-ghost sm"
              onClick={onCancel}
              disabled={updating}
            >
              Cancel order
            </button>
          )}
        </div>
      </div>
      {expanded && (
        <div className="admin-record-expanded" id={detailId}>
          <p className="tag">Order details</p>
          {itemsLoading ? (
            <Loader label="Loading order items" />
          ) : itemsError ? (
            <p className="form-error" role="alert">
              {itemsError}
            </p>
          ) : !items?.length ? (
            <p className="muted mb-0">This order has no saved items.</p>
          ) : (
            <div className="admin-order-items">
              {items.map((item) => (
                <div className="admin-order-item" key={item.id}>
                  <span className="admin-order-quantity">{item.quantity}×</span>
                  <div>
                    <strong>{item.name}</strong>
                    <small>
                      {item.size}
                      {item.extras?.length
                        ? ` · ${item.extras.join(", ")}`
                        : ""}
                    </small>
                  </div>
                  <span>{formatPrice(Number(item.price) || 0)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
