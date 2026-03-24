import { ReviewItem } from './ReviewItem.jsx'

export function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: 'var(--space-10) var(--space-6)',
        background: 'var(--color-bg-elevated)',
        border: '1px dashed var(--color-border)',
        borderRadius: 'var(--radius-lg)',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-3)', opacity: 0.5 }}>💬</div>
        <p style={{
          color: 'var(--color-accent-snow-dim)',
          fontSize: 'var(--font-size-base)',
          fontWeight: '500',
        }}>
          Sé el primero en reseñar esta montaña
        </p>
        <p style={{
          color: 'var(--color-accent-snow-dim)',
          fontSize: 'var(--font-size-sm)',
          opacity: 0.7,
          marginTop: 'var(--space-2)',
        }}>
          Comparte tu experiencia con la comunidad SnowPeak
        </p>
      </div>
    )
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 'var(--space-5)',
      }}>
        <h3 style={{
          fontSize: 'var(--font-size-lg)',
          fontWeight: '700',
          color: 'var(--color-accent-snow)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
        }}>
          💬 Reseñas de la Comunidad
        </h3>
        <span style={{
          background: 'var(--color-accent-primary-muted)',
          border: '1px solid rgba(74, 158, 255, 0.3)',
          borderRadius: 'var(--radius-full)',
          padding: 'var(--space-1) var(--space-3)',
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-accent-primary)',
          fontWeight: '600',
        }}>
          {reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {reviews.map(review => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </div>
    </div>
  )
}
