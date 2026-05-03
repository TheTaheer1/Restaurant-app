// Base API configuration — swap BASE_URL with your backend endpoint
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`)
  return res.json()
}

// ── Menu ──────────────────────────────────────────────────
export const menuApi = {
  getAll:       ()       => request('/menu'),
  getByCategory: (cat)   => request(`/menu?category=${cat}`),
  getById:      (id)     => request(`/menu/${id}`),
}

// ── Orders ────────────────────────────────────────────────
export const orderApi = {
  create:  (payload) => request('/orders',      { method: 'POST', body: JSON.stringify(payload) }),
  getAll:  ()        => request('/orders'),
  getById: (id)      => request(`/orders/${id}`),
  update:  (id, data)=> request(`/orders/${id}`,{ method: 'PATCH', body: JSON.stringify(data) }),
}

// ── Auth ──────────────────────────────────────────────────
export const authApi = {
  login:    (creds)   => request('/auth/login',    { method: 'POST', body: JSON.stringify(creds) }),
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  logout:   ()        => request('/auth/logout',   { method: 'POST' }),
  me:       ()        => request('/auth/me'),
}

// ── Reservations ──────────────────────────────────────────
export const reservationApi = {
  create: (payload) => request('/reservations', { method: 'POST', body: JSON.stringify(payload) }),
  getAll: ()        => request('/reservations'),
}
