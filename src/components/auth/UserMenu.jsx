import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'

export function UserMenu() {
  const { user, loginWithGoogle, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!user) {
    return (
      <button
        onClick={loginWithGoogle}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#fff',
          border: 'none',
          borderRadius: 'var(--radius-full)',
          padding: '8px 16px',
          cursor: 'pointer',
          fontSize: 'var(--font-size-sm)',
          fontWeight: '600',
          color: '#1a1a2e',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          transition: 'all var(--transition-fast)',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Entrar con Google
      </button>
    )
  }

  const avatar = user.user_metadata?.avatar_url
  const name = user.user_metadata?.full_name || user.email

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-full)',
          padding: '4px 12px 4px 4px',
          cursor: 'pointer',
          transition: 'all var(--transition-fast)',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-border-focus)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
      >
        {avatar ? (
          <img src={avatar} alt={name} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
        ) : (
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'var(--color-accent-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.75rem', fontWeight: '700', color: '#fff',
          }}>
            {name[0].toUpperCase()}
          </div>
        )}
        <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: '500', color: 'var(--color-accent-snow)', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {name.split(' ')[0]}
        </span>
        <span style={{ color: 'var(--color-accent-snow-dim)', fontSize: '0.7rem' }}>▼</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: 'calc(100% + 8px)',
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-2)',
          minWidth: '200px',
          boxShadow: 'var(--shadow-card)',
          zIndex: 100,
        }}>
          <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border)', marginBottom: 'var(--space-2)' }}>
            <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: '600', color: 'var(--color-accent-snow)' }}>{name}</div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-accent-snow-dim)' }}>{user.email}</div>
          </div>
          <button
            onClick={() => { logout(); setOpen(false) }}
            style={{
              width: '100%',
              textAlign: 'left',
              background: 'none',
              border: 'none',
              padding: 'var(--space-3) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-error)',
              fontSize: 'var(--font-size-sm)',
              cursor: 'pointer',
              fontWeight: '500',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(232,93,117,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}
