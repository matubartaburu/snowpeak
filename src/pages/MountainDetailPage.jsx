import { useEffect } from 'react'
import { useMountainContext } from '../context/MountainContext.jsx'
import { useReviewContext } from '../context/ReviewContext.jsx'
import { MountainHero } from '../components/mountain/MountainHero.jsx'
import { MountainStats } from '../components/mountain/MountainStats.jsx'
import { WeatherPanel } from '../components/mountain/WeatherPanel.jsx'
import { ReviewSummary } from '../components/review/ReviewSummary.jsx'
import { ReviewForm } from '../components/review/ReviewForm.jsx'
import { ReviewList } from '../components/review/ReviewList.jsx'
import { MountainChat } from '../components/chat/MountainChat.jsx'

export function MountainDetailPage({ mountainId }) {
  const { getMountainById } = useMountainContext()
  const { getReviews, fetchReviews } = useReviewContext()

  const mountain = getMountainById(mountainId)

  useEffect(() => {
    if (mountainId) fetchReviews(mountainId)
  }, [mountainId])

  if (!mountain) {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: 'var(--space-16) var(--space-6)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '4rem', marginBottom: 'var(--space-6)' }}>🏔️</div>
        <h2 style={{
          fontSize: 'var(--font-size-3xl)',
          fontWeight: '700',
          color: 'var(--color-accent-snow)',
          marginBottom: 'var(--space-4)',
        }}>
          Montaña no encontrada
        </h2>
        <p style={{
          color: 'var(--color-accent-snow-dim)',
          marginBottom: 'var(--space-8)',
          fontSize: 'var(--font-size-base)',
        }}>
          No hemos podido encontrar la estación que buscas. Puede que el enlace sea incorrecto.
        </p>
        <a
          href="#/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            background: 'var(--color-accent-primary)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-3) var(--space-6)',
            color: '#fff',
            fontWeight: '600',
            textDecoration: 'none',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          ← Volver al inicio
        </a>
      </div>
    )
  }

  const reviews = getReviews(mountainId)

  return (
    <div>
      {/* Hero */}
      <MountainHero mountain={mountain} />

      {/* Main content */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: 'var(--space-10) var(--space-6)',
      }}>
        {/* Two column layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)',
          gap: 'var(--space-10)',
          alignItems: 'start',
        }}>
          {/* Left column: stats + description + tags */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            {/* Panel meteorológico completo — API real */}
            <WeatherPanel mountain={mountain} />

            {/* Stats */}
            <MountainStats mountain={mountain} />

            {/* Description */}
            <div style={{
              background: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-6)',
            }}>
              <h3 style={{
                fontSize: 'var(--font-size-lg)',
                fontWeight: '700',
                color: 'var(--color-accent-snow)',
                marginBottom: 'var(--space-4)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
              }}>
                📖 Sobre {mountain.name}
              </h3>
              <p style={{
                color: 'var(--color-accent-snow-dim)',
                lineHeight: '1.8',
                fontSize: 'var(--font-size-sm)',
              }}>
                {mountain.description}
              </p>
            </div>

            {/* Tags */}
            <div style={{
              background: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-5)',
            }}>
              <h3 style={{
                fontSize: 'var(--font-size-base)',
                fontWeight: '700',
                color: 'var(--color-accent-snow)',
                marginBottom: 'var(--space-4)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
              }}>
                🏷️ Características
              </h3>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                {mountain.tags.map(tag => (
                  <span key={tag} style={{
                    background: 'var(--color-accent-primary-muted)',
                    border: '1px solid rgba(74, 158, 255, 0.25)',
                    borderRadius: 'var(--radius-full)',
                    padding: 'var(--space-2) var(--space-4)',
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-accent-primary)',
                    fontWeight: '500',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: reviews */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Review summary */}
            <ReviewSummary aggregateRating={mountain.aggregateRating} reviews={reviews} />

            {/* Review form */}
            <ReviewForm mountainId={mountainId} />

            {/* Review list */}
            <ReviewList reviews={reviews} />

            {/* Chat en tiempo real */}
            <MountainChat mountainId={mountainId} mountainName={mountain.name} />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
