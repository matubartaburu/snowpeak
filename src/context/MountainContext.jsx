import { createContext, useContext, useState, useMemo } from 'react'
import { mountains as initialMountains } from '../data/mountains.js'
import { filterMountains, sortMountains } from '../logic/filters.js'
import { computeAverageRating } from '../logic/ratings.js'

const MountainContext = createContext(null)

export function MountainProvider({ children }) {
  const [mountains, setMountains] = useState(initialMountains)
  const [filters, setFilters] = useState({
    difficulty: 'all',
    country: 'all',
    minRating: 0,
    sortBy: 'rating',
    sortDir: 'desc',
    search: '',
  })

  const updateMountainRating = (mountainId, reviews) => {
    const { overall, snowQuality, reviewCount } = computeAverageRating(reviews)
    setMountains(prev => prev.map(m =>
      m.id === mountainId
        ? { ...m, aggregateRating: { overall, snowQuality, reviewCount } }
        : m
    ))
  }

  const filteredMountains = useMemo(() => {
    let result = filterMountains(mountains, filters)
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(m => m.name.toLowerCase().includes(q) || m.country.toLowerCase().includes(q))
    }
    return sortMountains(result, filters.sortBy, filters.sortDir)
  }, [mountains, filters])

  const countries = useMemo(() => ['all', ...new Set(mountains.map(m => m.country))], [mountains])

  const setFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }))
  const clearFilters = () => setFilters({ difficulty: 'all', country: 'all', minRating: 0, sortBy: 'rating', sortDir: 'desc', search: '' })
  const getMountainById = (id) => mountains.find(m => m.id === id)

  return (
    <MountainContext.Provider value={{ mountains, filteredMountains, filters, countries, setFilter, clearFilters, getMountainById, updateMountainRating }}>
      {children}
    </MountainContext.Provider>
  )
}

export function useMountainContext() {
  const ctx = useContext(MountainContext)
  if (!ctx) throw new Error('useMountainContext must be inside MountainProvider')
  return ctx
}
