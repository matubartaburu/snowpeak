import { useState, useEffect } from 'react'
import { mountainCoordinates } from '../data/coordinates.js'

// Cache a nivel de módulo — evita refetch si ya tenemos el dato
const cache = new Map()

export function useSnowData(mountainId) {
  const [state, setState] = useState(() => cache.get(mountainId) || { loading: true, snowfall7d: null, error: false })

  useEffect(() => {
    if (cache.has(mountainId)) {
      setState(cache.get(mountainId))
      return
    }

    const coords = mountainCoordinates[mountainId]
    if (!coords) {
      const result = { loading: false, snowfall7d: null, error: true }
      setState(result)
      return
    }

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=snowfall_sum&past_days=7&forecast_days=0&timezone=auto`

    fetch(url)
      .then(r => r.json())
      .then(data => {
        const sums = data?.daily?.snowfall_sum ?? []
        const total = sums.reduce((acc, v) => acc + (v ?? 0), 0)
        const result = { loading: false, snowfall7d: Math.round(total), error: false }
        cache.set(mountainId, result)
        setState(result)
      })
      .catch(() => {
        const result = { loading: false, snowfall7d: null, error: true }
        setState(result)
      })
  }, [mountainId])

  return state
}
