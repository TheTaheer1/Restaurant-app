import { useState } from 'react'
import { formatOrderId, STATUS_LABELS, STATUS_COLORS, getStatusStep } from '../utils/orderSlice'
import styles from './Profile.module.css'

import { USERS } from '../data/users'
import { ORDERS } from '../data/orders'

function getInitials(name) {
  if (!name) return ''
  const words = name.trim().split(/\s+/)
  if (words.length === 1) return words[0].charAt(0).toUpperCase()
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase()
}

export default function Profile() {
  const [tab, setTab] = useState('orders')

  const baseUser = USERS.find(u => u._id === 'u1') || USERS[0]
  const [currentUser, setCurrentUser] = useState({ ...baseUser })
  
  const userOrders = ORDERS.filter(o => o.userId === currentUser._id).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))

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
              {userOrders.length === 0 && <p style={{color: 'var(--text-muted)'}}>No orders found.</p>}
              {userOrders.map(order => {
                const statusKey = order.status.toLowerCase()
                const step = getStatusStep(statusKey)
                const steps = ['Placed', 'Confirmed', 'Preparing', 'On the Way', 'Delivered']
                return (
                  <div key={order._id} className={styles.orderCard}>
                    <div className={styles.orderHeader}>
                      <div>
                        <div className={styles.orderId}>{formatOrderId(order._id.replace('o', ''))}</div>
                        <div className={styles.orderDate}>{order.createdAt}</div>
                      </div>
                      <span className={styles.statusPill} style={{ background: STATUS_COLORS[statusKey] + '22', color: STATUS_COLORS[statusKey] }}>
                        {STATUS_LABELS[statusKey] || order.status}
                      </span>
                    </div>
                    <div className={styles.orderItems}>{order.items.map(i => `${i.name} × ${i.qty}`).join(' · ')}</div>
                    <div className={styles.orderTotal}>Total: ₹{order.totalAmount}</div>
                    {/* Progress bar */}
                    {order.status !== 'cancelled' && (
                      <div className={styles.progress}>
                        {steps.map((s, i) => (
                          <div key={s} className={styles.progressStep}>
                            <div className={`${styles.progressDot} ${i <= step ? styles.progressDotDone : ''}`} />
                            <span className={`${styles.progressLabel} ${i <= step ? styles.progressLabelDone : ''}`}>{s}</span>
                          </div>
                        ))}
                        <div className={styles.progressLine}>
                          <div className={styles.progressFill} style={{ width: `${Math.min(step / 4 * 100, 100)}%` }} />
                        </div>
                      </div>
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
        </div>
      </div>
    </div>
  )
}
