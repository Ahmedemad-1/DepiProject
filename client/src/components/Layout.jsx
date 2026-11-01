/**
 * COMPONENT : Layout
 * PURPOSE   : Wraps every page with the Navbar on top and the Footer at the bottom.
 * NOTE      : Working shell. Pages are rendered where <Outlet /> is.
 */
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

export default function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="container py-4 flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
