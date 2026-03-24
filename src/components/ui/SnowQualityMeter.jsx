import { getSnowQualityInfo } from '../../logic/snow.js'

export function SnowQualityMeter({ score = 0, showLabel = true }) {
  const info = getSnowQualityInfo(score)
  const filled = Math.round(score)
  const total = 5

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
      <div style={{ display: 'flex', gap: '2px' }}>
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            style={{
              fontSize: '0.9rem',
              color: i < filled ? info.color : 'var(--color-star-empty)',
              transition: 'color var(--transition-fast)',
              lineHeight: 1,
            }}
          >
            ❄
          </span>
        ))}
      </div>
      {showLabel && (
        <span style={{
          fontSize: 'var(--font-size-xs)',
          color: info.color,
          fontWeight: '500',
          whiteSpace: 'nowrap',
        }}>
          {info.emoji} {info.label}
        </span>
      )}
    </div>
  )
}
