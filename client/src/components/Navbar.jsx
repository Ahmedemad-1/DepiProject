/**
 * COMPONENT : Navbar
 * OWNER     : Shared (first version: Ahmed Taher)
 * PURPOSE   : Top navigation. Links change with the user: visitor, customer, admin.
 * NOTE      : Working shell so every page can be reached. Improve the design freely
 *             (restaurant name/logo, mobile menu, cart badge style).
 */
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">
        Restaurant
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNav"
        aria-controls="mainNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div className="collapse navbar-collapse" id="mainNav">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <NavLink className="nav-link" to="/menu">
              Menu
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/reservation">
              Reservation
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/about">
              About
            </NavLink>
          </li>
          {user && (
            <li className="nav-item">
              <NavLink className="nav-link" to="/orders">
                My orders
              </NavLink>
            </li>
          )}
          {user?.role === "admin" && (
            <li className="nav-item">
              <NavLink className="nav-link" to="/admin">
                Admin
              </NavLink>
            </li>
          )}
        </ul>

        <ul className="navbar-nav align-items-lg-center">
          <li className="nav-item">
            <NavLink className="nav-link" to="/cart">
              Cart{" "}
              {itemCount > 0 && (
                <span className="badge bg-warning text-dark">{itemCount}</span>
              )}
            </NavLink>
          </li>
          {user ? (
            <>
              <li className="nav-item">
                <NavLink className="nav-link" to="/profile">
                  {user.name}
                </NavLink>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-outline-light btn-sm ms-lg-2"
                  onClick={logout}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <NavLink className="nav-link" to="/login">
                  Login
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/register">
                  Register
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
