// All API calls live in this one file.
// Switching from json-server to the real backend = changing VITE_API_URL only.
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export const getCategories = () => request("/categories");
export const getMenuItems = (query = "") => request(`/menuItems${query}`);
export const getMenuItem = (id) => request(`/menuItems/${id}`);
export const getSettings = () => request("/settings");

export const login = async (email, password) => {
  // json-server has no real auth: we look the user up and compare (demo only).
  const users = await request(`/users?email=${encodeURIComponent(email)}`);
  const user = users[0];
  if (!user || user.password !== password)
    throw new Error("Invalid email or password");
  return user;
};

export const createOrder = (order) =>
  request("/orders", { method: "POST", body: JSON.stringify(order) });
export const createOrderItem = (item) =>
  request("/orderItems", { method: "POST", body: JSON.stringify(item) });
export const getMyOrders = (userId) => request(`/orders?userId=${userId}`);

export const createReservation = (reservation) =>
  request("/reservations", {
    method: "POST",
    body: JSON.stringify(reservation),
  });
export const getMyReservations = (userId) =>
  request(`/reservations?userId=${userId}`);

// ---- more functions needed by the pages -----------------------------------

export const emailExists = async (email) => {
  const users = await request(`/users?email=${encodeURIComponent(email)}`);
  return users.length > 0;
};
export const register = (user) =>
  request("/users", {
    method: "POST",
    body: JSON.stringify({ ...user, role: "customer" }),
  });

export const getOrder = (id) => request(`/orders/${id}`);
export const getOrderItems = (orderId) =>
  request(`/orderItems?orderId=${orderId}`);
export const getAllOrders = () =>
  request("/orders?_sort=createdAt&_order=desc");
export const updateOrder = (id, patch) =>
  request(`/orders/${id}`, { method: "PATCH", body: JSON.stringify(patch) });

export const getAllReservations = () =>
  request("/reservations?_sort=date&_order=asc");
export const updateReservation = (id, patch) =>
  request(`/reservations/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });

// Admin: manage the menu
export const createMenuItem = (item) =>
  request("/menuItems", { method: "POST", body: JSON.stringify(item) });
export const updateMenuItem = (id, patch) =>
  request(`/menuItems/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
export const deleteMenuItem = (id) =>
  request(`/menuItems/${id}`, { method: "DELETE" });

// Contact form (Contact page). This is an EXTERNAL service (Web3forms), not the
// restaurant API. The access key was supplied by the Velora author; set your own in
// client/.env as VITE_WEB3FORMS_KEY (see .env.example) before going live.
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const WEB3FORMS_KEY =
  import.meta.env.VITE_WEB3FORMS_KEY || "f4a51210-dfa6-4a3a-b1b3-cb846073952b";
const CONTACT_TIMEOUT_MS = 15000;

export async function sendContactMessage({ name, email, phone, topic, message }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CONTACT_TIMEOUT_MS);
  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: `New message from the website: ${topic}`,
        name,
        email,
        phone: phone || "Not given",
        topic,
        message,
      }),
      signal: controller.signal,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.success)
      throw new Error(
        data?.message ||
          data?.body?.message ||
          `Web3Forms answered with status ${res.status}`,
      );
    return data;
  } finally {
    clearTimeout(timer);
  }
}
