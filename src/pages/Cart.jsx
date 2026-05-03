import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { calcTotal, formatPrice } from '../utils/cartSlice'
import styles from './Cart.module.css'

export default function Cart() {
  const { items, removeItem, updateQty, clearCart } = useCart()
  const { subtotal, tax, delivery, total } = calcTotal(items)

  if (items.length === 0) {
    return (
      <div className="page">
        <div className={styles.empty}>
          <span>🛒</span>
          <h2>Your cart is empty</h2>
          <p>Add some delicious dishes to get started!</p>
          <Link to="/menu" className="btn-primary" style={{ marginTop: '24px' }}>Browse Menu</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>Your Cart</h1>
          <p className={styles.count}>{items.length} item{items.length > 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className={styles.body}>
        <div className="container">
          <div className={styles.layout}>
            {/* Items */}
            <div className={styles.itemsCol}>
              <div className={styles.itemsHeader}>
                <span>Order Items</span>
                <button className={styles.clearBtn} onClick={clearCart}>Clear All</button>
              </div>
              <div className={styles.items}>
                {items.map(item => (
                  <div key={item.id} className={styles.cartItem}>
                    <div className={styles.itemEmoji}>{item.emoji}</div>
                    <div className={styles.itemInfo}>
                      <div className={styles.itemName}>{item.name}</div>
                      <div className={styles.itemCategory}>{item.category}</div>
                      <div className={styles.itemPrice}>{formatPrice(item.price)}</div>
                    </div>
                    <div className={styles.itemActions}>
                      <div className={styles.qtyControl}>
                        <button onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                      </div>
                      <div className={styles.itemTotal}>{formatPrice(item.price * item.qty)}</div>
                      <button className={styles.removeBtn} onClick={() => removeItem(item.id)}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className={styles.summaryCol}>
              <div className={styles.summary}>
                <h3 className={styles.summaryTitle}>Order Summary</h3>
                <div className={styles.summaryLines}>
                  <div className={styles.line}><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                  <div className={styles.line}><span>GST (5%)</span><span>{formatPrice(tax)}</span></div>
                  <div className={styles.line}>
                    <span>Delivery</span>
                    <span>{delivery === 0 ? <span className={styles.free}>FREE</span> : formatPrice(delivery)}</span>
                  </div>
                  {delivery > 0 && (
                    <p className={styles.deliveryNote}>Add {formatPrice(500 - subtotal)} more for free delivery</p>
                  )}
                </div>
                <div className={styles.totalLine}>
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <Link to="/checkout" className={`btn-primary ${styles.checkoutBtn}`}>
                  Proceed to Checkout →
                </Link>
                <Link to="/menu" className={styles.continueBtn}>← Continue Shopping</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
