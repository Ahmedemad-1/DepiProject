export default function ConfirmModal({
  show,
  title,
  message,
  confirmLabel = "Confirm",
  busy = false,
  onConfirm,
  onCancel,
}) {
  if (!show) return null;

  return (
    <div className="modal-backdrop-custom" role="presentation">
      <section
        className="form-card confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
      >
        <h2 id="confirm-title" className="sm">
          {title}
        </h2>
        <p id="confirm-message">{message}</p>
        <div className="form-foot">
          <button
            type="button"
            className="btn-solid sm"
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? "Please wait…" : confirmLabel}
          </button>
          <button
            type="button"
            className="btn-ghost sm"
            onClick={onCancel}
            disabled={busy}
          >
            Keep it
          </button>
        </div>
      </section>
    </div>
  );
}
