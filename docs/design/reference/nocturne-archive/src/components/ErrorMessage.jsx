/**
 * COMPONENT : ErrorMessage
 * OWNER     : Shared
 * PURPOSE   : Error box for failed requests. Say what failed and what to do next.
 * PROPS     : message, onRetry? (shows a "Try again" button when given)
 */
export default function ErrorMessage({ message, onRetry }) {
  return (
    <div
      className="alert alert-danger d-flex flex-wrap align-items-center justify-content-between gap-3"
      role="alert"
    >
      <span>{message}</span>
      {onRetry && (
        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          onClick={onRetry}
        >
          Try again
        </button>
      )}
    </div>
  );
}
