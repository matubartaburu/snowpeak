import { useState, useEffect } from 'react'
import { mountainCoordinates } from '../data/coordinates.js'

// Cache compartido con useWeather
const cache = new Map()

function getWeekendDates() {
  const today = new Date()
  const day = today.getDay() // 0=Dom, 6=Sáb
  const results = []

  for (let i = 0; i <= 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const wd = d.getDay()
    if (wd === 6 || wd === 0) {
      results.push(d.toISOString().slice(0, 10))
    }
    if (results.length === 2) break
  }
  return results
}

async function fetchWeather(mountainId) {
  if (cache.has(mountainId)) return cache.get(mountainId)

  const coords = mountainCoordinates[mountainId]
  if (!coords) return null

  const params = new URLSearchParams({
    latitude: coords.lat,
    longitude: coords.lon,
    current: 'temperature_2m,wind_speed_10m,weather_code',
    daily: 'snowfall_sum,temperature_2m_max,temperature_2m_min,weather_code',
    past_days: 0,
    forecast_days: 8,
    timezone: 'auto',
  })

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
  const json = await res.json()
  const result = { loading: false, error: false, data: json }
  cache.set(mountainId, result)
  return result
}

export function useWeekendForecast(mountains) {
  const [state, setState] = useState({ loading: true, rankings: [] })

  useEffect(() => {
    const weekendDates = getWeekendDates()

    Promise.all(
      mountains.map(m =>
        fetchWeather(m.id)
          .then(result => ({ mountain: m, result }))
          .catch(() => ({ mountain: m, result: null }))
      )
    ).then(all => {
      const rankings = all
        .map(({ mountain, result }) => {
          if (!result?.data?.daily) {
            return { mountain, weekendSnow: 0, days: [], currentTemp: null, weatherCode: 0 }
          }

          const daily = result.data.daily
          const current = result.data.current ?? {}

          const days = (daily.time ?? []).map((date, i) => ({
            date,
            snowfall: daily.snowfall_sum?.[i] ?? 0,
            tempMax: daily.temperature_2m_max?.[i] ?? null,
            weatherCode: daily.weather_code?.[i] ?? 0,
          }))

          const weekendDays = days.filter(d => weekendDates.includes(d.date))
          const weekendSnow = weekendDays.reduce((sum, d) => sum + (d.snowfall ?? 0), 0)

          return {
            mountain,
            weekendSnow: Math.round(weekendSnow),
            weekendDays,
            currentTemp: current.temperature_2m ?? null,
            weatherCode: current.weather_code ?? 0,
          }
        })
        .sort((a, b) => {
          if (b.weekendSnow !== a.weekendSnow) return b.weekendSnow - a.weekendSnow
          return b.mountain.snowDepthCm - a.mountain.snowDepthCm
        })

      setState({ loading: false, rankings, weekendDates })
    })
  }, [mountains])

  return state
}
