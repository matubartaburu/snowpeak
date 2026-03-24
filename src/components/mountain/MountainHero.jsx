import { StarRating } from '../ui/StarRating.jsx'
import { monthName } from '../../utils/date.js'

export function MountainHero({ mountain }) {
  const navigate = (path) => { window.location.hash = path }

  const statItems = [
    { icon: '▲', label: 'Cima', value: `${mountain.elevationTopM.toLocaleString()} m` },
    { icon: '▼', label: 'Base', value: `${mountain.elevationBaseM.toLocaleString()} m` },
    { icon: '⛷️', label: 'Pistas', value: `${mountain.totalRunsKm} km` },
    { icon: '🚡', label: 'Remontes', value: mountain.lifts },
    { icon: '📅', label: 'Temporada', value: `${monthName(mountain.season.openMonth)} – ${monthName(mountain.season.closeMonth)}` },
    { icon: '❄', label: 'Nieve actual', value: `${mountain.snowDepthCm} cm` },
  ]

  return (
    <div style={{
      background: mountain.gradient,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Mountain silhouette overlay */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60px',
        background: 'linear-gradient(to top, var(--color-bg-primary) 0%, transparent 100%)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* Grid decoration */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(74, 158, 255, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 40%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: 'var(--space-12) var(--space-6) var(--space-16)',
        position: 'relative',
        zIndex: 2,
      }}>
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 'var(--radius-full)',
            padding: 'var(--space-2) var(--space-5)',
            color: 'var(--color-accent-snow)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: '500',
            cursor: 'pointer',
            marginBottom: 'var(--space-8)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(0,0,0,0.5)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(0,0,0,0.3)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
          }}
        >
          ← Volver al inicio
        </button>

        {/* Country + Region breadcrumb */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          marginBottom: 'var(--space-4)',
        }}>
          <span style={{
            background: 'rgba(74, 158, 255, 0.2)',
            border: '1px solid rgba(74, 158, 255, 0.3)',
            borderRadius: 'var(--radius-full)',
            padding: 'var(--space-1) var(--space-3)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-accent-primary)',
            fontWeight: '600',
          }}>
            {mountain.country}
          </span>
          <span style={{ color: 'rgba(232,244,253,0.5)', fontSize: 'var(--font-size-sm)' }}>›</span>
          <span style={{ color: 'rgba(232,244,253,0.7)', fontSize: 'var(--font-size-sm)' }}>
            {mountain.region}
          </span>
        </div>

        {/* Mountain name */}
        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          fontWeight: '900',
          color: 'var(--color-accent-snow)',
          marginBottom: 'var(--space-4)',
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          textShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}>
          {mountain.name}
        </h1>

        {/* Rating display */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-10)',
          flexWrap: 'wrap',
        }}>
          <div style={{
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(8px)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-3) var(--space-5)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <span style={{
              fontSize: '2.5rem',
              fontWeight: '900',
              color: '#f5c842',
              lineHeight: 1,
            }}>
              {mountain.aggregateRating.overall.toFixed(1)}
            </span>
            <div>
              <StarRating value={mountain.aggregateRating.overall} size="md" />
              <div style={{
                fontSize: 'var(--font-size-xs)',
                color: 'rgba(232,244,253,0.6)',
                marginTop: '2px',
              }}>
                {mountain.aggregateRating.reviewCount} reseñas
              </div>
            </div>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            {mountain.tags.map(tag => (
              <span key={tag} style={{
                background: 'rgba(0,0,0,0.3)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 'var(--radius-full)',
                padding: 'var(--space-1) var(--space-3)',
                fontSize: 'var(--font-size-xs)',
                color: 'rgba(232,244,253,0.85)',
                fontWeight: '500',
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div style={{
          display: 'flex',
          gap: 'var(--space-2)',
          flexWrap: 'wrap',
        }}>
          {statItems.map(({ icon, label, value }) => (
            <div key={label} style={{
              background: 'rgba(0,0,0,0.35)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-3) var(--space-4)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              flex: '0 0 auto',
            }}>
              <span style={{ fontSize: '1rem' }}>{icon}</span>
              <div>
                <div style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'rgba(232,244,253,0.5)',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  lineHeight: 1,
                }}>
                  {label}
                </div>
                <div style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-accent-snow)',
                  fontWeight: '700',
                  lineHeight: 1.3,
                }}>
                  {value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
