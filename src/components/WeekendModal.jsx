import { useEffect } from 'react'
import { useWeekendForecast } from '../hooks/useWeekendForecast.js'

const WMO_ICONS = { 0:'☀️',1:'🌤️',2:'⛅',3:'☁️',45:'🌫️',71:'🌨️',73:'❄️',75:'❄️',80:'🌦️',85:'🌨️',86:'❄️',95:'⛈️' }
function getIcon(code) {
  const keys = Object.keys(WMO_ICONS).map(Number).sort((a,b)=>a-b)
  const match = keys.slice().reverse().find(k => code >= k)
  return WMO_ICONS[match] ?? '🌡️'
}

const MEDALS = ['🥇', '🥈', '🥉']
const DAYS_ES = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']

function getSnowVerdict(cm) {
  if (cm >= 50) return { label: '¡Nevón épico!', color: '#c8e6ff' }
  if (cm >= 25) return { label: 'Excelente nevada', color: '#7eb8e8' }
  if (cm >= 10) return { label: 'Buena nevada', color: '#4a9eff' }
  if (cm >= 3)  return { label: 'Algo de nieve', color: '#a8c4d8' }
  return { label: 'Sin nevada', color: '#4a5568' }
}

export function WeekendModal({ mountains, onClose }) {
  const { loading, rankings, weekendDates } = useWeekendForecast(mountains)

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const weekendLabel = weekendDates
    ? weekendDates.map(d => {
        const date = new Date(d + 'T12:00:00')
        return `${DAYS_ES[date.getDay()]} ${date.getDate()}`
      }).join(' y ')
    : 'este finde'

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5, 8, 20, 0.92)',
        backdropFilter: 'blur(12px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        overflowY: 'auto',
        padding: 'var(--space-8) var(--space-4)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxWidth: '680px',
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0a1628 0%, #1a2a4a 100%)',
          padding: 'var(--space-8) var(--space-8) var(--space-6)',
          position: 'relative',
          textAlign: 'center',
          borderBottom: '1px solid var(--color-border)',
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 'var(--space-4)',
              right: 'var(--space-4)',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--color-accent-snow-dim)',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
          <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>🏔️❄️</div>
          <h2 style={{
            fontSize: 'var(--font-size-2xl)',
            fontWeight: '800',
            color: 'var(--color-accent-snow)',
            marginBottom: 'var(--space-2)',
            letterSpacing: '-0.02em',
          }}>
            ¿A dónde voy este finde?
          </h2>
          <p style={{ color: 'var(--color-accent-snow-dim)', fontSize: 'var(--font-size-sm)' }}>
            Pronóstico de nieve para {weekendLabel} · {mountains.length} resorts analizados
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: 'var(--space-6)' }}>
          {loading ? (
            <div style={{
              textAlign: 'center',
              padding: 'var(--space-12) 0',
              color: 'var(--color-accent-snow-dim)',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--space-4)', animation: 'spin 2s linear infinite', display: 'inline-block' }}>❄️</div>
              <div style={{ fontSize: 'var(--font-size-md)', fontWeight: '600', color: 'var(--color-accent-snow)', marginBottom: 'var(--space-2)' }}>
                Analizando {mountains.length} resorts...
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)' }}>
                Consultando pronósticos en tiempo real
              </div>
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {rankings.map((item, index) => {
                const verdict = getSnowVerdict(item.weekendSnow)
                const isTop3 = index < 3
                const medal = MEDALS[index] ?? null

                return (
                  <div
                    key={item.mountain.id}
                    style={{
                      background: isTop3 ? 'var(--color-bg-elevated)' : 'var(--color-surface)',
                      border: `1px solid ${isTop3 ? 'rgba(74,158,255,0.3)' : 'var(--color-border)'}`,
                      borderRadius: 'var(--radius-lg)',
                      padding: 'var(--space-4)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-4)',
                      transition: 'transform 0.15s',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      window.location.hash = `/mountain/${item.mountain.id}`
                      onClose()
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
                  >
                    {/* Rank */}
                    <div style={{
                      fontSize: isTop3 ? '1.8rem' : 'var(--font-size-lg)',
                      fontWeight: '800',
                      color: isTop3 ? 'var(--color-accent-snow)' : 'var(--color-accent-snow-dim)',
                      minWidth: '40px',
                      textAlign: 'center',
                      lineHeight: 1,
                    }}>
                      {medal ?? `#${index + 1}`}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: '4px' }}>
                        <span style={{
                          fontSize: 'var(--font-size-md)',
                          fontWeight: '700',
                          color: 'var(--color-accent-snow)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                          {item.mountain.name}
                        </span>
                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-accent-snow-dim)' }}>
                          {item.mountain.country}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: 'var(--font-size-xs)',
                          color: verdict.color,
                          fontWeight: '600',
                        }}>
                          {verdict.label}
                        </span>
                        {item.currentTemp !== null && (
                          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-accent-snow-dim)' }}>
                            {getIcon(item.weatherCode)} {Math.round(item.currentTemp)}°C
                          </span>
                        )}
                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-accent-snow-dim)' }}>
                          Base: {item.mountain.snowDepthCm}cm
                        </span>
                      </div>

                      {/* Desglose por día */}
                      {item.weekendDays?.length > 0 && (
                        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                          {item.weekendDays.map(day => {
                            const date = new Date(day.date + 'T12:00:00')
                            return (
                              <span key={day.date} style={{
                                background: 'var(--color-surface)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-sm)',
                                padding: '2px 8px',
                                fontSize: 'var(--font-size-xs)',
                                color: day.snowfall > 0 ? '#c8e6ff' : 'var(--color-accent-snow-dim)',
                              }}>
                                {DAYS_ES[date.getDay()]}: {day.snowfall > 0 ? `❄ ${Math.round(day.snowfall)}cm` : `${getIcon(day.weatherCode)}`}
                              </span>
                            )
                          })}
                        </div>
                      )}
                    </div>

                    {/* Snow total */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{
                        fontSize: isTop3 ? 'var(--font-size-2xl)' : 'var(--font-size-xl)',
                        fontWeight: '800',
                        color: verdict.color,
                        lineHeight: 1,
                      }}>
                        {item.weekendSnow}
                      </div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-accent-snow-dim)' }}>
                        cm finde
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && (
          <div style={{
            borderTop: '1px solid var(--color-border)',
            padding: 'var(--space-4) var(--space-6)',
            textAlign: 'center',
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-accent-snow-dim)',
          }}>
            Datos de pronóstico en tiempo real · Open-Meteo API · Hacé click en un resort para ver el detalle completo
          </div>
        )}
      </div>
    </div>
  )
}
