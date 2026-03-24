import { useState } from 'react'
import { ratingToStars } from '../../logic/ratings.js'

const SIZE_MAP = {
  sm: { fontSize: '1rem', gap: '1px' },
  md: { fontSize: '1.25rem', gap: '2px' },
  lg: { fontSize: '1.75rem', gap: '3px' },
}

export function StarRating({ value = 0, onChange, size = 'md', showValue = false }) {
  const [hovered, setHovered] = useState(0)
  const isInteractive = !!onChange
  const displayed = hovered || value
  const stars = ratingToStars(displayed)
  const { fontSize, gap } = SIZE_MAP[size] || SIZE_MAP.md

  const containerStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: gap,
  }

  const getStarContent = (type) => {
    if (type === 'full') return '★'
    if (type === 'half') return '⯨'
    return '☆'
  }

  const getStarColor = (type) => {
    if (type === 'full') return 'var(--color-star-filled)'
    if (type === 'half') return 'var(--color-star-filled)'
    return 'var(--color-star-empty)'
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
      <div style={containerStyle}>
        {stars.map((type, i) => {
          const starIndex = i + 1
          const isHoveredStar = hovered >= starIndex
          const displayType = isInteractive && hovered > 0
            ? (hovered >= starIndex ? 'full' : 'empty')
            : type

          return (
            <span
              key={i}
              style={{
                fontSize,
                color: isInteractive && hovered > 0
                  ? (hovered >= starIndex ? 'var(--color-star-filled)' : 'var(--color-star-empty)')
                  : getStarColor(type),
                cursor: isInteractive ? 'pointer' : 'default',
                transition: 'color var(--transition-fast), transform var(--transition-fast)',
                transform: isInteractive && isHoveredStar ? 'scale(1.2)' : 'scale(1)',
                display: 'inline-block',
                lineHeight: 1,
                userSelect: 'none',
              }}
              onClick={() => isInteractive && onChange(starIndex)}
              onMouseEnter={() => isInteractive && setHovered(starIndex)}
              onMouseLeave={() => isInteractive && setHovered(0)}
              title={isInteractive ? `${starIndex} estrella${starIndex !== 1 ? 's' : ''}` : undefined}
            >
              {displayType === 'full' || (isInteractive && isHoveredStar) ? '★' : (displayType === 'half' ? '⯨' : '☆')}
            </span>
          )
        })}
      </div>
      {showValue && (
        <span style={{
          fontSize: size === 'lg' ? 'var(--font-size-xl)' : 'var(--font-size-sm)',
          fontWeight: '600',
          color: 'var(--color-accent-snow)',
          minWidth: '2.5ch',
        }}>
          {value > 0 ? value.toFixed(1) : '—'}
        </span>
      )}
    </div>
  )
}
