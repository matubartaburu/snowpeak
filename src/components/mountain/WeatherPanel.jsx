import { useWeather } from '../../hooks/useWeather.js'

const WMO = {
  0:  { icon: '☀️', label: 'Despejado' },
  1:  { icon: '🌤️', label: 'Mayormente despejado' },
  2:  { icon: '⛅', label: 'Parcialmente nublado' },
  3:  { icon: '☁️', label: 'Nublado' },
  45: { icon: '🌫️', label: 'Niebla' },
  48: { icon: '🌫️', label: 'Niebla helada' },
  51: { icon: '🌦️', label: 'Llovizna ligera' },
  53: { icon: '🌦️', label: 'Llovizna' },
  55: { icon: '🌧️', label: 'Llovizna intensa' },
  61: { icon: '🌧️', label: 'Lluvia ligera' },
  63: { icon: '🌧️', label: 'Lluvia' },
  65: { icon: '🌧️', label: 'Lluvia intensa' },
  71: { icon: '🌨️', label: 'Nevada ligera' },
  73: { icon: '❄️', label: 'Nevada' },
  75: { icon: '❄️', label: 'Nevada intensa' },
  77: { icon: '🌨️', label: 'Granizo' },
  80: { icon: '🌦️', label: 'Chubascos' },
  81: { icon: '🌧️', label: 'Chubascos fuertes' },
  82: { icon: '⛈️', label: 'Chubascos muy fuertes' },
  85: { icon: '🌨️', label: 'Chubascos de nieve' },
  86: { icon: '❄️', label: 'Chubascos de nieve fuertes' },
  95: { icon: '⛈️', label: 'Tormenta' },
  96: { icon: '⛈️', label: 'Tormenta con granizo' },
  99: { icon: '⛈️', label: 'Tormenta intensa' },
}

const DAYS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

function getCondition(code) {
  // Buscar la clave más cercana
  const keys = Object.keys(WMO).map(Number).sort((a, b) => a - b)
  const match = keys.reverse().find(k => code >= k)
  return WMO[match] ?? { icon: '🌡️', label: 'Desconocido' }
}

function estimateSummitTemp(baseTemp, baseElevation, summitElevation) {
  const diff = (summitElevation - baseElevation) / 1000
  return Math.round(baseTemp - diff * 6.5)
}

function TempBadge({ label, value, sub }) {
  const color = value <= -10 ? '#c8e6ff'
    : value <= 0  ? '#7eb8e8'
    : value <= 5  ? '#a8c4d8'
    : '#f5c842'

  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-3) var(--space-4)',
      textAlign: 'center',
      flex: 1,
    }}>
      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-accent-snow-dim)', marginBottom: '4px' }}>
        {label}
      </div>
      <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '800', color, lineHeight: 1 }}>
        {value > 0 ? '+' : ''}{value}°
      </div>
      {sub && (
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-accent-snow-dim)', marginTop: '2px' }}>
          {sub}
        </div>
      )}
    </div>
  )
}

function ForecastDay({ day, isToday }) {
  const date = new Date(day.date + 'T12:00:00')
  const dayName = isToday ? 'Hoy' : DAYS_ES[date.getDay()]
  const condition = getCondition(day.weatherCode)
  const hasSnow = day.snowfall > 0

  return (
    <div style={{
      background: isToday ? 'rgba(74, 158, 255, 0.1)' : 'var(--color-surface)',
      border: `1px solid ${isToday ? 'rgba(74, 158, 255, 0.4)' : 'var(--color-border)'}`,
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-3)',
      textAlign: 'center',
      minWidth: 0,
      flex: 1,
    }}>
      <div style={{
        fontSize: 'var(--font-size-xs)',
        fontWeight: isToday ? '700' : '500',
        color: isToday ? 'var(--color-accent-primary)' : 'var(--color-accent-snow-dim)',
        marginBottom: 'var(--space-2)',
      }}>
        {dayName}
      </div>
      <div style={{ fontSize: '1.4rem', marginBottom: 'var(--space-2)' }}>
        {condition.icon}
      </div>
      <div style={{
        fontSize: 'var(--font-size-sm)',
        fontWeight: '700',
        color: hasSnow ? '#c8e6ff' : 'var(--color-accent-snow-dim)',
        marginBottom: '4px',
      }}>
        {hasSnow ? `❄ ${Math.round(day.snowfall)}cm` : '—'}
      </div>
      <div style={{
        fontSize: 'var(--font-size-xs)',
        color: 'var(--color-accent-snow-dim)',
      }}>
        {day.tempMax !== null ? `${Math.round(day.tempMax)}° / ${Math.round(day.tempMin)}°` : '—'}
      </div>
    </div>
  )
}

