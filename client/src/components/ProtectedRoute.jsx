/**
 * COMPONENT : ProtectedRoute
 * PURPOSE   : Wraps a page: <ProtectedRoute><Checkout /></ProtectedRoute>
 *             Admin pages: <ProtectedRoute role="admin"><Dashboard /></ProtectedRoute>
 *
 * BYPASS_AUTH: while the Login page is still a placeholder nobody can log in, so in
 *   DEVELOPMENT (npm run dev) the guard is switched off and every page opens.
 *   It is ignored in a production build (import.meta.env.DEV is false there), so a
 *   deployed site is always protected.
 *   TODO (Heba): when Login works, set BYPASS_AUTH to false (and delete this note).
 */
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const BYPASS_AUTH = true;

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  const location = useLocation();

  if (BYPASS_AUTH && import.meta.env.DEV) return children;

  // Not logged in: go to login and remember the page they wanted.
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but not allowed (e.g. a customer opening /admin).
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
