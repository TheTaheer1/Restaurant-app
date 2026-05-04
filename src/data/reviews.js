const DEFAULT_REVIEWS = [
  { _id: "r1", userId: "u1", orderId: "o1", rating: 5, comment: "Amazing food, loved the burger!", createdAt: "2026-05-02" },
  { _id: "r2", userId: "u2", orderId: "o2", rating: 4, comment: "Pizza was good but could be hotter.", createdAt: "2026-05-03" },
  { _id: "r3", userId: "u3", orderId: "o3", rating: 5, comment: "Best biryani I’ve had recently!", createdAt: "2026-05-03" },
  { _id: "r4", userId: "u4", orderId: "o4", rating: 4, comment: "Butter chicken was tasty 👍", createdAt: "2026-05-04" },
  { _id: "r5", userId: "u5", orderId: "o5", rating: 3, comment: "Order got cancelled, but food quality is okay.", createdAt: "2026-05-04" },
  { _id: "r6", userId: "u6", orderId: "o6", rating: 5, comment: "Chocolate shake was perfect!", createdAt: "2026-05-05" },
  { _id: "r7", userId: "u7", orderId: "o7", rating: 4, comment: "Good taste, delivery was fast.", createdAt: "2026-05-05" },
  { _id: "r8", userId: "u8", orderId: "o8", rating: 5, comment: "Loved the dosa, very authentic!", createdAt: "2026-05-06" },
  { _id: "r9", userId: "u9", orderId: "o9", rating: 4, comment: "Noodles were good, nice flavor.", createdAt: "2026-05-06" },
  { _id: "r10", userId: "u10", orderId: "o10", rating: 5, comment: "Gulab jamun was delicious 😋", createdAt: "2026-05-07" }
]

const getStoredReviews = () => {
  const stored = localStorage.getItem('restapp_reviews')
  return stored ? JSON.parse(stored) : DEFAULT_REVIEWS
}

export const REVIEWS = getStoredReviews()

export const addReview = (review) => {
  REVIEWS.unshift(review)
  localStorage.setItem('restapp_reviews', JSON.stringify(REVIEWS))
}

export const updateReview = (reviewId, updates) => {
  const index = REVIEWS.findIndex(r => r._id === reviewId)
  if (index !== -1) {
    REVIEWS[index] = { ...REVIEWS[index], ...updates }
    localStorage.setItem('restapp_reviews', JSON.stringify(REVIEWS))
  }
}
