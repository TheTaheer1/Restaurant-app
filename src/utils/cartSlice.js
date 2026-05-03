// Cart feature helpers (business logic separate from context)
// Use these pure functions for calculations, validation, discounts etc.

export function calcSubtotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0)
}

export function calcTax(subtotal, rate = 0.05) {
  return subtotal * rate
}

export function calcDelivery(subtotal, freeThreshold = 500) {
  return subtotal >= freeThreshold ? 0 : 49
}

export function calcTotal(items) {
  const subtotal = calcSubtotal(items)
  const tax      = calcTax(subtotal)
  const delivery = calcDelivery(subtotal)
  return { subtotal, tax, delivery, total: subtotal + tax + delivery }
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
