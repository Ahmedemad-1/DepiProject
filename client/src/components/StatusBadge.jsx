import {
  ORDER_STATUS_LABELS,
  RESERVATION_STATUS_LABELS,
} from "../utils/constants.js";

export default function StatusBadge({ status }) {
  const label =
    ORDER_STATUS_LABELS[status] || RESERVATION_STATUS_LABELS[status] || status;
  return <span className="status-badge">{label}</span>;
}
