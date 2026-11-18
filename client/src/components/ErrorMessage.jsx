/**
 * COMPONENT : ErrorMessage
 * OWNER     : Ahmed Taher (suggested - change if the team reassigns)
 * PURPOSE   : Error block for failed requests. Say what failed and what to do next.
 * ORIGIN    : Velora design by [FRIEND'S NAME], wired to the Nocturne data layer.
 * PROPS     : message, onRetry? (shows a 'Try again' button when given)
 * STYLE     : the Velora `.state` block used by the Menu page (no new CSS).
 */
export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="state" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn-solid sm" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
