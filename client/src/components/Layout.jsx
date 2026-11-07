/**
 * COMPONENT : Layout
 * PURPOSE   : Wraps every page with the Navbar on top and the Footer at the bottom.
 * NOTES     : - The home page is full-width (it has its own sections); every other page
 *               is placed inside a Bootstrap container with vertical padding.
 *             - Scrolls to the top on every page change and sets the browser tab title.
 */
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { BRAND } from "../config/brand.js";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

export default function Layout() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  useEffect(() => {
    document.title = BRAND.name;
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar />
      <main
        id="main"
        tabIndex={-1}
        className={isHome ? "flex-grow-1" : "container flex-grow-1 py-5"}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
