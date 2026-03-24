import { monthName } from '../../utils/date.js'

function StatCard({ icon, label, value, valueColor }) {
  return (
    <div style={{
      background: 'var(--color-bg-elevated)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-4)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
    }}>
      <div style={{
        fontSize: '1.5rem',
        lineHeight: 1,
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-accent-snow-dim)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontWeight: '500',
          marginBottom: '2px',
        }}>
          {label}
        </div>
        <div style={{
          fontSize: 'var(--font-size-lg)',
          fontWeight: '700',
          color: valueColor || 'var(--color-accent-snow)',
        }}>
          {value}
        </div>
      </div>
    </div>
  )
}

function DifficultyBar({ label, percentage, color, bg, border }) {
  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--space-2)',
      }}>
        <span style={{
          fontSize: 'var(--font-size-sm)',
          fontWeight: '600',
          color,
        }}>
          {label}
        </span>
        <span style={{
          fontSize: 'var(--font-size-sm)',
          fontWeight: '700',
          color,
        }}>
          {percentage}%
        </span>
      </div>
      <div style={{
        height: '8px',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-full)',
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
      }}>
        <div style={{
          height: '100%',
          width: `${percentage}%`,
          background: color,
          borderRadius: 'var(--radius-full)',
          transition: 'width 0.8s ease',
          boxShadow: `0 0 8px ${color}40`,
        }} />
      </div>
    </div>
  )
}

export function MountainStats({ mountain }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Stats grid */}
      <div>
        <h3 style={{
          fontSize: 'var(--font-size-lg)',
          fontWeight: '700',
          color: 'var(--color-accent-snow)',
          marginBottom: 'var(--space-4)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
        }}>
          📊 Estadísticas
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 'var(--space-3)',
        }}>
          <StatCard
            icon="▲"
            label="Cima"
            value={`${mountain.elevationTopM.toLocaleString()} m`}
            valueColor="var(--color-accent-primary)"
          />
          <StatCard
            icon="▼"
            label="Base"
            value={`${mountain.elevationBaseM.toLocaleString()} m`}
            valueColor="var(--color-accent-snow-dim)"
          />
          <StatCard
            icon="⛷️"
            label="Total Pistas"
            value={`${mountain.totalRunsKm} km`}
            valueColor="var(--color-accent-snow)"
          />
          <StatCard
            icon="🚡"
            label="Remontes"
            value={mountain.lifts}
            valueColor="var(--color-accent-primary)"
          />
          <StatCard
            icon="❄"
            label="Profundidad Nieve"
            value={`${mountain.snowDepthCm} cm`}
            valueColor="var(--color-snow-powder)"
          />
          <StatCard
            icon="📅"
            label="Temporada"
            value={`${monthName(mountain.season.openMonth).slice(0,3)} – ${monthName(mountain.season.closeMonth).slice(0,3)}`}
            valueColor="var(--color-success)"
          />
        </div>
      </div>

      {/* Difficulty breakdown */}
      <div style={{
        background: 'var(--color-bg-elevated)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-5)',
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
          🎿 Dificultad de Pistas
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <DifficultyBar
            label="🟢 Verde (Principiante)"
            percentage={mountain.difficulty.beginner}
            color="var(--color-difficulty-beginner)"
          />
          <DifficultyBar
            label="🔵 Azul (Intermedio)"
            percentage={mountain.difficulty.intermediate}
            color="var(--color-difficulty-intermediate)"
          />
          <DifficultyBar
            label="⬛ Negro (Experto)"
            percentage={mountain.difficulty.expert}
            color="var(--color-difficulty-expert)"
          />
        </div>
      </div>
    </div>
  )
}
