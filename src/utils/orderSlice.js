// Order feature helpers

export const ORDER_STATUS = {
  PENDING:    'pending',
  CONFIRMED:  'confirmed',
  PREPARING:  'preparing',
  OUT:        'out_for_delivery',
  DELIVERED:  'delivered',
  CANCELLED:  'cancelled',
}

export const STATUS_LABELS = {
  pending:           'Order Placed',
  confirmed:         'Confirmed',
  preparing:         'Being Prepared',
  out_for_delivery:  'Out for Delivery',
  delivered:         'Delivered',
  cancelled:         'Cancelled',
}

export const STATUS_COLORS = {
  pending:           '#e8a840',
  confirmed:         '#2196f3',
  preparing:         '#ff9800',
  out_for_delivery:  '#9c27b0',
  delivered:         '#4caf50',
  cancelled:         '#f44336',
}

export function getStatusStep(status) {
  const steps = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered']
  return steps.indexOf(status)
}

export function formatOrderId(id) {
  return `#SS${String(id).padStart(4, '0')}`
}
