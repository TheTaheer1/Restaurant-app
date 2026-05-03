import { useState } from 'react'
import { formatOrderId, STATUS_LABELS, STATUS_COLORS, getStatusStep } from '../utils/orderSlice'
import styles from './Profile.module.css'

const MOCK_ORDERS = [
  { id: 1, items: ['Dal Makhani', 'Garlic Naan × 2'], total: 630,  status: 'delivered',  date: '28 Apr 2026' },
  { id: 2, items: ['Butter Chicken', 'Laccha Paratha', 'Mango Lassi'], total: 790, status: 'preparing', date: '03 May 2026' },
  { id: 3, items: ['Seekh Kebab Platter', 'Masala Chai'], total: 840, status: 'confirmed', date: '03 May 2026' },
]

export default function Profile() {
  const [tab, setTab] = useState('orders')

  return (
    <div className="page">
      <div className={styles.hero}>
        <div className="container">
          <div className={styles.avatar}>P</div>
          <div>
            <h1 className={styles.name}>Priya Sharma</h1>
            <p className={styles.email}>priya.sharma@email.com · +91 98400 00000</p>
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
              {MOCK_ORDERS.map(order => {
                const step = getStatusStep(order.status)
                const steps = ['Placed', 'Confirmed', 'Preparing', 'On the Way', 'Delivered']
                return (
                  <div key={order.id} className={styles.orderCard}>
                    <div className={styles.orderHeader}>
                      <div>
                        <div className={styles.orderId}>{formatOrderId(order.id)}</div>
                        <div className={styles.orderDate}>{order.date}</div>
                      </div>
                      <span className={styles.statusPill} style={{ background: STATUS_COLORS[order.status] + '22', color: STATUS_COLORS[order.status] }}>
                        {STATUS_LABELS[order.status]}
                      </span>
                    </div>
                    <div className={styles.orderItems}>{order.items.join(' · ')}</div>
                    <div className={styles.orderTotal}>Total: ₹{order.total}</div>
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
                {[['Name','Priya Sharma'],['Email','priya.sharma@email.com'],['Phone','+91 98400 00000'],['City','Bengaluru']].map(([label, val]) => (
                  <div key={label} className={styles.field}>
                    <label>{label}</label>
                    <input defaultValue={val} />
                  </div>
                ))}
              </div>
              <button className="btn-primary" style={{ marginTop: '24px' }}>Save Changes</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
