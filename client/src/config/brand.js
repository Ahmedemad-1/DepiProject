// FILE   : src/config/brand.js
// OWNER  : Ahmed Taher (suggested) - the whole team decides the values
// PURPOSE: the ONE place that holds the restaurant's identity. Pages, the Navbar,
//          the Footer, and the browser tab title all read from here, so changing the
//          name is a one-line edit. Never type the restaurant name inside a page.
//
// TODO: 1. Confirm the final restaurant name (keep server/mock/db.json
//          "settings.restaurantName" the same).
//       2. Fill in the real address and phone number. Empty values are simply
//          not shown on the site.
export const BRAND = {
  // Working name (taken from the design the team chose). The logo mark uses the
  // first letter of this name automatically.
  name: "Nocturne",
  tagline: "A table for tonight, or dinner to go.",
  address: "", // TODO example: "12 El-Nasr Street, Shebin El-Kom"
  phone: "", // TODO example: "0100 000 0000"
  email: "", // TODO
};
