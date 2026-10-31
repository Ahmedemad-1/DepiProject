// All API calls live in this one file.
// Switching from json-server to the real backend = changing VITE_API_URL only.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}

export const getCategories = () => request('/categories')
export const getMenuItems = (query = '') => request(`/menuItems${query}`)
export const getMenuItem = (id) => request(`/menuItems/${id}`)
export const getSettings = () => request('/settings')

export const login = async (email, password) => {
  // json-server has no real auth: we look the user up and compare (demo only).
  const users = await request(`/users?email=${encodeURIComponent(email)}`)
  const user = users[0]
  if (!user || user.password !== password) throw new Error('Invalid email or password')
  return user
}

export const createOrder = (order) =>
  request('/orders', { method: 'POST', body: JSON.stringify(order) })
export const createOrderItem = (item) =>
  request('/orderItems', { method: 'POST', body: JSON.stringify(item) })
export const getMyOrders = (userId) => request(`/orders?userId=${userId}`)

export const createReservation = (reservation) =>
  request('/reservations', { method: 'POST', body: JSON.stringify(reservation) })
export const getMyReservations = (userId) => request(`/reservations?userId=${userId}`)
