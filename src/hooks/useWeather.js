import { useState, useEffect } from 'react'
import { mountainCoordinates } from '../data/coordinates.js'

const cache = new Map()

export function useWeather(mountainId) {
  const [state, setState] = useState(
    () => cache.get(mountainId) || { loading: true, data: null, error: false }
  )

  useEffect(() => {
    if (cache.has(mountainId)) {
      setState(cache.get(mountainId))
      return
    }

    const coords = mountainCoordinates[mountainId]
    if (!coords) {
      setState({ loading: false, data: null, error: true })
      return
    }

    const params = new URLSearchParams({
      latitude: coords.lat,
      longitude: coords.lon,
      current: 'temperature_2m,wind_speed_10m,weather_code',
      daily: 'snowfall_sum,temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code',
      past_days: 7,
      forecast_days: 7,
      timezone: 'auto',
    })

    fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
      .then(r => r.json())
      .then(json => {
        const result = { loading: false, error: false, data: parseWeather(json) }
        cache.set(mountainId, result)
        setState(result)
      })
      .catch(() => {
        const result = { loading: false, data: null, error: true }
        setState(result)
      })
  }, [mountainId])

  return state
}

function parseWeather(json) {
  const current = json.current ?? {}
  const daily = json.daily ?? {}

  // Separar pasado (7 días) y futuro (7 días)
  const today = new Date().toISOString().slice(0, 10)
  const todayIndex = (daily.time ?? []).findIndex(d => d >= today)

  const pastSnow = (daily.snowfall_sum ?? [])
    .slice(0, todayIndex)
    .reduce((sum, v) => sum + (v ?? 0), 0)

  const forecast = (daily.time ?? [])
    .slice(todayIndex)
    .map((date, i) => ({
      date,
      snowfall: daily.snowfall_sum?.[todayIndex + i] ?? 0,
      tempMax: daily.temperature_2m_max?.[todayIndex + i] ?? null,
      tempMin: daily.temperature_2m_min?.[todayIndex + i] ?? null,
      precipProb: daily.precipitation_probability_max?.[todayIndex + i] ?? 0,
      weatherCode: daily.weather_code?.[todayIndex + i] ?? 0,
    }))

  return {
    currentTemp: current.temperature_2m ?? null,
    windSpeed: current.wind_speed_10m ?? null,
    weatherCode: current.weather_code ?? 0,
    snowfall7d: Math.round(pastSnow),
    forecast,
  }
}
