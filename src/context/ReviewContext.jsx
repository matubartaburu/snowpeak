import { createContext, useContext, useState } from 'react'
import { initialReviews } from '../data/mountains.js'
import { createReview } from '../models/review.js'

const ReviewContext = createContext(null)

function groupByMountain(reviews) {
  return reviews.reduce((acc, r) => {
    if (!acc[r.mountainId]) acc[r.mountainId] = []
    acc[r.mountainId].push(r)
    return acc
  }, {})
}

export function ReviewProvider({ children, onRatingUpdate }) {
  const [reviewsByMountain, setReviewsByMountain] = useState(() => groupByMountain(initialReviews))

  const getReviews = (mountainId) => reviewsByMountain[mountainId] || []

  const addReview = (mountainId, payload) => {
    const review = createReview({ mountainId, ...payload })
    setReviewsByMountain(prev => {
      const updated = { ...prev, [mountainId]: [review, ...(prev[mountainId] || [])] }
      if (onRatingUpdate) onRatingUpdate(mountainId, updated[mountainId])
      return updated
    })
    return review
  }

  return (
    <ReviewContext.Provider value={{ getReviews, addReview }}>
      {children}
    </ReviewContext.Provider>
  )
}

export function useReviewContext() {
  const ctx = useContext(ReviewContext)
  if (!ctx) throw new Error('useReviewContext must be inside ReviewProvider')
  return ctx
}
