/**
 * PAGE    : NotFound
 * ROUTE   : * (any unknown URL)
 * PURPOSE : 404 page. Markup taken from Velora's inline 404 route.
 */
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main id="main" className="page-head text-center">
      <h1>Page not found</h1>
      <Link className="btn-solid mt-3" to="/">
        Back to home
      </Link>
    </main>
  );
}
