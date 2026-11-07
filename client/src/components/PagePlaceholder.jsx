/**
 * Temporary helpers used by the placeholder pages and components.
 * Once every page and component is built, this file can be deleted.
 */

export default function PagePlaceholder({ title, route }) {
  return (
    <div className="placeholder-box">
      <h1 className="page-title mb-3">{title}</h1>
      <p className="mb-1">
        <strong>Placeholder page.</strong> Route: <code>{route}</code>
      </p>
      <p className="mb-0 text-secondary">
        Open this page's file in <code>src/pages/</code>, read the comment at
        the top, then paste your code and delete the placeholder lines.
      </p>
    </div>
  );
}

export function ComponentPlaceholder({ name, props }) {
  return (
    <div className="placeholder-chip">
      <strong>&lt;{name} /&gt;</strong> placeholder
      {props && Object.keys(props).length > 0 && (
        <span> (received props: {Object.keys(props).join(", ")})</span>
      )}
    </div>
  );
}
