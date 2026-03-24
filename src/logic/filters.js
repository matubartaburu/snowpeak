export function filterMountains(mountains, filters) {
  return mountains.filter(mountain => {
    // Difficulty filter
    if (filters.difficulty && filters.difficulty !== 'all') {
      const diff = filters.difficulty
      // Check if this difficulty has the highest percentage
      const { beginner, intermediate, expert } = mountain.difficulty
      if (diff === 'beginner' && !(beginner >= intermediate && beginner >= expert)) return false
      if (diff === 'intermediate' && !(intermediate >= beginner && intermediate >= expert)) return false
      if (diff === 'expert' && !(expert >= beginner && expert >= intermediate)) return false
    }

    // Country filter
    if (filters.country && filters.country !== 'all') {
      if (mountain.country !== filters.country) return false
    }

    // Min rating filter
    if (filters.minRating && filters.minRating > 0) {
      if (mountain.aggregateRating.overall < filters.minRating) return false
    }

    return true
  })
}

export function sortMountains(mountains, sortBy, sortDir) {
  const dir = sortDir === 'asc' ? 1 : -1
  const sorted = [...mountains].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (a.aggregateRating.overall - b.aggregateRating.overall) * dir
      case 'name':
        return a.name.localeCompare(b.name) * dir
      case 'elevation':
        return (a.elevationTopM - b.elevationTopM) * dir
      case 'snowDepth':
        return (a.snowDepthCm - b.snowDepthCm) * dir
      default:
        return 0
    }
  })
  return sorted
}
