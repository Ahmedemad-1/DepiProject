/**
 * Temporary helpers used by the placeholder pages and components.
 * Once every page and component is built, this file can be deleted.
 */

export default function PagePlaceholder({ title, route }) {
  return (
    <div className="alert alert-secondary border-2 border-dashed">
      <h1 className="h3 mb-2">{title}</h1>
      <p className="mb-1">
        <strong>Placeholder page.</strong> Route: <code>{route}</code>
      </p>
      <p className="mb-0 text-muted">
        Open this page's file in <code>src/pages/</code>, read the comment at
        the top, then paste your code and delete the placeholder lines.
      </p>
    </div>
  );
}

export function ComponentPlaceholder({ name, props }) {
  return (
    <div
      className="border border-secondary border-2 rounded p-2 my-2 text-muted small"
      style={{ borderStyle: "dashed" }}
    >
      <strong>&lt;{name} /&gt;</strong> placeholder
      {props && Object.keys(props).length > 0 && (
        <span> (received props: {Object.keys(props).join(", ")})</span>
      )}
    </div>
  );
}
