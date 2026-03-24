import { useState } from 'react'
import { StarRating } from '../ui/StarRating.jsx'
import { SnowQualityMeter } from '../ui/SnowQualityMeter.jsx'
import { DifficultyBadge } from '../ui/DifficultyBadge.jsx'

export function MountainCard({ mountain }) {
  const [hovered, setHovered] = useState(false)

  const navigate = () => {
    window.location.hash = `/mountain/${mountain.id}`
  }

  const cardStyle = {
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    background: 'var(--color-bg-elevated)',
    border: `1px solid ${hovered ? 'var(--color-border-focus)' : 'var(--color-border)'}`,
    boxShadow: hovered ? 'var(--shadow-hover)' : 'var(--shadow-card)',
    transform: hovered ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
    transition: 'all var(--transition-normal)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
  }

  const heroStyle = {
    background: mountain.gradient,
    padding: 'var(--space-6)',
    minHeight: '140px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
  }

  const bodyStyle = {
    padding: 'var(--space-5)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-4)',
    flex: 1,
  }

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={navigate}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate()}
      aria-label={`Ver detalles de ${mountain.name}`}
    >
      {/* Hero gradient section */}
      <div style={heroStyle}>
        {/* Mountain silhouette decoration */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        {/* Country tag */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span style={{
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 'var(--radius-full)',
            padding: 'var(--space-1) var(--space-3)',
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-accent-snow)',
            fontWeight: '500',
          }}>
            {mountain.country}
          </span>
          <span style={{
            background: 'rgba(74, 158, 255, 0.2)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(74, 158, 255, 0.3)',
            borderRadius: 'var(--radius-full)',
            padding: 'var(--space-1) var(--space-3)',
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-accent-primary)',
            fontWeight: '600',
          }}>
            ▲ {mountain.elevationTopM.toLocaleString()}m
          </span>
        </div>

        {/* Mountain name */}
        <div>
          <h3 style={{
            fontSize: 'var(--font-size-2xl)',
            fontWeight: '800',
            color: 'var(--color-accent-snow)',
            marginBottom: 'var(--space-1)',
            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
          }}>
            {mountain.name}
          </h3>
          <p style={{
            fontSize: 'var(--font-size-sm)',
            color: 'rgba(232, 244, 253, 0.7)',
            fontWeight: '400',
          }}>
            {mountain.region}
          </p>
        </div>
      </div>

      {/* Card body */}
      <div style={bodyStyle}>
        {/* Rating row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <StarRating value={mountain.aggregateRating.overall} size="sm" showValue />
            <span style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-accent-snow-dim)',
            }}>
              ({mountain.aggregateRating.reviewCount} reseñas)
            </span>
          </div>
          <span style={{
            background: 'rgba(248, 200, 66, 0.1)',
            border: '1px solid rgba(248, 200, 66, 0.2)',
            borderRadius: 'var(--radius-sm)',
            padding: '2px var(--space-2)',
            fontSize: 'var(--font-size-xs)',
            color: '#f5c842',
            fontWeight: '700',
          }}>
            {mountain.aggregateRating.overall.toFixed(1)}
          </span>
        </div>

        {/* Snow quality */}
        <div>
          <div style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-accent-snow-dim)',
            marginBottom: 'var(--space-1)',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Calidad de Nieve
          </div>
          <SnowQualityMeter score={mountain.aggregateRating.snowQuality} showLabel />
        </div>

        {/* Snow depth & lifts */}
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <div style={{
            flex: 1,
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-3)',
            textAlign: 'center',
            border: '1px solid var(--color-border)',
          }}>
            <div style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: '700',
              color: 'var(--color-snow-powder)',
              lineHeight: 1,
            }}>
              {mountain.snowDepthCm}
            </div>
            <div style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-accent-snow-dim)',
              marginTop: '2px',
            }}>
              cm nieve
            </div>
          </div>
          <div style={{
            flex: 1,
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-3)',
            textAlign: 'center',
            border: '1px solid var(--color-border)',
          }}>
            <div style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: '700',
              color: 'var(--color-accent-primary)',
              lineHeight: 1,
            }}>
              {mountain.lifts}
            </div>
            <div style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-accent-snow-dim)',
              marginTop: '2px',
            }}>
              remontes
            </div>
          </div>
          <div style={{
            flex: 1,
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-3)',
            textAlign: 'center',
            border: '1px solid var(--color-border)',
          }}>
            <div style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: '700',
              color: 'var(--color-accent-snow)',
              lineHeight: 1,
            }}>
              {mountain.totalRunsKm}
            </div>
            <div style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-accent-snow-dim)',
              marginTop: '2px',
            }}>
              km pistas
            </div>
          </div>
        </div>

        {/* Difficulty badges */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <DifficultyBadge difficulty="beginner" percentage={mountain.difficulty.beginner} />
          <DifficultyBadge difficulty="intermediate" percentage={mountain.difficulty.intermediate} />
          <DifficultyBadge difficulty="expert" percentage={mountain.difficulty.expert} />
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {mountain.tags.slice(0, 3).map(tag => (
            <span key={tag} style={{
              background: 'var(--color-accent-primary-muted)',
              border: '1px solid rgba(74, 158, 255, 0.2)',
              borderRadius: 'var(--radius-full)',
              padding: '2px var(--space-2)',
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-accent-primary)',
              fontWeight: '500',
            }}>
              {tag}
            </span>
          ))}
          {mountain.tags.length > 3 && (
            <span style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-full)',
              padding: '2px var(--space-2)',
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-accent-snow-dim)',
            }}>
              +{mountain.tags.length - 3}
            </span>
          )}
        </div>

        {/* CTA Button */}
        <button
          onClick={e => { e.stopPropagation(); navigate() }}
          style={{
            background: hovered
              ? 'linear-gradient(135deg, var(--color-accent-primary) 0%, var(--color-accent-primary-hover) 100%)'
              : 'var(--color-accent-primary-muted)',
            border: `1px solid ${hovered ? 'var(--color-accent-primary)' : 'rgba(74, 158, 255, 0.3)'}`,
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-3) var(--space-5)',
            color: hovered ? '#fff' : 'var(--color-accent-primary)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: '600',
            width: '100%',
            transition: 'all var(--transition-fast)',
            letterSpacing: '0.02em',
          }}
        >
          Ver montaña →
        </button>
      </div>
    </div>
  )
}
