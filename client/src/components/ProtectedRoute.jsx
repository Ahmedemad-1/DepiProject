import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Wraps a page: <ProtectedRoute><Checkout /></ProtectedRoute>
// Admin pages: <ProtectedRoute role="admin"><Dashboard /></ProtectedRoute>
export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  const location = useLocation();

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
