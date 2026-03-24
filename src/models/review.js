export function createReview({ mountainId, authorName, title, body, ratings, visitedMonth }) {
  return {
    id: Date.now().toString() + Math.random().toString(36).slice(2),
    mountainId,
    authorName: authorName.trim(),
    title: title.trim(),
    body: body.trim(),
    ratings,
    visitedMonth: visitedMonth || null,
    createdAt: new Date().toISOString(),
  }
}

export function validateReview({ authorName, title, body, ratings }) {
  const errors = {}
  if (!authorName || authorName.trim().length < 2) errors.authorName = 'Nombre requerido (mín. 2 caracteres)'
  if (!title || title.trim().length < 3) errors.title = 'Título requerido (mín. 3 caracteres)'
  if (!body || body.trim().length < 10) errors.body = 'Reseña requerida (mín. 10 caracteres)'
  if (!ratings.overall || ratings.overall < 1) errors.overall = 'Selecciona una valoración'
  if (!ratings.snowQuality || ratings.snowQuality < 1) errors.snowQuality = 'Valora la calidad de nieve'
  return { valid: Object.keys(errors).length === 0, errors }
}
