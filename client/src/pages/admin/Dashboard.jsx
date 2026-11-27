import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarDays,
  ClipboardList,
  Clock3,
  Utensils,
} from "lucide-react";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import Loader from "../../components/Loader.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import {
  getAllOrders,
  getAllReservations,
  getMenuItems,
} from "../../services/api.js";
import { formatPrice } from "../../utils/formatPrice.js";

const ADMIN_LINKS = [
  {
    label: "Manage menu",
    to: "/admin/menu",
    description: "Edit dishes and availability",
    Icon: Utensils,
  },
  {
    label: "Manage orders",
    to: "/admin/orders",
    description: "Review and update pickups",
    Icon: ClipboardList,
  },
  {
    label: "Manage reservations",
    to: "/admin/reservations",
    description: "Confirm table requests",
    Icon: CalendarDays,
  },
];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    Promise.all([getAllOrders(), getAllReservations(), getMenuItems()])
      .then(([orders, reservations, dishes]) =>
        setData({ orders, reservations, dishes }),
      )
      .catch(() => setError("We couldn’t load the dashboard. Try again."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const today = new Date().toDateString();
  const ordersToday = (data?.orders || []).filter(
    (order) =>
      order.createdAt && new Date(order.createdAt).toDateString() === today,
  ).length;
  const pendingReservations = (data?.reservations || []).filter(
    (reservation) => reservation.status === "pending",
  ).length;
  const availableDishes = (data?.dishes || []).filter(
    (dish) => dish.isAvailable,
  ).length;
  const unavailableDishes = (data?.dishes || []).length - availableDishes;

  return (
    <main id="main">
      <section className="page-head admin-head">
        <div className="container admin-head-content">
          <p className="tag">Restaurant operations</p>
          <h1>Dashboard</h1>
          <p className="lead">
            A clear view of the day, from the kitchen to the table.
          </p>
        </div>
      </section>
      <section className="sec admin-dashboard">
        <div className="container">
          {loading ? (
            <Loader />
          ) : error ? (
            <ErrorMessage message={error} onRetry={load} />
          ) : (
            <>
              <div className="admin-section-intro">
                <div>
                  <p className="tag">Today at a glance</p>
                  <h2>Service overview</h2>
                </div>
                <p className="muted mb-0">
                  Your latest activity and quick links are all in one place.
                </p>
              </div>
              <div className="row g-3 mb-5 admin-stats">
                <div className="col-sm-6 col-lg-3">
                  <article className="admin-stat h-100">
                    <div className="admin-stat-top">
                      <span className="admin-stat-icon">
                        <ClipboardList size={19} aria-hidden="true" />
                      </span>
                      <span className="admin-stat-note">Today</span>
                    </div>
                    <p className="admin-stat-label">Orders placed</p>
                    <p className="admin-stat-value">{ordersToday}</p>
                    <p className="admin-stat-detail">
                      Pickup orders created today
                    </p>
                  </article>
                </div>
                <div className="col-sm-6 col-lg-3">
                  <article className="admin-stat h-100">
                    <div className="admin-stat-top">
                      <span className="admin-stat-icon">
                        <Clock3 size={19} aria-hidden="true" />
                      </span>
                      <span className="admin-stat-note">Active</span>
                    </div>
                    <p className="admin-stat-label">Orders in progress</p>
                    <p className="admin-stat-value">
                      {
                        data.orders.filter((order) =>
                          ["received", "preparing", "ready"].includes(
                            order.status,
                          ),
                        ).length
                      }
                    </p>
                    <p className="admin-stat-detail">
                      Received, preparing, or ready
                    </p>
                  </article>
                </div>
                <div className="col-sm-6 col-lg-3">
                  <article className="admin-stat h-100">
                    <div className="admin-stat-top">
                      <span className="admin-stat-icon">
                        <CalendarDays size={19} aria-hidden="true" />
                      </span>
                      <span className="admin-stat-note">Needs review</span>
                    </div>
                    <p className="admin-stat-label">Pending reservations</p>
                    <p className="admin-stat-value">{pendingReservations}</p>
                    <p className="admin-stat-detail">
                      Waiting for a confirmation
                    </p>
                  </article>
                </div>
                <div className="col-sm-6 col-lg-3">
                  <article className="admin-stat h-100">
                    <div className="admin-stat-top">
                      <span className="admin-stat-icon">
                        <Utensils size={19} aria-hidden="true" />
                      </span>
                      <span className="admin-stat-note">Menu</span>
                    </div>
                    <p className="admin-stat-label">Available dishes</p>
                    <p className="admin-stat-value">{availableDishes}</p>
                    <p className="admin-stat-detail">
                      {unavailableDishes} currently unavailable
                    </p>
                  </article>
                </div>
              </div>

              <div className="admin-section-intro">
                <div>
                  <p className="tag">Quick actions</p>
                  <h2>Where would you like to go?</h2>
                </div>
              </div>
              <div className="row g-3 mb-5 admin-actions">
                {ADMIN_LINKS.map(({ label, to, description, Icon }) => (
                  <div className="col-md-4" key={to}>
                    <Link to={to} className="admin-action">
                      <span className="admin-action-icon">
                        <Icon size={20} aria-hidden="true" />
                      </span>
                      <span className="admin-action-copy">
                        <strong>{label}</strong>
                        <small>{description}</small>
                      </span>
                      <ArrowUpRight
                        className="admin-action-arrow"
                        size={18}
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                ))}
              </div>

              <section
                className="admin-orders-panel"
                aria-labelledby="latest-orders-title"
              >
                <div className="admin-orders-heading">
                  <div>
                    <p className="tag">The latest</p>
                    <h2 id="latest-orders-title">Recent orders</h2>
                  </div>
                  <Link to="/admin/orders" className="btn-ghost sm">
                    View all orders
                  </Link>
                </div>
                {data.orders.length === 0 ? (
                  <div className="state">
                    <p>No orders have been placed yet.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table align-middle">
                      <thead>
                        <tr>
                          <th scope="col">Order</th>
                          <th scope="col">Placed</th>
                          <th scope="col">Total</th>
                          <th scope="col">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.orders.slice(0, 5).map((order) => (
                          <tr key={order.id}>
                            <th scope="row">#{order.id}</th>
                            <td>
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleString()
                                : "—"}
                            </td>
                            <td>{formatPrice(Number(order.total) || 0)}</td>
                            <td>
                              <StatusBadge status={order.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
