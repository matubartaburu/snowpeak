import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useProfile } from '../hooks/useProfile.js'

const LEVELS = [
  { value: 'principiante', label: '🟢 Principiante' },
  { value: 'intermedio',   label: '🔵 Intermedio' },
  { value: 'avanzado',     label: '⬛ Avanzado' },
  { value: 'experto',      label: '🔴 Experto' },
]

const MOUNTAINS = [
  'Chamonix', 'Whistler Blackcomb', 'Zermatt', 'Niseko United',
  'Verbier', 'Aspen Snowmass', "Val d'Isère", 'Hakuba Valley',
  'Las Leñas', 'Valle Nevado', 'Vail',
]

function Field({ label, error, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <label style={{
        fontSize: 'var(--font-size-xs)',
        fontWeight: '600',
        color: 'var(--color-accent-snow-dim)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        {label}
      </label>
      {children}
      {error && (
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-error)' }}>{error}</span>
      )}
    </div>
  )
}

const inputStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  padding: 'var(--space-3) var(--space-4)',
  color: 'var(--color-accent-snow)',
  fontSize: 'var(--font-size-sm)',
  width: '100%',
  outline: 'none',
  fontFamily: 'inherit',
}

export function ProfilePage() {
  const { user, loginWithGoogle } = useAuth()
  const { profile, loading, updateProfile } = useProfile(user?.id)

  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)

  // Inicializar form cuando carga el perfil
  if (profile && !form) {
    setForm({
      username: profile.username || '',
      bio: profile.bio || '',
      location: profile.location || '',
      skiing_level: profile.skiing_level || '',
      years_skiing: profile.years_skiing || '',
      favorite_mountain: profile.favorite_mountain || '',
    })
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      await updateProfile({
        username: form.username || null,
        bio: form.bio || null,
        location: form.location || null,
        skiing_level: form.skiing_level || null,
        years_skiing: form.years_skiing ? parseInt(form.years_skiing) : null,
        favorite_mountain: form.favorite_mountain || null,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('No se pudo guardar. Intentá de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  // No logueado
  if (!user) {
    return (
      <div style={{
        maxWidth: '480px',
        margin: '0 auto',
        padding: 'var(--space-16) var(--space-6)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '4rem', marginBottom: 'var(--space-6)' }}>👤</div>
        <h2 style={{
          fontSize: 'var(--font-size-2xl)',
          fontWeight: '800',
          color: 'var(--color-accent-snow)',
          marginBottom: 'var(--space-4)',
        }}>
          Tu perfil en SnowPeak
        </h2>
        <p style={{
          color: 'var(--color-accent-snow-dim)',
          marginBottom: 'var(--space-8)',
          lineHeight: 1.6,
        }}>
          Iniciá sesión para crear tu perfil, guardar tus montañas favoritas y dejar reseñas.
        </p>
        <button
          onClick={loginWithGoogle}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            padding: '12px 24px',
            cursor: 'pointer',
            fontSize: 'var(--font-size-md)',
            fontWeight: '600',
            color: '#1a1a2e',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Entrar con Google
        </button>
      </div>
    )
  }

  if (loading || !form) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-16)', color: 'var(--color-accent-snow-dim)' }}>
        Cargando perfil...
      </div>
    )
  }

  const avatar = user.user_metadata?.avatar_url
  const displayName = user.user_metadata?.full_name || user.email

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: 'var(--space-10) var(--space-6)' }}>

      {/* Header */}
      <div style={{
        background: 'var(--color-bg-elevated)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-8)',
        marginBottom: 'var(--space-6)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-6)',
      }}>
        {avatar ? (
          <img src={avatar} alt={displayName} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-accent-primary)' }} />
        ) : (
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'var(--color-accent-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: '800', color: '#fff',
          }}>
            {displayName[0].toUpperCase()}
          </div>
        )}
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '800', color: 'var(--color-accent-snow)', marginBottom: '4px' }}>
            {displayName}
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-accent-snow-dim)' }}>
            {user.email}
          </p>
          {profile.skiing_level && (
            <span style={{
              display: 'inline-block',
              marginTop: 'var(--space-2)',
              background: 'var(--color-accent-primary-muted)',
              border: '1px solid rgba(74,158,255,0.3)',
              borderRadius: 'var(--radius-full)',
              padding: '2px 10px',
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-accent-primary)',
              fontWeight: '600',
            }}>
              {LEVELS.find(l => l.value === profile.skiing_level)?.label}
            </span>
          )}
        </div>
      </div>

      {/* Formulario */}
      <div style={{
        background: 'var(--color-bg-elevated)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-8)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
      }}>
        <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: '700', color: 'var(--color-accent-snow)', marginBottom: 0 }}>
          ✏️ Editar perfil
        </h2>

        <Field label="Nombre de usuario">
          <input
            style={inputStyle}
            placeholder="@tu_nombre"
            value={form.username}
            onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
            onFocus={e => e.target.style.borderColor = 'var(--color-border-focus)'}
            onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
          />
        </Field>

        <Field label="Bio">
          <textarea
            style={{ ...inputStyle, resize: 'vertical', minHeight: '80px', lineHeight: 1.6 }}
            placeholder="Contá algo sobre vos y tu relación con la nieve..."
            value={form.bio}
            onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
            onFocus={e => e.target.style.borderColor = 'var(--color-border-focus)'}
            onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
          />
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <Field label="Ubicación">
            <input
              style={inputStyle}
              placeholder="Buenos Aires, Argentina"
              value={form.location}
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              onFocus={e => e.target.style.borderColor = 'var(--color-border-focus)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
            />
          </Field>

          <Field label="Años esquiando">
            <input
              style={inputStyle}
              type="number"
              min="0"
              max="80"
              placeholder="5"
              value={form.years_skiing}
              onChange={e => setForm(f => ({ ...f, years_skiing: e.target.value }))}
              onFocus={e => e.target.style.borderColor = 'var(--color-border-focus)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
            />
          </Field>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <Field label="Nivel">
            <select
              style={{ ...inputStyle, cursor: 'pointer' }}
              value={form.skiing_level}
              onChange={e => setForm(f => ({ ...f, skiing_level: e.target.value }))}
            >
              <option value="">Seleccioná tu nivel</option>
              {LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </Field>

          <Field label="Montaña favorita">
            <select
              style={{ ...inputStyle, cursor: 'pointer' }}
              value={form.favorite_mountain}
              onChange={e => setForm(f => ({ ...f, favorite_mountain: e.target.value }))}
            >
              <option value="">Seleccioná una</option>
              {MOUNTAINS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </Field>
        </div>

        {error && (
          <div style={{
            background: 'rgba(232,93,117,0.1)',
            border: '1px solid rgba(232,93,117,0.3)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-3) var(--space-4)',
            color: 'var(--color-error)',
            fontSize: 'var(--font-size-sm)',
          }}>
            {error}
          </div>
        )}

        {saved && (
          <div style={{
            background: 'rgba(76,175,130,0.1)',
            border: '1px solid rgba(76,175,130,0.3)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-3) var(--space-4)',
            color: 'var(--color-success)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: '600',
          }}>
            ✓ Perfil guardado correctamente
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            background: saving ? 'var(--color-surface)' : 'var(--color-accent-primary)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-4)',
            color: '#fff',
            fontSize: 'var(--font-size-md)',
            fontWeight: '700',
            cursor: saving ? 'not-allowed' : 'pointer',
            transition: 'all var(--transition-fast)',
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? 'Guardando...' : 'Guardar perfil'}
        </button>
      </div>
    </div>
  )
}
