import styles from './ReviewCard.module.css'

export default function ReviewCard({ review }) {
  const { name, location, rating, text, date, avatar } = review
  const stars = Array.from({ length: 5 }, (_, i) => i < rating ? '★' : '☆')

  return (
    <div className={styles.card}>
      <div className={styles.stars}>{stars.join('')}</div>
      <p className={styles.text}>"{text}"</p>
      <div className={styles.author}>
        <div className={styles.avatar}>{avatar || name.charAt(0)}</div>
        <div className={styles.info}>
          <div className={styles.name}>{name}</div>
          <div className={styles.meta}>{location} · {date}</div>
        </div>
      </div>
    </div>
  )
}
