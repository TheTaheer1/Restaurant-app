import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/cartSlice'
import { formatOrderId, formatOrderDate, STATUS_LABELS, STATUS_COLORS, getStatusStep } from '../utils/orderSlice'
import styles from './Profile.module.css'

const reconstructOrder = (order) => {
  if (!order) return null
  if (order.subtotal !== undefined && order.tax !== undefined) return order
  
  const subtotal = order.items?.reduce((sum, item) => sum + (item.price * item.qty), 0) || 0
  const tax = Math.round(subtotal * 0.05)
  const delivery = Math.max(0, (order.total || order.totalAmount || 0) - (subtotal + tax))
  
  return {
    ...order,
    subtotal,
    tax,
    delivery,
    total: order.total || order.totalAmount
  }
}

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
  const [tab, setTab] = useState(() => sessionStorage.getItem('profile_tab') || 'orders')
  const navigate = useNavigate()
  const { addItem } = useCart()

  useEffect(() => {
    sessionStorage.setItem('profile_tab', tab)
  }, [tab])

  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem('user_addresses')
    return saved ? JSON.parse(saved) : [
      { id: 'a1', label: 'Home', address: 'Flat 402, Uniworld 2, Electronic City Phase 1, Bengaluru', isDefault: true },
      { id: 'a2', label: 'Work', address: 'Building 14, Prestige Tech Park, Marathahalli, Bengaluru', isDefault: false }
    ]
  })

  useEffect(() => {
    localStorage.setItem('user_addresses', JSON.stringify(addresses))
  }, [addresses])

  const [showAddressModal, setShowAddressModal] = useState(() => {
    return sessionStorage.getItem('profile_address_modal_open') === 'true'
  })
  const [editingAddress, setEditingAddress] = useState(() => {
    return sessionStorage.getItem('profile_address_editing_id') || null
  })
  const [addressForm, setAddressForm] = useState(() => {
    const saved = sessionStorage.getItem('profile_address_form')
    return saved ? JSON.parse(saved) : { label: 'Home', address: '' }
  })
  const [addressError, setAddressError] = useState('')

  useEffect(() => {
    sessionStorage.setItem('profile_address_modal_open', showAddressModal)
    if (editingAddress) sessionStorage.setItem('profile_address_editing_id', editingAddress)
    else sessionStorage.removeItem('profile_address_editing_id')
    sessionStorage.setItem('profile_address_form', JSON.stringify(addressForm))
  }, [showAddressModal, editingAddress, addressForm])

  const baseUser = USERS.find(u => u._id === 'u1') || USERS[0]
  const [currentUser, setCurrentUser] = useState({ ...baseUser })
  const [tick, setTick] = useState(0)

  const userOrders = ORDERS.filter(o => o.userId === currentUser._id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  const location = useLocation()
  const highlightOrder = location.state?.highlightOrder
  const [highlightedId, setHighlightedId] = useState(null)
  const openRateModal = location.state?.openRateModal
  const openGeneralReview = location.state?.openGeneralReview

  // Review Modal State
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [editingReviewId, setEditingReviewId] = useState(null)
  const [summaryOrderId, setSummaryOrderId] = useState(() => {
    return sessionStorage.getItem('profile_summary_id') || null
  })

  useEffect(() => {
    if (summaryOrderId) {
      sessionStorage.setItem('profile_summary_id', summaryOrderId)
    } else {
      sessionStorage.removeItem('profile_summary_id')
    }
  }, [summaryOrderId])

  useEffect(() => {
    if (openGeneralReview) {
      setSelectedOrderId(null)
      setRating(5)
      setComment('')
      setEditingReviewId(null)
      setShowReviewModal(true)
    } else if (highlightOrder) {
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
  }, [highlightOrder, openRateModal, openGeneralReview])


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
      const updatedUser = {
        ...currentUser,
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      }
      setCurrentUser(updatedUser)
      localStorage.setItem('active_user', JSON.stringify(updatedUser))

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
          {['orders', 'profile', 'addresses'].map(t => (
            <button key={t} className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`} onClick={() => setTab(t)}>
              {t === 'orders' ? 'My Orders' : t === 'profile' ? 'Edit Profile' : 'Addresses'}
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
                {userOrders.length > 0 && !userOrders.some(o => o.status !== 'delivered' && o.status !== 'cancelled') && (
                  <button
                    className={styles.clearBtn}
                    onClick={() => {
                      if (window.confirm('Are you sure you want to clear your order history?')) {
                        // Clear only this user's orders to be safe
                        for (let i = ORDERS.length - 1; i >= 0; i--) {
                          if (ORDERS[i].userId === currentUser._id) {
                            ORDERS.splice(i, 1)
                          }
                        }
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
                    className={`${styles.orderCard} ${styles.clickableCard} ${highlightedId === order._id ? styles.highlighted : ''}`}
                    onClick={() => {
                      if (order.status !== 'delivered' && order.status !== 'cancelled') {
                        navigate(`/order-tracking/${order._id}`)
                      } else if (order.status === 'delivered') {
                        setSummaryOrderId(order._id)
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
                    <div className={styles.orderTotal}>Total: {formatPrice(order.totalAmount)}</div>
                    {order.status === 'delivered' && (
                      <button 
                        className={styles.summaryBtn}
                        onClick={(e) => { e.stopPropagation(); setSummaryOrderId(order._id); }}
                      >
                        Order Summary
                      </button>
                    )}
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

          {tab === 'addresses' && (
            <div className={styles.addressList}>
              <div className={styles.ordersHeader}>
                <h3 className={styles.tabTitle}>Saved Addresses</h3>
                <button 
                  className="btn-primary" 
                  style={{ padding: '8px 16px', fontSize: '13px' }}
                  onClick={() => {
                    setEditingAddress(null)
                    setAddressForm({ label: 'Home', address: '' })
                    setShowAddressModal(true)
                    setAddressError('')
                  }}
                >
                  + Add New
                </button>
              </div>
              
              <div className={styles.addressGrid}>
                {addresses.map(addr => (
                  <div key={addr.id} className={styles.addressCard}>
                    <div className={styles.addressHeader}>
                      <span className={styles.addressLabel}>{addr.label}</span>
                      <div className={styles.addressActions}>
                        <button onClick={() => {
                          setEditingAddress(addr.id)
                          setAddressForm({ label: addr.label, address: addr.address })
                          setShowAddressModal(true)
                        }}>Edit</button>
                        <button onClick={() => {
                          if (window.confirm('Delete this address?')) {
                            setAddresses(prev => prev.filter(a => a.id !== addr.id))
                          }
                        }} style={{ color: '#ff4d4d' }}>Delete</button>
                      </div>
                    </div>
                    <p className={styles.addressText}>{addr.address}</p>
                    <div className={styles.addressFooter}>
                      {addr.isDefault ? (
                        <span className={styles.defaultBadge}>Default Address</span>
                      ) : (
                        <button 
                          className={styles.setDefaultBtn}
                          onClick={() => {
                            setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === addr.id })))
                          }}
                        >
                          Set as Default
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showAddressModal && (
          <ModalPortal>
            <div className={styles.modalOverlay} onClick={() => setShowAddressModal(false)}>
              <motion.div 
                className={styles.modalContent}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
              >
                <div className={styles.modalHeader}>
                  <h2>{editingAddress ? 'Edit Address' : 'Add New Address'}</h2>
                  <button className={styles.closeBtn} onClick={() => setShowAddressModal(false)}>✕</button>
                </div>
                <form onSubmit={(e) => {
                  e.preventDefault()
                  
                  // Smarter validation for "Proper Address"
                  const addr = addressForm.address.trim()
                  const words = addr.split(/\s+/).filter(w => w.length > 0)
                  const hasMinLength = addr.length >= 15
                  const hasEnoughWords = words.length >= 3
                  
                  // Check for junk (long words with no vowels or weird consonant clusters)
                  const isJunk = words.some(w => {
                    if (w.length < 8) return false
                    const vowels = w.match(/[aeiou]/gi) || []
                    return vowels.length / w.length < 0.15 // Less than 15% vowels is usually junk
                  })
                  
                  if (!hasMinLength) {
                    setAddressError('Address is too short (min 15 chars)')
                    return
                  }
                  if (!hasEnoughWords) {
                    setAddressError('Please enter a full address (e.g. Flat, Street, City)')
                    return
                  }
                  if (isJunk) {
                    setAddressError('Address contains unreadable text. Please use proper words.')
                    return
                  }
                  
                  setAddressError('')
                  
                  if (editingAddress) {
                    setAddresses(prev => prev.map(a => a.id === editingAddress ? { ...a, ...addressForm } : a))
                  } else {
                    const newAddr = {
                      id: 'a' + Date.now(),
                      ...addressForm,
                      isDefault: addresses.length === 0
                    }
                    setAddresses(prev => [...prev, newAddr])
                  }
                  setShowAddressModal(false)
                  sessionStorage.removeItem('profile_address_form')
                  sessionStorage.removeItem('profile_address_editing_id')
                }}>
                  <div className={styles.formGroup}>
                    <label>Tag As</label>
                    <select 
                      value={addressForm.label}
                      onChange={e => setAddressForm({ ...addressForm, label: e.target.value })}
                      className={styles.selectInput}
                      required
                    >
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Complete Address</label>
                    <textarea 
                      value={addressForm.address}
                      onChange={e => {
                        setAddressForm({ ...addressForm, address: e.target.value })
                        if (e.target.value.length >= 15) setAddressError('')
                      }}
                      placeholder="e.g. Flat 102, Building Name, Street, Locality"
                      rows="3"
                      required
                    />
                    {addressError && <p className={styles.errorText}>{addressError}</p>}
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                    {editingAddress ? 'Update Address' : 'Save Address'}
                  </button>
                </form>
              </motion.div>
            </div>
          </ModalPortal>
        )}
      </AnimatePresence>

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
                  <h2>{editingReviewId ? 'Edit Your Review' : selectedOrderId ? 'Rate Your Order' : 'Rate Your Experience'}</h2>
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
      <AnimatePresence>
        {summaryOrderId && (
          <ModalPortal>
            <div className={styles.modalOverlay} onClick={() => setSummaryOrderId(null)}>
              <motion.div 
                className={styles.summaryModal}
                onClick={e => e.stopPropagation()}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
              >
                <div className={styles.modalHeader}>
                  <div>
                    <h2 style={{ fontSize: '20px' }}>Order Summary</h2>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {formatOrderId((summaryOrderId || '').replace('o', ''))} · {formatOrderDate(ORDERS.find(o => o._id === summaryOrderId)?.createdAt)}
                    </p>
                  </div>
                  <button className={styles.closeBtn} onClick={() => setSummaryOrderId(null)}>✕</button>
                </div>

                <div className={styles.summaryContent}>
                  <div className={styles.summaryItems}>
                    {reconstructOrder(ORDERS.find(o => o._id === summaryOrderId))?.items?.map((item, i) => (
                      <div key={i} className={styles.summaryItem}>
                        <div className={styles.summaryItemInfo}>
                          <span className={styles.summaryItemName}>{item.name}</span>
                          <span className={styles.summaryItemQty}>× {item.qty}</span>
                        </div>
                        <span className={styles.summaryItemPrice}>{formatPrice((item.price || 0) * (item.qty || 1))}</span>
                      </div>
                    ))}
                  </div>

                  <div className={styles.summaryTotals}>
                    {(() => {
                      const o = reconstructOrder(ORDERS.find(o => o._id === summaryOrderId))
                      return (
                        <>
                          <div className={styles.summaryLine}>
                            <span>Subtotal</span>
                            <span>{formatPrice(o?.subtotal || 0)}</span>
                          </div>
                          <div className={styles.summaryLine}>
                            <span>Tax (GST)</span>
                            <span>{formatPrice(o?.tax || 0)}</span>
                          </div>
                          <div className={styles.summaryLine}>
                            <span>Delivery Fee</span>
                            <span>{o?.delivery === 0 ? 'FREE' : formatPrice(o?.delivery || 0)}</span>
                          </div>
                          <div className={`${styles.summaryLine} ${styles.summaryTotalLine}`}>
                            <span>Total Paid</span>
                            <span>{formatPrice(o?.total || 0)}</span>
                          </div>
                        </>
                      )
                    })()}
                  </div>

                  <div className={styles.summaryFooter}>
                    <p>Payment Method: {ORDERS.find(o => o._id === summaryOrderId)?.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                    <button className="btn-primary" style={{ width: '100%', marginTop: '20px' }} onClick={() => setSummaryOrderId(null)}>
                      Close Receipt
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </ModalPortal>
        )}
      </AnimatePresence>
    </div>
  )
}