export function WeatherPanel({ mountain }) {
  const { loading, data, error } = useWeather(mountain.id)

  const containerStyle = {
    background: 'var(--color-bg-elevated)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-6)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-6)',
  }

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <span style={{ fontSize: '1.4rem' }}>🌡️</span>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: '700', color: 'var(--color-accent-snow)' }}>
            Condiciones en pista
          </h3>
        </div>
        <div style={{ color: 'var(--color-accent-snow-dim)', fontSize: 'var(--font-size-sm)', textAlign: 'center', padding: 'var(--space-8) 0' }}>
          ❄️ Cargando datos meteorológicos...
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div style={containerStyle}>
        <div style={{ color: 'var(--color-accent-snow-dim)', fontSize: 'var(--font-size-sm)' }}>
          No se pudo cargar el parte meteorológico.
        </div>
      </div>
    )
  }

  const condition = getCondition(data.weatherCode)
  const summitTemp = data.currentTemp !== null
    ? estimateSummitTemp(data.currentTemp, mountain.elevationBaseM, mountain.elevationTopM)
    : null

  const totalForecastSnow = data.forecast.reduce((sum, d) => sum + (d.snowfall ?? 0), 0)

  return (
    <div style={containerStyle}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <span style={{ fontSize: '1.4rem' }}>🌡️</span>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: '700', color: 'var(--color-accent-snow)' }}>
            Condiciones en pista
          </h3>
        </div>
        <span style={{
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-accent-snow-dim)',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-full)',
          padding: '2px 10px',
        }}>
          Actualizado hoy
        </span>
      </div>

      {/* Condición actual */}
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-4)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-4)',
      }}>
        <span style={{ fontSize: '2.5rem' }}>{condition.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 'var(--font-size-md)',
            fontWeight: '700',
            color: 'var(--color-accent-snow)',
            marginBottom: '4px',
          }}>
            {condition.label}
          </div>
          {data.windSpeed !== null && (
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-accent-snow-dim)' }}>
              💨 Viento: {Math.round(data.windSpeed)} km/h
              {data.windSpeed > 50 && (
                <span style={{ color: '#f5c842', marginLeft: '8px', fontSize: 'var(--font-size-xs)' }}>
                  ⚠ Viento fuerte
                </span>
              )}
            </div>
          )}
        </div>
        <div style={{
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-accent-snow-dim)',
          textAlign: 'right',
        }}>
          <div>❄ {data.snowfall7d} cm</div>
          <div>últimos 7 días</div>
        </div>
      </div>

      {/* Temperaturas */}
      <div>
        <div style={{
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-accent-snow-dim)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontWeight: '500',
          marginBottom: 'var(--space-3)',
        }}>
          Temperatura
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          {data.currentTemp !== null && (
            <TempBadge
              label={`Base (${mountain.elevationBaseM}m)`}
              value={Math.round(data.currentTemp)}
            />
          )}
          {summitTemp !== null && (
            <TempBadge
              label={`Cima (${mountain.elevationTopM}m)`}
              value={summitTemp}
              sub="estimado"
            />
          )}
        </div>
      </div>

      {/* Pronóstico 7 días */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-3)',
        }}>
          <div style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-accent-snow-dim)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: '500',
          }}>
            Pronóstico — próximos 7 días
          </div>
          {totalForecastSnow > 0 && (
            <span style={{
              fontSize: 'var(--font-size-xs)',
              color: '#c8e6ff',
              fontWeight: '600',
              background: 'rgba(74, 158, 255, 0.1)',
              border: '1px solid rgba(74, 158, 255, 0.2)',
              borderRadius: 'var(--radius-full)',
              padding: '2px 8px',
            }}>
              ❄ {Math.round(totalForecastSnow)} cm totales
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)', overflowX: 'auto' }}>
          {data.forecast.slice(0, 7).map((day, i) => (
            <ForecastDay key={day.date} day={day} isToday={i === 0} />
          ))}
        </div>
      </div>

    </div>
  )
}
