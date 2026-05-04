import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { calcTotal, formatPrice } from '../utils/cartSlice'
import styles from './Cart.module.css'

export default function Cart() {
  const { items, removeItem, updateQty, clearCart } = useCart()
  const { subtotal, tax, delivery, total } = calcTotal(items)



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
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span>Order Items</span>
                  {items.length > 0 && <Link to="/menu" className={styles.addMoreLink}>+ Add More Items</Link>}
                </div>
                {items.length > 0 && <button className={styles.clearBtn} onClick={clearCart}>Clear All</button>}
              </div>
              
              {items.length === 0 ? (
                <div className={styles.empty}>
                  <div className={styles.emptyIconWrap}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  </div>
                  <h2>Your cart is empty</h2>
                  <p>Looks like you haven't added anything to your cart yet.</p>
                  <Link to="/menu" className="btn-primary" style={{ marginTop: '16px' }}>Explore Menu</Link>
                </div>
              ) : (
                <div className={styles.items}>
                  {items.map(item => (
                    <div key={item._id} className={styles.cartItem}>
                      <img src={item.image} alt={item.name} className={styles.itemEmoji} />
                      <div className={styles.itemInfo}>
                        <div className={styles.itemName}>{item.name}</div>
                        <div className={styles.itemCategory}>{item.category}</div>
                        <div className={styles.itemPrice}>{formatPrice(item.price)}</div>
                      </div>
                      <div className={styles.itemActions}>
                        <div className={styles.qtyControl}>
                          <button onClick={() => updateQty(item._id, item.qty - 1)}>−</button>
                          <span>{item.qty}</span>
                          <button onClick={() => updateQty(item._id, item.qty + 1)}>+</button>
                        </div>
                        <div className={styles.itemTotal}>{formatPrice(item.price * item.qty)}</div>
                        <button className={styles.removeBtn} onClick={() => removeItem(item._id)} aria-label="Remove item">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                    <span>
                      {delivery === 0 
                        ? (subtotal === 0 ? formatPrice(0) : <span className={styles.free}>FREE</span>) 
                        : formatPrice(delivery)
                      }
                    </span>
                  </div>
                  {delivery > 0 && (
                    <p className={styles.deliveryNote}>Add {formatPrice(500 - subtotal)} more for free delivery</p>
                  )}
                </div>
                <div className={styles.totalLine}>
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                {items.length === 0 ? (
                  <button className={`btn-primary ${styles.checkoutBtn}`} disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                    Checkout Disabled
                  </button>
                ) : (
                  <Link to="/checkout" className={`btn-primary ${styles.checkoutBtn}`}>
                    Proceed to Checkout →
                  </Link>
                )}
                <Link to="/menu" className={styles.continueBtn}>← Continue Shopping</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
