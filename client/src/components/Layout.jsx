/**
 * COMPONENT : Layout
 * OWNER     : Ahmed Taher (suggested - change if the team reassigns)
 * PURPOSE   : Wraps every page: skip link, scroll handling, Navbar, the page, Footer.
 * NOTES     : - Each page renders its own <main id="main"> (Velora convention, the CSS
 *               `#root > main` depends on it), so Layout adds NO wrapper around <Outlet />.
 *             - Pages are loaded lazily (Suspense + Velora Loader).
 *             - The browser tab title comes from BRAND.fullName.
 */
import { Suspense, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import Loader from "./Loader.jsx";
import { BRAND } from "../config/brand.js";

// Scroll to the #anchor if the URL has one, otherwise to the top on a new page.
function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  const lastPath = useRef(pathname);
  useEffect(() => {
    const el = hash && document.getElementById(hash.slice(1));
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else if (lastPath.current !== pathname)
      window.scrollTo({ top: 0, behavior: "instant" });
    lastPath.current = pathname;
  }, [pathname, hash, key]);
  return null;
}

export default function Layout() {
  useEffect(() => {
    document.title = BRAND.fullName;
  }, []);

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <ScrollManager />
      <Navbar />
      <Suspense
        fallback={
          <main id="main">
            <Loader className="tall" />
          </main>
        }
      >
        <Outlet />
      </Suspense>
      <Footer />
    </>
  );
}
