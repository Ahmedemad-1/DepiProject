// FILE   : src/config/brand.js
// OWNER  : Ahmed Taher (suggested) - the whole team decides the values
// PURPOSE: the ONE place that holds the restaurant's identity. Pages, the Navbar,
//          the Footer, the Contact page and the browser tab title all read from here,
//          so changing the name is a one-line edit. Never type the restaurant name
//          inside a page.
//
// SOURCE : These values come from the VELORA design by [FRIEND'S NAME] (the Velora
//          project's site.js). They are the author's working values, not confirmed
//          facts about a real restaurant.
//
// TODO   : 1. Confirm the final restaurant name. Keep ALL of these in sync:
//             BRAND.name / BRAND.fullName here, <title> in client/index.html,
//             "settings.restaurantName" in server/mock/db.json, and public/logo.svg.
//          2. Confirm the real address, phone, email and opening hours.
//          3. NOTE: BRAND.hours is the text shown in the Footer and on Contact.
//             The booking rules use settings.openingHours in db.json (08:00-23:59).
//             The two are different today: the team must decide ONE schedule.
export const BRAND = {
  name: "VELORA",
  descriptor: "Restaurant", // small text under the name in the logo
  fullName: "VELORA RESTAURANT", // tab title, aria-labels, footer copyright
  tagline: "Good Food Great Mood",
  blurb:
    "Seasonal cooking, warm service and an evening worth lingering over.",
  address: "El Nasr Street, Maadi, Cairo, Egypt",
  phone: "+20 1556145996",
  email: "VeloraRestaurant.info@gmail.com",
  hours: [
    ["Mon – Thu", "12:00 – 22:00"],
    ["Fri – Sat", "12:00 – 23:30"],
    ["Sunday", "13:00 – 21:00"],
  ],
};

// Google Maps link built from the address (nothing to edit here).
export const MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BRAND.address)}`;
