import { useEffect, useRef } from 'react'
import { useMountainContext } from '../context/MountainContext.jsx'
import { MountainGrid } from '../components/mountain/MountainGrid.jsx'

function SnowParticles() {
  return (
    <>
      <style>{`
        @keyframes snowfall {
          0% { transform: translateY(-10px) translateX(0px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.7; }
          100% { transform: translateY(100vh) translateX(var(--drift)); opacity: 0; }
        }
        .snow-particle {
          position: absolute;
          top: -10px;
          border-radius: 50%;
          background: rgba(232, 244, 253, 0.8);
          animation: snowfall linear infinite;
          pointer-events: none;
        }
      `}</style>
      {Array.from({ length: 40 }).map((_, i) => {
        const size = Math.random() * 4 + 2
        const left = Math.random() * 100
        const duration = Math.random() * 10 + 8
        const delay = Math.random() * 10
        const drift = (Math.random() - 0.5) * 100
        return (
          <div
            key={i}
            className="snow-particle"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              animationDuration: `${duration}s`,
              animationDelay: `${-delay}s`,
              '--drift': `${drift}px`,
              opacity: Math.random() * 0.6 + 0.4,
            }}
          />
        )
      })}
    </>
  )
}

function FilterBar() {
  const { filters, setFilter, clearFilters, countries } = useMountainContext()

  const activeFilterCount = [
    filters.difficulty !== 'all',
    filters.country !== 'all',
    filters.minRating > 0,
  ].filter(Boolean).length

  const selectStyle = {
    background: 'var(--color-bg-elevated)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-2) var(--space-3)',
    color: 'var(--color-accent-snow)',
    fontSize: 'var(--font-size-sm)',
    outline: 'none',
    cursor: 'pointer',
    minWidth: '140px',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23a8c4d8' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
    paddingRight: 'var(--space-8)',
  }

  const inputStyle = {
    background: 'var(--color-bg-elevated)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-2) var(--space-4)',
    color: 'var(--color-accent-snow)',
    fontSize: 'var(--font-size-sm)',
    outline: 'none',
    flex: 1,
    minWidth: '200px',
    maxWidth: '320px',
  }

  return (
    <div style={{
      background: 'var(--color-bg-secondary)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-5)',
      display: 'flex',
      gap: 'var(--space-3)',
      flexWrap: 'wrap',
      alignItems: 'center',
      marginBottom: 'var(--space-8)',
    }}>
      {/* Search */}
      <div style={{ position: 'relative', flex: 1, minWidth: '200px', maxWidth: '320px' }}>
        <span style={{
          position: 'absolute',
          left: 'var(--space-3)',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--color-accent-snow-dim)',
          fontSize: '0.9rem',
          pointerEvents: 'none',
        }}>🔍</span>
        <input
          type="text"
          placeholder="Buscar montañas..."
          value={filters.search}
          onChange={e => setFilter('search', e.target.value)}
          style={{ ...inputStyle, paddingLeft: 'var(--space-8)', maxWidth: '100%', width: '100%' }}
          onFocus={e => e.target.style.borderColor = 'var(--color-border-focus)'}
          onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
        />
      </div>

      {/* Difficulty */}
      <select
        value={filters.difficulty}
        onChange={e => setFilter('difficulty', e.target.value)}
        style={selectStyle}
      >
        <option value="all">Todos los niveles</option>
        <option value="beginner">🟢 Principiante</option>
        <option value="intermediate">🔵 Intermedio</option>
        <option value="expert">⬛ Experto</option>
      </select>

      {/* Country */}
      <select
        value={filters.country}
        onChange={e => setFilter('country', e.target.value)}
        style={selectStyle}
      >
        <option value="all">Todos los países</option>
        {countries.filter(c => c !== 'all').map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {/* Min rating */}
      <select
        value={filters.minRating}
        onChange={e => setFilter('minRating', parseFloat(e.target.value))}
        style={selectStyle}
      >
        <option value={0}>Cualquier valoración</option>
        <option value={4}>★ 4+ estrellas</option>
        <option value={4.5}>★ 4.5+ estrellas</option>
      </select>

      {/* Sort */}
      <select
        value={filters.sortBy}
        onChange={e => setFilter('sortBy', e.target.value)}
        style={selectStyle}
      >
        <option value="rating">Mejor valoración</option>
        <option value="name">Nombre A-Z</option>
        <option value="elevation">Mayor altitud</option>
        <option value="snowDepth">Mayor nieve</option>
      </select>

      {/* Sort direction */}
      <button
        onClick={() => setFilter('sortDir', filters.sortDir === 'desc' ? 'asc' : 'desc')}
        style={{
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-2) var(--space-3)',
          color: 'var(--color-accent-snow-dim)',
          cursor: 'pointer',
          fontSize: '1rem',
          transition: 'all var(--transition-fast)',
        }}
        title={filters.sortDir === 'desc' ? 'Descendente' : 'Ascendente'}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-border-focus)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
      >
        {filters.sortDir === 'desc' ? '↓' : '↑'}
      </button>

      {/* Active filters badge + clear */}
      {activeFilterCount > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span style={{
            background: 'var(--color-accent-primary)',
            borderRadius: 'var(--radius-full)',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'var(--font-size-xs)',
            fontWeight: '700',
            color: '#fff',
          }}>
            {activeFilterCount}
          </span>
          <button
            onClick={clearFilters}
            style={{
              background: 'rgba(232, 93, 117, 0.1)',
              border: '1px solid rgba(232, 93, 117, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-2) var(--space-3)',
              color: 'var(--color-error)',
              cursor: 'pointer',
              fontSize: 'var(--font-size-xs)',
              fontWeight: '600',
            }}
          >
            ✕ Limpiar
          </button>
        </div>
      )}
    </div>
  )
}

