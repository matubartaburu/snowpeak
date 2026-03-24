import { StarRating } from '../ui/StarRating.jsx'
import { timeAgo, monthName } from '../../utils/date.js'

export function ReviewItem({ review }) {
  const initials = review.authorName
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const avatarColors = [
    '#4a9eff', '#4caf82', '#e85d75', '#f5c842', '#9b59b6', '#e67e22'
  ]
  const colorIndex = review.authorName.charCodeAt(0) % avatarColors.length
  const avatarColor = avatarColors[colorIndex]

  return (
    <div style={{
      background: 'var(--color-bg-elevated)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-5)',
      transition: 'border-color var(--transition-fast)',
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-border-focus)'}
    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--space-3)',
        marginBottom: 'var(--space-4)',
      }}>
        {/* Avatar */}
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: 'var(--radius-full)',
          background: `${avatarColor}25`,
          border: `2px solid ${avatarColor}60`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'var(--font-size-sm)',
          fontWeight: '700',
          color: avatarColor,
          flexShrink: 0,
        }}>
          {initials}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-2)',
            flexWrap: 'wrap',
          }}>
            <span style={{
              fontWeight: '600',
              color: 'var(--color-accent-snow)',
              fontSize: 'var(--font-size-sm)',
            }}>
              {review.authorName}
            </span>
            <span style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-accent-snow-dim)',
            }}>
              {timeAgo(review.createdAt)}
            </span>
          </div>
          {review.visitedMonth && (
            <span style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-accent-primary)',
              marginTop: '2px',
              display: 'block',
            }}>
              📅 Visitó en {monthName(review.visitedMonth)}
            </span>
          )}
        </div>
      </div>

      {/* Ratings */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-6)',
        marginBottom: 'var(--space-4)',
        flexWrap: 'wrap',
      }}>
        <div>
          <div style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-accent-snow-dim)',
            marginBottom: 'var(--space-1)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: '500',
          }}>
            General
          </div>
          <StarRating value={review.ratings.overall} size="sm" showValue />
        </div>
        <div>
          <div style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-accent-snow-dim)',
            marginBottom: 'var(--space-1)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: '500',
          }}>
            Calidad Nieve
          </div>
          <StarRating value={review.ratings.snowQuality} size="sm" showValue />
        </div>
      </div>

      {/* Title */}
      <h4 style={{
        fontSize: 'var(--font-size-base)',
        fontWeight: '700',
        color: 'var(--color-accent-snow)',
        marginBottom: 'var(--space-2)',
      }}>
        {review.title}
      </h4>

      {/* Body */}
      <p style={{
        fontSize: 'var(--font-size-sm)',
        color: 'var(--color-accent-snow-dim)',
        lineHeight: '1.7',
        margin: 0,
      }}>
        {review.body}
      </p>
    </div>
  )
}
