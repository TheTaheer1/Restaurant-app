const DEFAULT_ORDERS = [
  { _id: "o1", userId: "u1", items: [{ menuId: "m1", name: "Veg Burger", price: 120, qty: 2 }, { menuId: "m9", name: "French Fries", price: 90, qty: 1 }], totalAmount: 330, status: "Delivered", createdAt: "2026-05-01" },
  { _id: "o2", userId: "u2", items: [{ menuId: "m4", name: "Chicken Pizza", price: 280, qty: 1 }], totalAmount: 280, status: "Preparing", createdAt: "2026-05-02" },
  { _id: "o3", userId: "u3", items: [{ menuId: "m7", name: "Veg Biryani", price: 180, qty: 2 }], totalAmount: 360, status: "Pending", createdAt: "2026-05-02" },
  { _id: "o4", userId: "u4", items: [{ menuId: "m6", name: "Butter Chicken", price: 260, qty: 1 }, { menuId: "m16", name: "Rajma Chawal", price: 140, qty: 1 }], totalAmount: 400, status: "Delivered", createdAt: "2026-05-03" },
  { _id: "o5", userId: "u5", items: [{ menuId: "m3", name: "Margherita Pizza", price: 220, qty: 1 }], totalAmount: 220, status: "Cancelled", createdAt: "2026-05-03" },
  { _id: "o6", userId: "u6", items: [{ menuId: "m12", name: "Chocolate Shake", price: 140, qty: 2 }], totalAmount: 280, status: "Delivered", createdAt: "2026-05-04" },
  { _id: "o7", userId: "u7", items: [{ menuId: "m8", name: "Chicken Biryani", price: 240, qty: 1 }], totalAmount: 240, status: "Preparing", createdAt: "2026-05-04" },
  { _id: "o8", userId: "u8", items: [{ menuId: "m13", name: "Masala Dosa", price: 100, qty: 3 }], totalAmount: 300, status: "Delivered", createdAt: "2026-05-05" },
  { _id: "o9", userId: "u9", items: [{ menuId: "m18", name: "Hakka Noodles", price: 160, qty: 2 }], totalAmount: 320, status: "Pending", createdAt: "2026-05-05" },
  { _id: "o10", userId: "u10", items: [{ menuId: "m20", name: "Gulab Jamun", price: 70, qty: 4 }], totalAmount: 280, status: "Delivered", createdAt: "2026-05-06" }
]

// Initialize from localStorage or defaults
export const getStoredOrders = () => {
  const stored = localStorage.getItem('restapp_orders')
  return stored ? JSON.parse(stored) : DEFAULT_ORDERS
}

export const ORDERS = getStoredOrders()

export const saveOrders = () => {
  localStorage.setItem('restapp_orders', JSON.stringify(ORDERS))
}

export const addOrder = (order) => {
  ORDERS.push(order)
  saveOrders()
}

export const updateOrderStatus = (orderId, newStatus) => {
  const order = ORDERS.find(o => o._id === orderId)
  if (order) {
    order.status = newStatus
    saveOrders()
  }
}
