/**
 * Temporary helpers used by the placeholder pages and components.
 * Once every page and component is built, this file can be deleted.
 *
 * STYLE: Velora look - reuses the Velora `.page-head`, `.lead`, `.tag` classes and the
 * `.app-chip` helper from src/styles/app.css. No Bootstrap-only styling.
 */
import { Link } from "react-router-dom";

export default function PagePlaceholder({ title, route }) {
  return (
    <main id="main">
      <section className="page-head">
        <div className="container">
          <p className="tag">Placeholder page</p>
          <h1>{title}</h1>
          <p className="lead">
            Route: <code>{route}</code>. Open this page&apos;s file in{" "}
            <code>src/pages/</code>, read the comment at the top, then paste your
            code and delete the placeholder lines.
          </p>
          <Link to="/" className="btn-ghost sm mt-3">
            Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}

export function ComponentPlaceholder({ name, props }) {
  return (
    <div className="app-chip">
      <strong>&lt;{name} /&gt;</strong> placeholder
      {props && Object.keys(props).length > 0 && (
        <span> (received props: {Object.keys(props).join(", ")})</span>
      )}
    </div>
  );
}