function StatsBar({ mountains }) {
  const avgRating = mountains.length > 0
    ? (mountains.reduce((sum, m) => sum + m.aggregateRating.overall, 0) / mountains.length).toFixed(1)
    : '0.0'
  const countries = new Set(mountains.map(m => m.country)).size
  const totalReviews = mountains.reduce((sum, m) => sum + m.aggregateRating.reviewCount, 0)

  const stats = [
    { icon: '🏔️', value: mountains.length, label: 'Montañas' },
    { icon: '⭐', value: avgRating, label: 'Valoración media' },
    { icon: '🌍', value: countries, label: 'Países' },
    { icon: '💬', value: totalReviews, label: 'Reseñas' },
  ]

  return (
    <div style={{
      display: 'flex',
      gap: 'var(--space-4)',
      flexWrap: 'wrap',
      marginBottom: 'var(--space-6)',
    }}>
      {stats.map(({ icon, value, label }) => (
        <div key={label} style={{
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-4) var(--space-5)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          flex: '1 1 140px',
        }}>
          <span style={{ fontSize: '1.5rem' }}>{icon}</span>
          <div>
            <div style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: '800',
              color: 'var(--color-accent-primary)',
              lineHeight: 1,
            }}>
              {value}
            </div>
            <div style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-accent-snow-dim)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: '500',
            }}>
              {label}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function HomePage() {
  const { mountains, filteredMountains } = useMountainContext()

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #0a1628 0%, #0d1f3a 30%, #0a0f1e 100%)',
        borderBottom: '1px solid var(--color-border)',
        minHeight: '500px',
        display: 'flex',
        alignItems: 'center',
      }}>
        <SnowParticles />

        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            radial-gradient(ellipse at 20% 50%, rgba(74, 158, 255, 0.07) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 20%, rgba(200, 230, 255, 0.04) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
        }} />

        {/* Mountain silhouette decorative SVG */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '120px',
          background: 'linear-gradient(to top, var(--color-bg-primary) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: 'var(--space-16) var(--space-6)',
          position: 'relative',
          zIndex: 1,
          width: '100%',
        }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            background: 'var(--color-accent-primary-muted)',
            border: '1px solid rgba(74, 158, 255, 0.3)',
            borderRadius: 'var(--radius-full)',
            padding: 'var(--space-2) var(--space-4)',
            marginBottom: 'var(--space-6)',
          }}>
            <span style={{ color: 'var(--color-accent-primary)', fontSize: '0.85rem' }}>❄</span>
            <span style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-accent-primary)',
              fontWeight: '600',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              Temporada 2026 — En vivo
            </span>
            <span style={{
              width: '6px',
              height: '6px',
              background: 'var(--color-success)',
              borderRadius: '50%',
              animation: 'pulse 2s infinite',
            }} />
          </div>

          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.5; transform: scale(1.2); }
            }
          `}</style>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: '900',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            marginBottom: 'var(--space-5)',
            maxWidth: '700px',
          }}>
            <span style={{ color: 'var(--color-accent-snow)' }}>Encuentra tu </span>
            <span style={{
              background: 'linear-gradient(135deg, var(--color-accent-primary) 0%, #a8d8ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              montaña perfecta
            </span>
          </h1>

          <p style={{
            fontSize: 'var(--font-size-xl)',
            color: 'var(--color-accent-snow-dim)',
            maxWidth: '560px',
            lineHeight: 1.6,
            marginBottom: 'var(--space-10)',
          }}>
            Compara las mejores estaciones de ski del mundo, lee reseñas reales y planifica tu próxima aventura en la nieve.
          </p>

          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              background: 'rgba(0,0,0,0.3)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 'var(--radius-full)',
              padding: 'var(--space-2) var(--space-5)',
            }}>
              {['🇫🇷', '🇨🇦', '🇨🇭', '🇯🇵', '🇺🇸', '🇦🇷', '🇨🇱'].map((flag, i) => (
                <span key={i} style={{ fontSize: '1.25rem' }}>{flag}</span>
              ))}
              <span style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-accent-snow-dim)',
                marginLeft: 'var(--space-2)',
              }}>
                10 destinos
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: 'var(--space-10) var(--space-6)',
      }} id="mountains-grid">
        {/* Section title */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-6)',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
        }}>
          <div>
            <h2 style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: '800',
              color: 'var(--color-accent-snow)',
              letterSpacing: '-0.02em',
              marginBottom: 'var(--space-1)',
            }}>
              🏔️ Mejores Montañas
            </h2>
            <p style={{
              color: 'var(--color-accent-snow-dim)',
              fontSize: 'var(--font-size-sm)',
            }}>
              {filteredMountains.length} de {mountains.length} estaciones
            </p>
          </div>
        </div>

        {/* Stats bar */}
        <StatsBar mountains={filteredMountains} />

        {/* Filter bar */}
        <FilterBar />

        {/* Mountain grid */}
        <MountainGrid mountains={filteredMountains} />
      </section>
    </div>
  )
}
