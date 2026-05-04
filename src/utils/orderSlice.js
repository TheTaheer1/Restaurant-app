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
  placed:            'Order Placed',
  confirmed:         'Confirmed',
  preparing:         'Preparing',
  picked:            'Picked Up',
  'on the way':      'On the Way',
  delivered:         'Delivered',
  cancelled:         'Cancelled',
  pending:           'Pending',
}

export const STATUS_COLORS = {
  placed:            '#e8a840',
  confirmed:         '#2196f3',
  preparing:         '#ff9800',
  picked:            '#00bcd4',
  'on the way':      '#9c27b0',
  delivered:         '#4caf50',
  cancelled:         '#f44336',
  pending:           '#ffc107',
}

export function getStatusStep(status) {
  const steps = ['placed', 'confirmed', 'preparing', 'picked', 'on the way', 'delivered']
  return steps.indexOf(status.toLowerCase())
}

export function formatOrderId(id) {
  return `#SS${String(id).padStart(4, '0')}`
}
