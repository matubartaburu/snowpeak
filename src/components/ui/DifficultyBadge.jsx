const DIFFICULTY_CONFIG = {
  beginner: {
    label: 'Verde',
    icon: '🟢',
    color: 'var(--color-difficulty-beginner)',
    bg: 'rgba(76, 175, 130, 0.15)',
    border: 'rgba(76, 175, 130, 0.3)',
  },
  intermediate: {
    label: 'Azul',
    icon: '🔵',
    color: 'var(--color-difficulty-intermediate)',
    bg: 'rgba(58, 143, 212, 0.15)',
    border: 'rgba(58, 143, 212, 0.3)',
  },
  expert: {
    label: 'Negro',
    icon: '⬛',
    color: 'var(--color-difficulty-expert)',
    bg: 'var(--color-difficulty-expert-bg)',
    border: 'rgba(232, 244, 253, 0.2)',
  },
}

export function DifficultyBadge({ difficulty, percentage }) {
  const config = DIFFICULTY_CONFIG[difficulty]
  if (!config) return null

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-1)',
      background: config.bg,
      border: `1px solid ${config.border}`,
      borderRadius: 'var(--radius-full)',
      padding: 'var(--space-1) var(--space-3)',
    }}>
      <span style={{ fontSize: '0.6rem', lineHeight: 1 }}>{config.icon}</span>
      <span style={{
        fontSize: 'var(--font-size-xs)',
        fontWeight: '600',
        color: config.color,
        letterSpacing: '0.02em',
      }}>
        {config.label}
      </span>
      {percentage !== undefined && (
        <span style={{
          fontSize: 'var(--font-size-xs)',
          color: config.color,
          opacity: 0.8,
        }}>
          {percentage}%
        </span>
      )}
    </div>
  )
}
