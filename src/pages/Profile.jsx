import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatOrderId, formatOrderDate, STATUS_LABELS, STATUS_COLORS, getStatusStep } from '../utils/orderSlice'
import styles from './Profile.module.css'

import { USERS } from '../data/users'
import { ORDERS, saveOrders } from '../data/orders'
import { REVIEWS, addReview, updateReview } from '../data/reviews'
import ModalPortal from '../components/ModalPortal'
import { motion, AnimatePresence } from 'framer-motion'

function getInitials(name) {
  if (!name) return ''
  const words = name.trim().split(/\s+/)
  if (words.length === 1) return words[0].charAt(0).toUpperCase()
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase()
}

export default function Profile() {
  const [tab, setTab] = useState('orders')
  const navigate = useNavigate()
  const { addItem } = useCart()

  const baseUser = USERS.find(u => u._id === 'u1') || USERS[0]
  const [currentUser, setCurrentUser] = useState({ ...baseUser })

  const userOrders = ORDERS.filter(o => o.userId === currentUser._id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  const location = useLocation()
  const highlightOrder = location.state?.highlightOrder
  const [highlightedId, setHighlightedId] = useState(null)

  const openRateModal = location.state?.openRateModal

  useEffect(() => {
    if (highlightOrder) {
      setHighlightedId(highlightOrder)
      const el = document.getElementById(`order-${highlightOrder}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }

      // Auto-open review modal if requested
      if (openRateModal) {
        const orderToRate = ORDERS.find(o => o._id === highlightOrder)
        if (orderToRate && orderToRate.status === 'delivered') {
          const existingReview = REVIEWS.find(r => r.orderId === highlightOrder)
          setSelectedOrderId(highlightOrder)
          if (existingReview) {
            setRating(existingReview.rating)
            setComment(existingReview.comment)
            setEditingReviewId(existingReview._id)
          } else {
            setRating(5)
            setComment('')
            setEditingReviewId(null)
          }
          setShowReviewModal(true)
        }
      }

      const t = setTimeout(() => setHighlightedId(null), 3000)
      return () => clearTimeout(t)
    }
  }, [highlightOrder, openRateModal])

  // Review Modal State
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [editingReviewId, setEditingReviewId] = useState(null)

  const handleReviewSubmit = (e) => {
    e.preventDefault()
    if (editingReviewId) {
      updateReview(editingReviewId, { rating, comment })
      alert('Review updated successfully!')
    } else {
      const newReview = {
        _id: 'r' + Date.now(),
        userId: currentUser._id,
        orderId: selectedOrderId,
        rating,
        comment,
        createdAt: new Date().toISOString().split('T')[0]
      }
      addReview(newReview)
      alert('Thank you for your review!')
    }
    setShowReviewModal(false)
    setRating(5)
    setComment('')
    setEditingReviewId(null)
  }

  // Mock real-time status updates for orders
  useEffect(() => {
    const interval = setInterval(() => {
      let changed = false
      ORDERS.forEach(order => {
        if (order.status !== 'delivered' && order.status !== 'cancelled') {
          const statusFlow = ['placed', 'confirmed', 'preparing', 'picked', 'on the way', 'delivered']
          const currentIdx = statusFlow.indexOf(order.status.toLowerCase())
          if (currentIdx < statusFlow.length - 1) {
            order.status = statusFlow[currentIdx + 1]
            changed = true
          }
        }
      })
      if (changed) {
        setTick(t => t + 1)
        saveOrders()
      }
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    city: 'Mumbai'
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      // Mutate global mock data for session persistence
      const userToUpdate = USERS.find(u => u._id === currentUser._id)
      if (userToUpdate) {
        userToUpdate.name = formData.name
        userToUpdate.email = formData.email
        userToUpdate.phone = formData.phone
      }

      // Update local state to trigger header re-render
      setCurrentUser(prev => ({
        ...prev,
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      }))

      setIsSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }, 800)
  }

  return (
    <div className="page">
      <div className={styles.hero}>
        <div className="container">
          <div className={styles.avatar}>{getInitials(currentUser.name)}</div>
          <div>
            <h1 className={styles.name}>{currentUser.name}</h1>
            <p className={styles.email}>{currentUser.email} · +91 {currentUser.phone}</p>
          </div>
        </div>
      </div>

      <div className={styles.tabs}>
        <div className="container">
          {['orders', 'profile'].map(t => (
            <button key={t} className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`} onClick={() => setTab(t)}>
              {t === 'orders' ? 'My Orders' : 'Edit Profile'}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.body}>
        <div className="container">
          {tab === 'orders' && (
            <div className={styles.orders}>
              <div className={styles.ordersHeader}>
                <h3 className={styles.tabTitle}>Recent Orders</h3>
                {userOrders.length > 0 && (
                  <button
                    className={styles.clearBtn}
                    onClick={() => {
                      if (window.confirm('Are you sure you want to clear your order history?')) {
                        ORDERS.length = 0
                        saveOrders()
                        setTick(t => t + 1)
                      }
                    }}
                  >
                    Clear History
                  </button>
                )}
              </div>
              {userOrders.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-color)', margin: '20px 0' }}>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '15px' }}>Your order history is empty. Ready to taste something delicious?</p>
                  <Link to="/menu" className="btn-primary" style={{ padding: '12px 32px' }}>Order Now</Link>
                </div>
              )}
              {userOrders.map(order => {
                const statusKey = order.status.toLowerCase()
                return (
                  <div 
                    key={order._id} 
                    id={`order-${order._id}`}
                    className={`${styles.orderCard} ${(order.status !== 'delivered' && order.status !== 'cancelled') ? styles.clickableCard : ''} ${highlightedId === order._id ? styles.highlighted : ''}`}
                    onClick={() => {
                      if (order.status !== 'delivered' && order.status !== 'cancelled') {
                        navigate(`/order-tracking/${order._id}`)
                      }
                    }}
                  >
                    <div className={styles.orderHeader}>
                      <div>
                        <div className={styles.orderId}>{formatOrderId(order._id.replace('o', ''))}</div>
                        <div className={styles.orderDate}>
                          {formatOrderDate(order.createdAt)}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                        <span className={styles.statusPill} style={{ background: STATUS_COLORS[statusKey] + '22', color: STATUS_COLORS[statusKey] }}>
                          {STATUS_LABELS[statusKey] || order.status}
                        </span>
                        <div className={styles.orderActions}>
                          {(order.status !== 'cancelled' && order.status !== 'delivered') && (
                            <button
                              className={styles.trackBtn}
                              onClick={(e) => { e.stopPropagation(); navigate(`/order-tracking/${order._id}`) }}
                            >
                              Track Order
                            </button>
                          )}
                          {(order.status !== 'delivered' && order.status !== 'cancelled') && (
                            <button
                              className={styles.cancelOrderBtn}
                              onClick={(e) => {
                                e.stopPropagation()
                                if (window.confirm('Are you sure you want to cancel this order?')) {
                                  order.status = 'cancelled'
                                  saveOrders()
                                  setTick(t => t + 1)
                                }
                              }}
                            >
                              Cancel
                            </button>
                          )}
                          {(order.status === 'delivered' || order.status === 'cancelled') && (
                            <button
                              className={styles.reorderBtn}
                              onClick={(e) => {
                                e.stopPropagation()
                                order.items.forEach(item => {
                                  addItem({ _id: item.menuItemId, name: item.name, price: item.price, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=100' })
                                })
                                navigate('/cart')
                              }}
                            >
                              Reorder
                            </button>
                          )}
                          {order.status === 'delivered' && (
                            <button
                              className={styles.rateBtn}
                              onClick={(e) => {
                                e.stopPropagation()
                                const existingReview = REVIEWS.find(r => r.orderId === order._id)
                                setSelectedOrderId(order._id)
                                if (existingReview) {
                                  setRating(existingReview.rating)
                                  setComment(existingReview.comment)
                                  setEditingReviewId(existingReview._id)
                                } else {
                                  setRating(5)
                                  setComment('')
                                  setEditingReviewId(null)
                                }
                                setShowReviewModal(true)
                              }}
                            >
                              {REVIEWS.some(r => r.orderId === order._id) ? 'Edit Review' : 'Rate Order'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={styles.orderItems}>{order.items.map(i => `${i.name} × ${i.qty}`).join(' · ')}</div>
                    <div className={styles.orderTotal}>Total: ₹{order.totalAmount}</div>
                  </div>
                )
              })}
            </div>
          )}

          {tab === 'profile' && (
            <div className={styles.profileForm}>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label>Name</label>
                  <input name="name" value={formData.name} onChange={handleChange} />
                </div>
                <div className={styles.field}>
                  <label>Email</label>
                  <input name="email" value={formData.email} onChange={handleChange} />
                </div>
                <div className={styles.field}>
                  <label>Phone</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} />
                </div>
                <div className={styles.field}>
                  <label>City</label>
                  <input name="city" value={formData.city} onChange={handleChange} />
                </div>
              </div>
              <button
                className="btn-primary"
                style={{ marginTop: '24px', opacity: isSaving ? 0.7 : 1 }}
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : saved ? 'Saved Successfully!' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showReviewModal && (
          <ModalPortal>
            <motion.div 
              className={styles.modalOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className={styles.modalContent}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className={styles.modalHeader}>
                  <h2>{editingReviewId ? 'Edit Your Review' : 'Rate Your Order'}</h2>
                  <button className={styles.closeBtn} onClick={() => setShowReviewModal(false)}>✕</button>
                </div>
                <form onSubmit={handleReviewSubmit}>
                  <div className={styles.formGroup}>
                    <label>Rating</label>
                    <div className={styles.starRating}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <span 
                          key={star} 
                          className={star <= rating ? styles.starActive : styles.star}
                          onClick={() => setRating(star)}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Comment</label>
                    <textarea 
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Tell us about your food and experience..."
                      required
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={{width: '100%'}}>
                    {editingReviewId ? 'Update Review' : 'Submit Review'}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          </ModalPortal>
        )}
      </AnimatePresence>
    </div>
  )
}
