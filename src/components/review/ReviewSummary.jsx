import { StarRating } from '../ui/StarRating.jsx'
import { SnowQualityMeter } from '../ui/SnowQualityMeter.jsx'
import { formatRating } from '../../logic/ratings.js'

export function ReviewSummary({ aggregateRating, reviews }) {
  const { overall, snowQuality, reviewCount } = aggregateRating

  // Compute distribution
  const distribution = [5, 4, 3, 2, 1].map(star => {
    const count = reviews.filter(r => Math.round(r.ratings.overall) === star).length
    const pct = reviewCount > 0 ? Math.round((count / reviewCount) * 100) : 0
    return { star, count, pct }
  })

  return (
    <div style={{
      background: 'var(--color-bg-elevated)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-6)',
      marginBottom: 'var(--space-6)',
    }}>
      <h3 style={{
        fontSize: 'var(--font-size-lg)',
        fontWeight: '700',
        color: 'var(--color-accent-snow)',
        marginBottom: 'var(--space-5)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
      }}>
        ⭐ Resumen de Valoraciones
      </h3>

      <div style={{
        display: 'flex',
        gap: 'var(--space-6)',
        flexWrap: 'wrap',
        marginBottom: 'var(--space-6)',
      }}>
        {/* Overall rating */}
        <div style={{ textAlign: 'center', minWidth: '120px' }}>
          <div style={{
            fontSize: '4rem',
            fontWeight: '900',
            color: '#f5c842',
            lineHeight: 1,
            marginBottom: 'var(--space-2)',
          }}>
            {formatRating(overall)}
          </div>
          <StarRating value={overall} size="md" />
          <div style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-accent-snow-dim)',
            marginTop: 'var(--space-2)',
          }}>
            {reviewCount} {reviewCount === 1 ? 'reseña' : 'reseñas'}
          </div>
        </div>

        {/* Snow quality */}
        <div style={{ flex: 1, minWidth: '160px' }}>
          <div style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-accent-snow-dim)',
            fontWeight: '500',
            marginBottom: 'var(--space-2)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Calidad de Nieve
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: '800',
            color: 'var(--color-snow-powder)',
            lineHeight: 1,
            marginBottom: 'var(--space-2)',
          }}>
            {formatRating(snowQuality)}
          </div>
          <SnowQualityMeter score={snowQuality} showLabel />
        </div>
      </div>

      {/* Rating distribution */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <div style={{
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-accent-snow-dim)',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: 'var(--space-1)',
        }}>
          Distribución de puntuaciones
        </div>
        {distribution.map(({ star, count, pct }) => (
          <div key={star} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
          }}>
            <span style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-accent-snow-dim)',
              width: '16px',
              textAlign: 'right',
              fontWeight: '600',
              flexShrink: 0,
            }}>
              {star}
            </span>
            <span style={{ color: '#f5c842', fontSize: '0.75rem', flexShrink: 0 }}>★</span>
            <div style={{
              flex: 1,
              height: '6px',
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${pct}%`,
                background: pct > 0
                  ? 'linear-gradient(90deg, var(--color-star-filled), #f0a500)'
                  : 'transparent',
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.8s ease',
              }} />
            </div>
            <span style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-accent-snow-dim)',
              width: '28px',
              textAlign: 'right',
              flexShrink: 0,
            }}>
              {pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
