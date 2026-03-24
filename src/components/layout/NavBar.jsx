import { useState, useEffect } from 'react'

export function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    background: scrolled
      ? 'rgba(10, 15, 30, 0.95)'
      : 'rgba(10, 15, 30, 0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: scrolled
      ? '1px solid var(--color-border)'
      : '1px solid rgba(42, 63, 92, 0.4)',
    transition: 'all var(--transition-normal)',
  }

  const innerStyle = {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 var(--space-6)',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
    cursor: 'pointer',
    textDecoration: 'none',
  }

  const logoTextStyle = {
    fontSize: 'var(--font-size-xl)',
    fontWeight: '800',
    background: 'linear-gradient(135deg, var(--color-accent-snow) 0%, var(--color-accent-primary) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-0.02em',
  }

  const navLinksStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-8)',
    listStyle: 'none',
  }

  const linkStyle = {
    color: 'var(--color-accent-snow-dim)',
    textDecoration: 'none',
    fontSize: 'var(--font-size-sm)',
    fontWeight: '500',
    transition: 'color var(--transition-fast)',
    cursor: 'pointer',
  }

  const snowflakes = ['❄', '❅', '❆', '✦', '❄', '❅']

  return (
    <nav style={navStyle}>
      <div style={innerStyle}>
        {/* Logo */}
        <a href="#/" style={logoStyle}>
          <span style={{ fontSize: '1.5rem' }}>⛷️</span>
          <span style={logoTextStyle}>SnowPeak</span>
        </a>

        {/* Decorative snowflakes */}
        <div style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 'var(--space-4)',
          opacity: 0.15,
          pointerEvents: 'none',
        }}>
          {snowflakes.map((flake, i) => (
            <span key={i} style={{
              color: 'var(--color-accent-primary)',
              fontSize: i % 2 === 0 ? '0.6rem' : '0.4rem',
              animation: `float ${2 + i * 0.3}s ease-in-out infinite alternate`,
            }}>
              {flake}
            </span>
          ))}
        </div>

        {/* Nav links */}
        <ul style={navLinksStyle}>
          <li>
            <a
              href="#/"
              style={linkStyle}
              onMouseEnter={e => e.target.style.color = 'var(--color-accent-snow)'}
              onMouseLeave={e => e.target.style.color = 'var(--color-accent-snow-dim)'}
            >
              Inicio
            </a>
          </li>
          <li>
            <a
              href="#/"
              onClick={() => setTimeout(() => {
                document.getElementById('mountains-grid')?.scrollIntoView({ behavior: 'smooth' })
              }, 50)}
              style={linkStyle}
              onMouseEnter={e => e.target.style.color = 'var(--color-accent-snow)'}
              onMouseLeave={e => e.target.style.color = 'var(--color-accent-snow-dim)'}
            >
              Montañas
            </a>
          </li>
          <li>
            <a
              href="#/mapa"
              style={linkStyle}
              onMouseEnter={e => e.target.style.color = 'var(--color-accent-snow)'}
              onMouseLeave={e => e.target.style.color = 'var(--color-accent-snow-dim)'}
            >
              🗺️ Mapa
            </a>
          </li>
          <li>
            <div style={{
              background: 'var(--color-accent-primary-muted)',
              border: '1px solid var(--color-accent-primary)',
              borderRadius: 'var(--radius-full)',
              padding: 'var(--space-2) var(--space-4)',
              color: 'var(--color-accent-primary)',
              fontSize: 'var(--font-size-xs)',
              fontWeight: '600',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              ❄ Temporada 2026
            </div>
          </li>
        </ul>
      </div>

      <style>{`
        @keyframes float {
          from { transform: translateY(0px); }
          to { transform: translateY(-4px); }
        }
      `}</style>
    </nav>
  )
}
