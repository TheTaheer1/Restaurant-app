import { useState } from 'react'
import { STATUS_LABELS, STATUS_COLORS, formatOrderId } from '../utils/orderSlice'
import styles from './Admin.module.css'

const ORDERS = [
  { id: 1, customer: 'Priya Sharma',  items: 3, total: 1710, status: 'preparing',  time: '7:32 PM' },
  { id: 2, customer: 'Rahul Singh',   items: 2, total: 640,  status: 'confirmed',  time: '7:45 PM' },
  { id: 3, customer: 'Kavitha Nair',  items: 5, total: 2300, status: 'pending',    time: '7:51 PM' },
  { id: 4, customer: 'Arun Kumar',    items: 1, total: 480,  status: 'delivered',  time: '6:15 PM' },
  { id: 5, customer: 'Meera Rao',     items: 4, total: 1240, status: 'out_for_delivery', time: '7:10 PM' },
]

const MENU_ITEMS = [
  { id: 1, name: 'Dal Makhani',        category: 'Mains',    price: 480, available: true },
  { id: 2, name: 'Butter Chicken',     category: 'Mains',    price: 560, available: true },
  { id: 3, name: 'Seekh Kebab Platter',category: 'Starters', price: 720, available: false },
  { id: 4, name: 'Garlic Naan',        category: 'Breads',   price: 80,  available: true },
]

const STATS = [
  { label: "Today's Orders", value: '24', icon: '📋', color: '#c0392b' },
  { label: "Revenue Today",  value: '₹18,420', icon: '💰', color: '#8b4513' },
  { label: "Pending",        value: '3', icon: '⏳', color: '#e8a840' },
  { label: "Delivered",      value: '21', icon: '✓', color: '#388e3c' },
]

export default function Admin() {
  const [tab, setTab] = useState('orders')
  const [orders, setOrders] = useState(ORDERS)
  const [menu, setMenu] = useState(MENU_ITEMS)

  function updateStatus(id, status) {
    setOrders(o => o.map(order => order.id === id ? { ...order, status } : order))
  }

  function toggleAvail(id) {
    setMenu(m => m.map(item => item.id === id ? { ...item, available: !item.available } : item))
  }

  return (
    <div className="page">
      <div className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>Admin Dashboard</h1>
          <p className={styles.sub}>Saffron & Smoke · Operations Panel</p>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsBar}>
        <div className="container">
          <div className={styles.statsGrid}>
            {STATS.map(s => (
              <div key={s.label} className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: s.color + '18', color: s.color }}>{s.icon}</div>
                <div>
                  <div className={styles.statValue}>{s.value}</div>
                  <div className={styles.statLabel}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.tabs}>
        <div className="container">
          {['orders', 'menu'].map(t => (
            <button key={t} className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`} onClick={() => setTab(t)}>
              {t === 'orders' ? '📋 Live Orders' : '🍽️ Menu Manager'}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.body}>
        <div className="container">
          {tab === 'orders' && (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Time</th><th>Status</th><th>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td className={styles.orderId}>{formatOrderId(o.id)}</td>
                      <td className={styles.customer}>{o.customer}</td>
                      <td>{o.items} items</td>
                      <td className={styles.amount}>₹{o.total}</td>
                      <td>{o.time}</td>
                      <td>
                        <span className={styles.statusBadge} style={{ background: STATUS_COLORS[o.status] + '20', color: STATUS_COLORS[o.status] }}>
                          {STATUS_LABELS[o.status]}
                        </span>
                      </td>
                      <td>
                        <select className={styles.statusSelect} value={o.status} onChange={e => updateStatus(o.id, e.target.value)}>
                          {Object.entries(STATUS_LABELS).map(([val, label]) => (
                            <option key={val} value={val}>{label}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'menu' && (
            <div className={styles.menuGrid}>
              {menu.map(item => (
                <div key={item.id} className={`${styles.menuItem} ${!item.available ? styles.menuUnavail : ''}`}>
                  <div className={styles.menuItemInfo}>
                    <div className={styles.menuItemName}>{item.name}</div>
                    <div className={styles.menuItemMeta}>{item.category} · ₹{item.price}</div>
                  </div>
                  <div className={styles.menuItemActions}>
                    <span className={item.available ? styles.availOn : styles.availOff}>
                      {item.available ? 'Available' : 'Unavailable'}
                    </span>
                    <button className={styles.toggleBtn} onClick={() => toggleAvail(item.id)}>
                      {item.available ? 'Mark Off' : 'Mark On'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
