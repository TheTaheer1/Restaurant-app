// Cart feature helpers (business logic separate from context)
// Use these pure functions for calculations, validation, discounts etc.

export function calcSubtotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0)
}

export function calcTax(subtotal, rate = 0.05) {
  return subtotal * rate
}

export function calcDelivery(subtotal, address = '', freeThreshold = 500) {
  if (subtotal === 0) return 0
  if (subtotal >= freeThreshold) return 0
  
  const addr = address.toLowerCase()
  if (addr.includes('electronic city') || addr.includes('uniworld')) return 65 // Far zone
  if (addr.includes('koramangala') || addr.includes('hsr')) return 25 // Near zone
  
  return 45 // Default zone
}

export function calcTotal(items, discount = 0, address = '') {
  const subtotal = calcSubtotal(items)
  const tax      = calcTax(subtotal)
  const delivery = calcDelivery(subtotal, address)
  return { 
    subtotal, 
    tax, 
    delivery, 
    discount,
    total: Math.max(0, subtotal + tax + delivery - discount) 
  }
}

export function formatPrice(amount) {
  return `₹${amount.toFixed(0)}`
}

export function buildOrderPayload(items, customer, address) {
  return {
    items: items.map(i => ({ menuItemId: i.id, qty: i.qty, price: i.price })),
    customer,
    address,
    ...calcTotal(items),
    createdAt: new Date().toISOString(),
  }
}
