import styles from './ReviewCard.module.css'
import { USERS } from '../data/users'

export default function ReviewCard({ review }) {
  const user = USERS.find(u => u._id === review.userId)
  const name = user ? user.name : "Guest"
  const stars = Array.from({ length: 5 }, (_, i) => i < review.rating ? '★' : '☆')

  return (
    <div className={styles.card}>
      <div className={styles.stars}>{stars.join('')}</div>
      <p className={styles.text}>"{review.comment}"</p>
      <div className={styles.author}>
        <div className={styles.avatar}>{name.charAt(0)}</div>
        <div className={styles.info}>
          <div className={styles.name}>{name}</div>
          <div className={styles.meta}>{review.createdAt}</div>
        </div>
      </div>
    </div>
  )
}
