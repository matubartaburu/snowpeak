import { useSnowData } from '../../hooks/useSnowData.js'

function getSnowColor(cm) {
  if (cm === null) return 'var(--color-accent-snow-dim)'
  if (cm >= 50) return '#c8e6ff'   // mucha nieve — azul claro
  if (cm >= 20) return '#7eb8e8'   // buena nevada
  if (cm >= 5)  return '#4a9eff'   // algo de nieve
  return 'var(--color-accent-snow-dim)' // poca o nada
}

function getSnowLabel(cm) {
  if (cm === null) return null
  if (cm >= 80) return '🌨 ¡Nevón!'
  if (cm >= 40) return '❄️ Mucha nieve'
  if (cm >= 15) return '🌨 Buena nevada'
  if (cm >= 3)  return '❄️ Algo de nieve'
  return '☀️ Sin nevada'
}

export function SnowForecast({ mountainId, compact = false }) {
  const { loading, snowfall7d, error } = useSnowData(mountainId)

  if (loading) {
    return (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: 'var(--font-size-xs)',
        color: 'var(--color-accent-snow-dim)',
        opacity: 0.6,
      }}>
        <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>❄</span>
        Cargando parte...
      </div>
    )
  }

  if (error || snowfall7d === null) return null

  const color = getSnowColor(snowfall7d)
  const label = getSnowLabel(snowfall7d)

  if (compact) {
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        background: `rgba(74, 158, 255, 0.1)`,
        border: `1px solid rgba(74, 158, 255, 0.25)`,
        borderRadius: 'var(--radius-full)',
        padding: '2px 8px',
        fontSize: 'var(--font-size-xs)',
        color,
        fontWeight: '600',
      }}>
        ❄ {snowfall7d} cm / 7 días
      </span>
    )
  }

  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-4)',
    }}>
      <div style={{
        fontSize: 'var(--font-size-xs)',
        color: 'var(--color-accent-snow-dim)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        fontWeight: '500',
        marginBottom: 'var(--space-2)',
      }}>
        Nieve caída — últimos 7 días
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
        <span style={{
          fontSize: 'var(--font-size-3xl)',
          fontWeight: '800',
          color,
          lineHeight: 1,
        }}>
          {snowfall7d}
        </span>
        <span style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-accent-snow-dim)', fontWeight: '500' }}>
          cm
        </span>
      </div>
      {label && (
        <div style={{
          marginTop: 'var(--space-2)',
          fontSize: 'var(--font-size-sm)',
          color,
          fontWeight: '600',
        }}>
          {label}
        </div>
      )}
    </div>
  )
}
