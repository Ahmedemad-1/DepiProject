/**
 * COMPONENT : ProtectedRoute
 * OWNER     : Heba Talaat (suggested - change if the team reassigns)
 * PURPOSE   : Guards pages that need a login (and optionally a role).
 * USAGE     : <ProtectedRoute><Checkout /></ProtectedRoute>
 *             <ProtectedRoute role="admin"><Dashboard /></ProtectedRoute>
 *
 * IMPORTANT : BYPASS_AUTH is TRUE for now, so everyone can open every page while
 *             Login/Register are still being built. When Login works, set it to false.
 */
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const BYPASS_AUTH = true; // <-- set to false when Login and Register are done

export default function ProtectedRoute({ role, children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (BYPASS_AUTH) return children;

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}
