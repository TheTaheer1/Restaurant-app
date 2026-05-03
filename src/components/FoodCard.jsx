import { useState } from 'react'
import { useCart } from '../context/CartContext'
import styles from './FoodCard.module.css'

export default function FoodCard({ item }) {
  const { addItem, items, updateQty } = useCart()
  const [added, setAdded] = useState(false)

  const cartItem = items.find(i => i.id === item.id)
  const qty = cartItem ? cartItem.qty : 0

  function handleAdd(e) {
    e.stopPropagation(); // prevent card click
    addItem(item)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  function handleInc(e) { e.stopPropagation(); updateQty(item.id, qty + 1) }
  function handleDec(e) { e.stopPropagation(); updateQty(item.id, qty - 1) }

  return (
    <div className={styles.card}>
      <div className={styles.imgWrap}>
        <div className={styles.imgPlaceholder}>
          <span>{item.emoji || '🍛'}</span>
        </div>
        <span className={styles.vegBadge} style={{ color: item.isVeg ? '#388e3c' : '#d4523a' }}>
          {item.isVeg ? 'Veg' : 'Non-Veg'}
        </span>
        {item.isPopular && (
          <span className={styles.popularBadge}>Popular</span>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.category}>{item.category}</div>
        <h3 className={styles.name}>{item.name}</h3>
        <p className={styles.desc}>{item.description}</p>

        <div className={styles.spiceRow}>
          {[1,2,3].map(n => (
            <div key={n} className={`${styles.chili} ${n <= item.spice ? styles.chiliHot : ''}`}></div>
          ))}
        </div>

        <div className={styles.footer}>
          <div className={styles.price}>₹{item.price}</div>

          {qty === 0 ? (
            <button
              className={`${styles.addBtn} ${added ? styles.added : ''}`}
              onClick={handleAdd}
            >
              {added ? '✓ Added' : 'Add'}
            </button>
          ) : (
            <div className={styles.qtyControl}>
              <button onClick={handleDec} className={styles.qtyBtn}>−</button>
              <span className={styles.qtyNum}>{qty}</span>
              <button onClick={handleInc} className={styles.qtyBtn}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
