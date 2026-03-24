import { useEffect, useRef } from 'react'
import { useMountainContext } from '../context/MountainContext.jsx'
import { useWeather } from '../hooks/useWeather.js'
import { mountainCoordinates } from '../data/coordinates.js'

// Colores según nieve pronosticada
function getSnowColor(snowfall7d) {
  if (snowfall7d === null) return '#4a5568'
  if (snowfall7d >= 60) return '#c8e6ff'
  if (snowfall7d >= 30) return '#7eb8e8'
  if (snowfall7d >= 10) return '#4a9eff'
  return '#2a3f5c'
}

function getSnowLabel(snowfall7d) {
  if (snowfall7d === null) return ''
  if (snowfall7d >= 60) return '❄❄❄'
  if (snowfall7d >= 30) return '❄❄'
  if (snowfall7d >= 10) return '❄'
  return ''
}

// Componente hijo que pre-fetcha el clima de cada montaña
function WeatherPrefetcher({ mountainId }) {
  useWeather(mountainId)
  return null
}

export function MapPage() {
  const { mountains } = useMountainContext()
  const mapRef = useRef(null)
  const instanceRef = useRef(null)

  useEffect(() => {
    // Cargar Leaflet dinámicamente
    Promise.all([
      import('leaflet'),
      import('leaflet/dist/leaflet.css'),
    ]).then(([L]) => {
      if (instanceRef.current) return // ya inicializado

      const map = L.default.map(mapRef.current, {
        center: [30, 10],
        zoom: 2,
        zoomControl: true,
        attributionControl: true,
      })

      // Tiles oscuros de CartoDB — gratis, sin API key
      L.default.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        {
          attribution: '© OpenStreetMap © CARTO',
          subdomains: 'abcd',
          maxZoom: 19,
        }
      ).addTo(map)

      instanceRef.current = map

      // Agregar marcadores
      mountains.forEach(mountain => {
        const coords = mountainCoordinates[mountain.id]
        if (!coords) return

        const snowfall = mountain.aggregateRating?.snowQuality ?? null
        const color = getSnowColor(mountain.snowDepthCm > 100 ? 60 : mountain.snowDepthCm > 50 ? 30 : mountain.snowDepthCm > 10 ? 10 : 0)
        const emoji = getSnowLabel(mountain.snowDepthCm > 100 ? 60 : mountain.snowDepthCm > 50 ? 30 : 5)

        const icon = L.default.divIcon({
          className: '',
          html: `
            <div style="
              background: #0a0f1e;
              border: 2px solid ${color};
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              width: 36px;
              height: 36px;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 0 12px ${color}88;
              cursor: pointer;
            ">
              <span style="transform: rotate(45deg); font-size: 16px;">⛷️</span>
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          popupAnchor: [0, -36],
        })

        const popup = L.default.popup({
          className: 'snowpeak-popup',
          maxWidth: 260,
        }).setContent(`
          <div style="
            background: #111827;
            border: 1px solid #2a3f5c;
            border-radius: 12px;
            padding: 14px;
            font-family: Inter, system-ui, sans-serif;
            min-width: 200px;
          ">
            <div style="font-size: 16px; font-weight: 800; color: #e8f4fd; margin-bottom: 4px;">
              ${mountain.name}
            </div>
            <div style="font-size: 12px; color: #a8c4d8; margin-bottom: 10px;">
              ${mountain.region}, ${mountain.country}
            </div>
            <div style="display: flex; gap: 8px; margin-bottom: 10px;">
              <div style="background: #1e2d42; border-radius: 8px; padding: 6px 10px; text-align: center; flex: 1;">
                <div style="font-size: 16px; font-weight: 700; color: #c8e6ff;">${mountain.snowDepthCm}</div>
                <div style="font-size: 10px; color: #a8c4d8;">cm nieve</div>
              </div>
              <div style="background: #1e2d42; border-radius: 8px; padding: 6px 10px; text-align: center; flex: 1;">
                <div style="font-size: 16px; font-weight: 700; color: #f5c842;">⭐ ${mountain.aggregateRating.overall.toFixed(1)}</div>
                <div style="font-size: 10px; color: #a8c4d8;">${mountain.aggregateRating.reviewCount} reseñas</div>
              </div>
              <div style="background: #1e2d42; border-radius: 8px; padding: 6px 10px; text-align: center; flex: 1;">
                <div style="font-size: 16px; font-weight: 700; color: #4a9eff;">▲${(mountain.elevationTopM/1000).toFixed(1)}k</div>
                <div style="font-size: 10px; color: #a8c4d8;">metros</div>
              </div>
            </div>
            <a
              href="#/mountain/${mountain.id}"
              style="
                display: block;
                background: #4a9eff;
                color: #fff;
                text-align: center;
                padding: 8px;
                border-radius: 8px;
                font-size: 13px;
                font-weight: 600;
                text-decoration: none;
              "
            >
              Ver condiciones →
            </a>
          </div>
        `)

        L.default.marker([coords.lat, coords.lon], { icon })
          .bindPopup(popup)
          .addTo(map)
      })
    })

    return () => {
      if (instanceRef.current) {
        instanceRef.current.remove()
        instanceRef.current = null
      }
    }
  }, [mountains])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <div style={{
        background: 'var(--color-bg-secondary)',
        borderBottom: '1px solid var(--color-border)',
        padding: 'var(--space-4) var(--space-6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div>
          <h1 style={{
            fontSize: 'var(--font-size-xl)',
            fontWeight: '700',
            color: 'var(--color-accent-snow)',
            marginBottom: '2px',
          }}>
            🗺️ Mapa de Resorts
          </h1>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-accent-snow-dim)' }}>
            {mountains.length} estaciones · Hacé click en un pin para ver las condiciones
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
            {[
              { color: '#c8e6ff', label: 'Mucha nieve' },
              { color: '#4a9eff', label: 'Algo de nieve' },
              { color: '#2a3f5c', label: 'Poca nieve' },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}88` }} />
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-accent-snow-dim)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mapa */}
      <div ref={mapRef} style={{ flex: 1, width: '100%' }} />

      {/* Pre-fetch clima de todas las montañas silenciosamente */}
      {mountains.map(m => <WeatherPrefetcher key={m.id} mountainId={m.id} />)}
    </div>
  )
}
