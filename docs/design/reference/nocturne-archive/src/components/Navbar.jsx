/**
 * COMPONENT : Navbar
 * OWNER     : Shared (first version: Ahmed Taher)
 * PURPOSE   : Top navigation. Links change with the user: visitor, customer, admin.
 * NOTES     : - On the home page the bar floats over the hero photo (overlay mode).
 *             - On phones the links fold into a menu opened by the Menu button.
 *             - Active page gets a gold underline (NavLink sets aria-current).
 */
import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import Logo from "./Logo.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const overlay = pathname === "/";
  const close = () => setOpen(false);
  const cartLabel = itemCount > 0 ? `Cart, ${itemCount} items` : "Cart";

  return (
    <header
      className={`site-nav${overlay ? " site-nav--overlay" : ""}${open ? " is-open" : ""}`}
    >
      <div className="site-nav__inner">
        <Logo />

        <button
          type="button"
          className="site-nav__toggle"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen(!open)}
        >
          {open ? "Close" : "Menu"}
        </button>

        <div
          id="site-menu"
          className={`site-nav__panel${open ? " is-open" : ""}`}
        >
          <nav className="site-nav__links" aria-label="Main">
            <NavLink to="/menu" onClick={close}>
              Menu
            </NavLink>
            <NavLink to="/about" onClick={close}>
              About
            </NavLink>
            {user && (
              <NavLink to="/orders" onClick={close}>
                My orders
              </NavLink>
            )}
            {user?.role === "admin" && (
              <NavLink to="/admin" onClick={close}>
                Admin
              </NavLink>
            )}
          </nav>

          <div className="site-nav__actions">
            <NavLink to="/cart" aria-label={cartLabel} onClick={close}>
              Cart
              {itemCount > 0 && (
                <span className="site-nav__count" aria-hidden="true">
                  {itemCount}
                </span>
              )}
            </NavLink>
            {user ? (
              <>
                <NavLink to="/profile" onClick={close}>
                  {user.name}
                </NavLink>
                <button
                  type="button"
                  className="site-nav__link-btn"
                  onClick={() => {
                    logout();
                    close();
                  }}
                >
                  Log out
                </button>
              </>
            ) : (
              <NavLink to="/login" onClick={close}>
                Log in
              </NavLink>
            )}
            <Link
              className="btn btn-outline-primary btn-sm"
              to="/reservation"
              onClick={close}
            >
              Reserve a table
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
