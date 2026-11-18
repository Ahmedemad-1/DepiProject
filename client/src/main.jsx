// App entry point: wraps the app with the router and the Auth and Cart providers.
// Styles are the Velora design system, imported in this order (the order matters for the
// CSS cascade, it is the same order as Velora's original single main.css):
// Bootstrap -> theme (tokens) -> layout -> home -> components -> menu -> dish-details ->
// pages -> app (added by the merge, loads last). fonts.css and loader.css are linked
// from index.html so the splash screen and fonts load first.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/theme.css";
import "./styles/layout.css";
import "./styles/home.css";
import "./styles/components.css";
import "./styles/menu.css";
import "./styles/dish-details.css";
import "./styles/pages.css";
import "./styles/app.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { hideSplashWhenReady } from "./utils/splash.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
hideSplashWhenReady();
