import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styles from './Success.module.css'

const QUOTES = [
  "\"One cannot think well, love well, sleep well, if one has not dined well.\"",
  "\"First we eat, then we do everything else.\"",
  "\"Good food is the foundation of genuine happiness.\"",
  "\"Laughter is brightest in the place where food is good.\"",
  "\"Life is uncertain. Eat dessert first.\""
]

export default function Success() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)]
  const displayId = String(orderId || '').replace('o', '')

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(`/order-tracking/${orderId}`)
    }, 4000)
    return () => clearTimeout(timer)
  }, [orderId, navigate])

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.iconBox}>
          <div className={styles.checkIcon}>✓</div>
        </div>
        <h1 className={styles.title}>Order Placed Successfully!</h1>
        <div className={styles.quoteBox}>
          <p className={styles.quote}>{quote}</p>
        </div>
        <div className={styles.info}>
          <p>Order ID: <span>#{displayId}</span></p>
          <p className={styles.subtext}>Preparing your meal with love... Redirecting to tracking page.</p>
        </div>
        <div className={styles.loader}>
          <div className={styles.progress}></div>
        </div>
      </div>
    </div>
  )
}
