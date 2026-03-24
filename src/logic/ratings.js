export function computeAverageRating(reviews) {
  if (!reviews || reviews.length === 0) return { overall: 0, snowQuality: 0, reviewCount: 0 }
  const overall = reviews.reduce((sum, r) => sum + r.ratings.overall, 0) / reviews.length
  const snowQuality = reviews.reduce((sum, r) => sum + r.ratings.snowQuality, 0) / reviews.length
  return { overall: Math.round(overall * 10) / 10, snowQuality: Math.round(snowQuality * 10) / 10, reviewCount: reviews.length }
}

export function formatRating(value) {
  return value ? value.toFixed(1) : '0.0'
}

export function ratingToStars(value) {
  // returns array of 5 items: 'full' | 'half' | 'empty'
  const stars = []
  for (let i = 1; i <= 5; i++) {
    if (value >= i) stars.push('full')
    else if (value >= i - 0.5) stars.push('half')
    else stars.push('empty')
  }
  return stars
}
