import styles from './Skeleton.module.css'

// Generic shimmer box
export function SkeletonBox({ width = '100%', height = '16px', style = {} }) {
  return (
    <div
      className={styles.skeleton}
      style={{ width, height, borderRadius: 6, ...style }}
    />
  )
}

// Full food card skeleton (matches FoodCard layout)
export function FoodCardSkeleton() {
  return (
    <div className={styles.foodCardSkeleton}>
      <div className={`${styles.skeleton} ${styles.foodCardSkeletonImg}`} />
      <div className={styles.foodCardSkeletonBody}>
        <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '40%' }} />
        <div className={`${styles.skeleton} ${styles.skeletonTitle}`} style={{ width: '75%' }} />
        <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '90%' }} />
        <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '60%', marginBottom: 16 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className={`${styles.skeleton} ${styles.skeletonTitle}`} style={{ width: '30%', marginBottom: 0 }} />
          <div className={`${styles.skeleton} ${styles.skeletonCircle}`} style={{ width: 32, height: 32 }} />
        </div>
      </div>
    </div>
  )
}

// Grid of food card skeletons
export function FoodGridSkeleton({ count = 6 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <FoodCardSkeleton key={i} />
      ))}
    </>
  )
}
