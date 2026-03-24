import { MountainCard } from './MountainCard.jsx'

export function MountainGrid({ mountains }) {
  if (!mountains || mountains.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: 'var(--space-16) var(--space-8)',
        color: 'var(--color-accent-snow-dim)',
      }}>
        <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)', opacity: 0.5 }}>🏔️</div>
        <h3 style={{
          fontSize: 'var(--font-size-2xl)',
          fontWeight: '700',
          color: 'var(--color-accent-snow)',
          marginBottom: 'var(--space-3)',
        }}>
          No se encontraron montañas
        </h3>
        <p style={{ fontSize: 'var(--font-size-base)', maxWidth: '400px', margin: '0 auto' }}>
          Intenta ajustar los filtros para encontrar la montaña perfecta para ti.
        </p>
      </div>
    )
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: 'var(--space-6)',
    }}>
      {mountains.map(mountain => (
        <MountainCard key={mountain.id} mountain={mountain} />
      ))}
    </div>
  )
}
