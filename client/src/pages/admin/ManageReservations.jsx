import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Clock3, UsersRound } from "lucide-react";
import ConfirmModal from "../../components/ConfirmModal.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import Loader from "../../components/Loader.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import { getAllReservations, updateReservation } from "../../services/api.js";
import {
  RESERVATION_STATUSES,
  RESERVATION_STATUS_LABELS,
} from "../../utils/constants.js";

function formatReservationDate(value) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value || "Date not set";
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ManageReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [cancelTarget, setCancelTarget] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setLoadError("");
    getAllReservations()
      .then((rows) =>
        setReservations(
          [...rows].sort((a, b) =>
            `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`),
          ),
        ),
      )
      .catch(() => setLoadError("We couldn’t load reservations. Try again."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const shownReservations = useMemo(
    () =>
      reservations.filter(
        (reservation) =>
          (statusFilter === "all" || reservation.status === statusFilter) &&
          (!dateFilter || reservation.date === dateFilter),
      ),
    [reservations, statusFilter, dateFilter],
  );

  function countFor(status) {
    return status === "all"
      ? reservations.length
      : reservations.filter((reservation) => reservation.status === status)
          .length;
  }

  async function setStatus(reservation, status) {
    const canConfirm =
      status === "confirmed" && reservation.status === "pending";
    const canCancel =
      status === "cancelled" &&
      ["pending", "confirmed"].includes(reservation.status);
    if (!canConfirm && !canCancel) return;

    setUpdatingId(reservation.id);
    setActionError("");
    try {
      await updateReservation(reservation.id, { status });
      setCancelTarget(null);
      load();
    } catch {
      setActionError("We couldn’t update this reservation. Try again.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <main id="main">
      <section className="page-head admin-head admin-management-head">
        <div className="container admin-head-content">
          <p className="tag">Guest book</p>
          <h1>Manage reservations</h1>
          <p className="lead">
            Review upcoming tables, confirm the details, and keep the evening
            running smoothly.
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
              <p className="tag">Reservations</p>
              <h2 className="mb-0">{reservations.length} requests</h2>
            </div>
            <div className="admin-order-summary">
              <span>{countFor("pending")} awaiting reply</span>
              <span>{countFor("confirmed")} confirmed</span>
            </div>
          </div>

          <div className="admin-reservation-toolbar">
            <div
              className="admin-filter-strip"
              role="group"
              aria-label="Filter reservations by status"
            >
              {["all", ...RESERVATION_STATUSES].map((status) => (
                <button
                  type="button"
                  key={status}
                  className={`admin-filter-chip ${statusFilter === status ? "is-active" : ""}`}
                  aria-pressed={statusFilter === status}
                  onClick={() => setStatusFilter(status)}
                >
                  {status === "all" ? "All" : RESERVATION_STATUS_LABELS[status]}
                  <span>{countFor(status)}</span>
                </button>
              ))}
            </div>
            <div className="field admin-date-filter">
              <label htmlFor="reservation-date-filter">Jump to date</label>
              <input
                id="reservation-date-filter"
                className="form-control"
                type="date"
                value={dateFilter}
                onChange={(event) => setDateFilter(event.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <Loader />
          ) : loadError ? (
            <ErrorMessage message={loadError} onRetry={load} />
          ) : shownReservations.length === 0 ? (
            <div className="admin-empty-state">
              <span className="admin-empty-icon">
                <CalendarDays size={24} aria-hidden="true" />
              </span>
              <h2>No reservations in this view</h2>
              <p>Try a different status or date to see more bookings.</p>
            </div>
          ) : (
            <div className="admin-record-list">
              {shownReservations.map((reservation) => (
                <article
                  className="admin-reservation-card"
                  key={reservation.id}
                >
                  <div className="admin-reservation-date">
                    <CalendarDays size={18} aria-hidden="true" />
                    <strong>{formatReservationDate(reservation.date)}</strong>
                    <span>
                      <Clock3 size={14} aria-hidden="true" />
                      {reservation.time}
                    </span>
                  </div>
                  <div className="admin-reservation-main">
                    <div className="admin-record-heading">
                      <div>
                        <p className="admin-record-kicker">
                          Reservation #{reservation.id}
                        </p>
                        <h2>Customer #{reservation.userId}</h2>
                      </div>
                      <StatusBadge status={reservation.status} />
                    </div>
                    <div className="admin-reservation-meta">
                      <span>
                        <UsersRound size={16} aria-hidden="true" />
                        {reservation.partySize} guests
                      </span>
                      {reservation.phone && <span>{reservation.phone}</span>}
                    </div>
                    {reservation.note && (
                      <p className="admin-reservation-note">
                        “{reservation.note}”
                      </p>
                    )}
                    <div className="admin-record-actions">
                      {reservation.status === "pending" && (
                        <button
                          type="button"
                          className="btn-solid sm"
                          onClick={() => setStatus(reservation, "confirmed")}
                          disabled={updatingId === reservation.id}
                        >
                          {updatingId === reservation.id
                            ? "Saving…"
                            : "Confirm table"}
                        </button>
                      )}
                      {["pending", "confirmed"].includes(
                        reservation.status,
                      ) && (
                        <button
                          type="button"
                          className="btn-ghost sm"
                          onClick={() => setCancelTarget(reservation)}
                          disabled={updatingId === reservation.id}
                        >
                          Cancel reservation
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
      <ConfirmModal
        show={Boolean(cancelTarget)}
        title="Cancel this reservation?"
        message="The customer’s reservation will be marked as cancelled."
        confirmLabel="Cancel reservation"
        busy={Boolean(cancelTarget && updatingId === cancelTarget.id)}
        onConfirm={() => cancelTarget && setStatus(cancelTarget, "cancelled")}
        onCancel={() => setCancelTarget(null)}
      />
    </main>
  );
}
