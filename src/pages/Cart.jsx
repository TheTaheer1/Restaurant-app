import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { calcTotal, formatPrice } from '../utils/cartSlice'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Cart.module.css'

export default function Cart() {
  const navigate = useNavigate()
  const { items, removeItem, updateQty, clearCart, addItem } = useCart()
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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <h3 className={styles.sectionTitle}>Order Details</h3>
                    <Link to="/menu" className={styles.addMoreTopBtn}>+ Add more items</Link>
                  </div>
                  <button className={styles.clearBtn} onClick={clearCart}>Clear All</button>
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
                          <div className={styles.itemTotal}>Total: {formatPrice(item.price * item.qty)}</div>
                          <button 
                            className={styles.removeBtnInline} 
                            onClick={() => removeItem(item._id)}
                            title="Remove item"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                
                {/* Recommended Section */}
                <div className={styles.recommendations}>
                  <h4 className={styles.recTitle}>Recommended for you</h4>
                  <div className={styles.recGrid}>
                    {[
                      { _id: 'rec_chai', name: 'Masala Chai', price: 45, image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=200&h=200&fit=crop', category: 'Beverage' },
                      { _id: 'rec_naan', name: 'Garlic Naan', price: 60, image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=200&h=200&fit=crop', category: 'Sides' },
                      { _id: 'rec_jamun', name: 'Gulab Jamun', price: 120, image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=200&h=200&fit=crop', category: 'Dessert' }
                    ].map(rec => (
                      <div key={rec._id} className={styles.recCard}>
                        <img src={rec.image} alt={rec.name} className={styles.recImg} />
                        <div className={styles.recInfo}>
                          <div className={styles.recName}>{rec.name}</div>
                          <div className={styles.recPrice}>{formatPrice(rec.price)}</div>
                        </div>
                        <button 
                          className={styles.recAddBtn}
                          onClick={() => {
                            addItem({
                              _id: rec._id,
                              name: rec.name,
                              price: rec.price,
                              image: rec.image,
                              category: rec.category,
                              qty: 1
                            })
                          }}
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
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

                  <button 
                    onClick={() => {
                      sessionStorage.removeItem('checkout_step')
                      navigate('/checkout')
                    }} 
                    className={`btn-primary ${styles.checkoutBtn}`}
                    style={{ width: '100%', border: 'none', cursor: 'pointer' }}
                  >
                    Proceed to Checkout
                  </button>
                  
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
