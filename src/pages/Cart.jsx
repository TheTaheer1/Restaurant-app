import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { calcTotal, formatPrice } from '../utils/cartSlice'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Cart.module.css'

export default function Cart() {
  const { items, removeItem, updateQty, clearCart } = useCart()
  const { subtotal, tax, delivery, total } = calcTotal(items)

  return (
    <div className="page">
      <div className={styles.hero}>
        <div className="container">
          <motion.h1 
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Your Cart
          </motion.h1>
          <motion.p 
            className={styles.count}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {items.length === 0 ? 'Start adding some delicious items' : `${items.length} exquisite items selected`}
          </motion.p>
        </div>
      </div>

      <div className={styles.body}>
        <div className="container">
          {items.length === 0 ? (
            <motion.div 
              className={styles.emptyState}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className={styles.emptyIcon}>🍱</div>
              <h2 className={styles.emptyTitle}>Your cart is empty</h2>
              <p className={styles.emptyDesc}>
                It looks like you haven't discovered our signature dishes yet. 
                Our chef is waiting to prepare something special for you.
              </p>
              <Link to="/menu" className="btn-primary" style={{ marginTop: '24px', padding: '16px 40px' }}>
                Explore Menu
              </Link>
            </motion.div>
          ) : (
            <div className={styles.layout}>
              {/* Items Column */}
              <div className={styles.itemsCol}>
                <div className={styles.itemsHeader}>
                  <h3 className={styles.sectionTitle}>Order Details</h3>
                  <button className={styles.clearBtn} onClick={clearCart}>Clear All Items</button>
                </div>
                
                <div className={styles.items}>
                  <AnimatePresence mode="popLayout">
                    {items.map((item, index) => (
                      <motion.div 
                        key={item._id} 
                        className={styles.cartItem}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, scale: 0.95 }}
                        transition={{ delay: index * 0.05 }}
                        layout
                      >
                        <button 
                          className={styles.removeBtn} 
                          onClick={() => removeItem(item._id)}
                          title="Remove item"
                        >
                          ✕
                        </button>
                        
                        <div className={styles.itemImageWrap}>
                          <img src={item.image} alt={item.name} className={styles.itemImage} />
                        </div>
                        
                        <div className={styles.itemInfo}>
                          <span className={styles.itemCategory}>{item.category}</span>
                          <div className={styles.itemName}>{item.name}</div>
                          <div className={styles.itemPrice}>{formatPrice(item.price)}</div>
                        </div>
                        
                        <div className={styles.itemActions}>
                          <div className={styles.qtyControl}>
                            <button onClick={() => updateQty(item._id, item.qty - 1)}>−</button>
                            <span className={styles.qtyValue}>{item.qty}</span>
                            <button onClick={() => updateQty(item._id, item.qty + 1)}>+</button>
                          </div>
                          <div className={styles.itemTotal}>{formatPrice(item.price * item.qty)}</div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                
                <Link to="/menu" className={styles.continueLink} style={{ marginTop: '32px', textAlign: 'left' }}>
                  + Add more items to your order
                </Link>
              </div>

              {/* Summary Column */}
              <div className={styles.summaryCol}>
                <motion.div 
                  className={styles.summaryCard}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className={styles.summaryTitle}>Bill Details</h3>
                  
                  <div className={styles.summaryLines}>
                    <div className={styles.summaryLine}>
                      <span>Item Total</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className={styles.summaryLine}>
                      <span>GST & Restaurant Charges</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                    <div className={styles.summaryLine}>
                      <span>Delivery Partner Fee</span>
                      <span>
                        {delivery === 0 
                          ? <span className={styles.freeBadge}>FREE</span> 
                          : formatPrice(delivery)
                        }
                      </span>
                    </div>
                    
                    {delivery > 0 && (
                      <div className={styles.deliveryInfo}>
                        Add {formatPrice(500 - subtotal)} more for <strong>Free Delivery</strong>
                      </div>
                    )}
                  </div>

                  <div className={styles.totalSection}>
                    <span className={styles.totalLabel}>Total To Pay</span>
                    <span className={styles.totalAmount}>{formatPrice(total)}</span>
                  </div>

                  <Link to="/checkout" className={`btn-primary ${styles.checkoutBtn}`}>
                    Proceed to Checkout
                  </Link>
                  
                  <Link to="/menu" className={styles.continueLink}>
                    ← Continue Shopping
                  </Link>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
