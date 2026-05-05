import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import AnimatedPage from '../components/AnimatedPage'
import { formatOrderId } from '../utils/orderSlice'
import { getStoredOrders, updateOrderStatus } from '../data/orders'
import { MENU } from '../data/menu'
import styles from './OrderTracking.module.css'

const STEPS = [
  { id: 'placed', label: 'Order Placed', icon: '📝', time: '2:30 PM', partnerMsg: 'Awaiting restaurant confirmation' },
  { id: 'confirmed', label: 'Confirmed', icon: '✅', time: '2:32 PM', partnerMsg: 'Restaurant is confirming your order' },
  { id: 'preparing', label: 'Preparing', icon: '👨‍🍳', time: '2:35 PM', partnerMsg: 'Delivery partner reached restaurant' },
  { id: 'picked', label: 'Picked Up', icon: '📦', time: '2:50 PM', partnerMsg: 'Delivery partner picked up your order' },
  { id: 'on the way', label: 'On the Way', icon: '🛵', time: '2:55 PM', partnerMsg: 'Delivery partner is on the way' },
  { id: 'delivered', label: 'Delivered', icon: '🏡', time: '3:05 PM', partnerMsg: 'Order delivered successfully!' }
]

export default function OrderTracking() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  
  // Find order in global state or fallback
  const [order, setOrder] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    try {
      const freshOrders = getStoredOrders() || []
      const found = freshOrders.find(o => o && o._id === orderId)
      if (found) {
        setOrder(found)
      } else if (retryCount < 10) {
        const t = setTimeout(() => setRetryCount(prev => prev + 1), 500)
        return () => clearTimeout(t)
      }
    } catch (e) {
      console.error('OrderTracking Error:', e)
      setError(e.message)
    }
  }, [orderId, retryCount])
  
  const getInitialStep = () => {
    try {
      if (!order || !order.status) return 0
      const idx = STEPS.findIndex(s => s.id === String(order.status).toLowerCase())
      return idx === -1 ? 0 : idx
    } catch (e) { return 0 }
  }

  const [currentStep, setCurrentStep] = useState(-1)

  useEffect(() => {
    if (order) {
      const initialStep = getInitialStep()
      setCurrentStep(initialStep)
    }
  }, [order])

  const [estimatedTime] = useState(30)

  // Sync back to global ORDERS array as it progresses
  useEffect(() => {
    if (!order) return
    
    const timer = setInterval(() => {
      setCurrentStep(prev => {
        const next = prev < STEPS.length - 1 ? prev + 1 : prev
        return next
      })
    }, 8000)

    return () => clearInterval(timer)
  }, [order])

  // Save status to global storage so it persists on refresh
  useEffect(() => {
    try {
      if (order && STEPS[currentStep]) {
        const newStatus = STEPS[currentStep].id
        if (order.status !== newStatus) {
          // Update local state
          order.status = newStatus
          // Update global storage
          updateOrderStatus(order._id, newStatus)
        }
      }
    } catch (e) { /* ignore save errors */ }
  }, [currentStep, order])

  if (!orderId) {
    return <div className="page" style={{textAlign: 'center', padding: '100px'}}><h2>No Order Specified</h2></div>
  }

  const safeOrderId = String(orderId || '').replace('o', '')

  if (error) {
    return <div style={{padding: '100px 20px', textAlign: 'center', color: '#fff'}}><h2>System Error</h2><p>{error}</p></div>
  }

  return (
    <div className="page">
      <div className={styles.hero}>
        <div className="container">
          <Link to="/profile" className={styles.backLink}>← Back to Orders</Link>
          <h1 className={styles.title}>Track Your Order</h1>
          <p className={styles.orderId}>Order #{safeOrderId}</p>
        </div>
      </div>

      <div className={styles.body}>
        <div className="container">
          {!order ? (
            <div className={styles.cancelledCard}>
              <div className={styles.cancelledIcon}>⏳</div>
              <h2>Finding Your Order...</h2>
              <p>Please wait a moment while we locate your delicious meal in our kitchen.</p>
              <div style={{marginTop: '20px', opacity: 0.5}}>Attempt {retryCount + 1} of 10</div>
            </div>
          ) : currentStep === -1 ? (
            <div className={styles.cancelledCard}>
              <div className={styles.cancelledIcon}>⏳</div>
              <h2>Syncing Status...</h2>
              <p>Just a second while we get the latest update on your order.</p>
            </div>
          ) : order.status === 'cancelled' ? (
            <div className={styles.cancelledCard}>
              <div className={styles.cancelledIcon}>✕</div>
              <h2>Order Cancelled</h2>
              <p>This order has been cancelled and is no longer being tracked.</p>
              <Link to="/menu" className="btn-primary" style={{marginTop: '20px'}}>Order Something Else</Link>
            </div>
          ) : (
            <div className={styles.trackingCard}>
            <div className={styles.statusHeader}>
              <div className={styles.estTime}>
                <span className={styles.estLabel}>Estimated Delivery</span>
                <span className={styles.estValue}>{Math.max(5, estimatedTime - (currentStep * 5))} mins</span>
              </div>
              <div className={styles.currentStatus}>
                {STEPS[currentStep]?.label || 'Updating...'}
              </div>
            </div>

            <div className={styles.timeline}>
              {STEPS.map((step, index) => (
                <div 
                  key={step.id} 
                  className={`${styles.step} ${index <= currentStep ? styles.active : ''} ${index < currentStep ? styles.done : ''}`}
                >
                  <div className={styles.stepIcon}>{step.icon}</div>
                  <div className={styles.stepInfo}>
                    <div className={styles.stepLabel}>{step.label}</div>
                    <div className={styles.stepTime}>{index <= currentStep ? step.time : '--'}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.mapMock}>
              <div className={styles.mapPulse}></div>
              <div className={styles.mapLabel}>
                {currentStep === STEPS.length - 1 ? '🏁 ' : '🛵 '}
                {STEPS[currentStep]?.partnerMsg || 'Awaiting update...'}
              </div>
            </div>

            {currentStep === STEPS.length - 1 && (
              <div className={styles.deliveredActions}>
                <h3>Hope you enjoyed your meal!</h3>
                <div className={styles.actionRow}>
                  <button 
                    className={styles.btnSecondary}
                    onClick={() => {
                      try {
                        // 1. Add items to cart first
                        order?.items?.forEach(item => {
                          if (!item) return
                          const menuId = item.menuItemId || item.menuId
                          if (menuId) {
                            addItem({ _id: menuId, name: item.name, price: item.price, image: item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=100' })
                          }
                        })
                        
                        // 2. Determine destination
                        const history = getStoredOrders()
                        const stillExists = history.some(o => o._id === orderId)
                        
                        if (stillExists) {
                          navigate('/profile', { state: { highlightOrder: orderId } })
                        } else {
                          // If history cleared, go to menu with first item's category if possible
                          const firstItem = order?.items?.[0]
                          const category = MENU.find(m => m.name === firstItem?.name)?.category || 'All'
                          navigate('/menu', { state: { category } })
                        }
                      } catch (e) { 
                        navigate('/menu') 
                      }
                    }}
                  >
                    Reorder Now
                  </button>
                  <button 
                    className={styles.btnOutline}
                    onClick={() => {
                      const history = getStoredOrders()
                      const stillExists = history.some(o => o._id === orderId)
                      if (stillExists) {
                        navigate('/profile', { state: { highlightOrder: orderId, openRateModal: true } })
                      } else {
                        navigate('/profile')
                      }
                    }}
                  >
                    Rate Order
                  </button>
                </div>
              </div>
            )}
          </div>
          )}

          {order && (
            <div className={styles.helpCard}>
              <h3>Need Help?</h3>
              <p>Call our support at +91 98765 43210 for any order queries.</p>
              <a href="tel:+919876543210" className={styles.btnSecondary} style={{display: 'inline-block', width: '100%'}}>Contact Restaurant</a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
