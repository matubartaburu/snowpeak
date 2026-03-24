import { createContext, useContext, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'

const ReviewContext = createContext(null)

function toLocalReview(row) {
  return {
    id: row.id,
    mountainId: row.mountain_id,
    authorName: row.author_name,
    title: row.title,
    body: row.body,
    ratings: {
      overall: row.rating_overall,
      snowQuality: row.rating_snow_quality,
    },
    visitedMonth: row.visited_month,
    createdAt: row.created_at,
  }
}

export function ReviewProvider({ children, onRatingUpdate }) {
  const [reviewsByMountain, setReviewsByMountain] = useState({})
  const [loadedMountains, setLoadedMountains] = useState(new Set())

  const getReviews = useCallback((mountainId) => {
    return reviewsByMountain[mountainId] || []
  }, [reviewsByMountain])

  const fetchReviews = useCallback(async (mountainId) => {
    if (loadedMountains.has(mountainId)) return

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('mountain_id', mountainId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching reviews:', error)
      return
    }

    const reviews = (data || []).map(toLocalReview)
    setReviewsByMountain(prev => ({ ...prev, [mountainId]: reviews }))
    setLoadedMountains(prev => new Set([...prev, mountainId]))
    if (onRatingUpdate) onRatingUpdate(mountainId, reviews)
  }, [loadedMountains, onRatingUpdate])

  const addReview = useCallback(async (mountainId, payload) => {
    const row = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      mountain_id: mountainId,
      author_name: payload.authorName.trim(),
      title: payload.title.trim(),
      body: payload.body.trim(),
      rating_overall: payload.ratings.overall,
      rating_snow_quality: payload.ratings.snowQuality,
      visited_month: payload.visitedMonth || null,
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert(row)
      .select()
      .single()

    if (error) {
      console.error('Error saving review:', error)
      throw new Error('No se pudo guardar la reseña')
    }

    const review = toLocalReview(data)
    setReviewsByMountain(prev => {
      const updated = { ...prev, [mountainId]: [review, ...(prev[mountainId] || [])] }
      if (onRatingUpdate) onRatingUpdate(mountainId, updated[mountainId])
      return updated
    })

    return review
  }, [onRatingUpdate])

  return (
    <ReviewContext.Provider value={{ getReviews, fetchReviews, addReview }}>
      {children}
    </ReviewContext.Provider>
  )
}

export function useReviewContext() {
  const ctx = useContext(ReviewContext)
  if (!ctx) throw new Error('useReviewContext must be inside ReviewProvider')
  return ctx
}
