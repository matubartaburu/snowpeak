import { NavBar } from './NavBar.jsx'

export function AppShell({ children }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'var(--color-bg-primary)',
    }}>
      <NavBar />

      <main style={{
        flex: 1,
        paddingTop: '64px', // navbar height
      }}>
        {children}
      </main>

      <footer style={{
        background: 'var(--color-bg-secondary)',
        borderTop: '1px solid var(--color-border)',
        padding: 'var(--space-8) var(--space-6)',
        textAlign: 'center',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-2)',
            marginBottom: 'var(--space-2)',
          }}>
            <span style={{ fontSize: '1.25rem' }}>⛷️</span>
            <span style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: '700',
              background: 'linear-gradient(135deg, var(--color-accent-snow) 0%, var(--color-accent-primary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              SnowPeak
            </span>
          </div>
          <p style={{
            color: 'var(--color-accent-snow-dim)',
            fontSize: 'var(--font-size-sm)',
          }}>
            SnowPeak © 2026 — Tu comunidad de ski y snowboard
          </p>
          <div style={{
            marginTop: 'var(--space-4)',
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--space-4)',
          }}>
            {['❄', '⛷️', '🏔️', '🎿', '❄'].map((icon, i) => (
              <span key={i} style={{
                opacity: 0.3,
                fontSize: '1rem',
              }}>
                {icon}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
