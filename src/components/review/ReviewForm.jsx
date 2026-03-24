import { useState } from 'react'
import { useReviewContext } from '../../context/ReviewContext.jsx'
import { validateReview } from '../../models/review.js'
import { StarRating } from '../ui/StarRating.jsx'

const MONTHS = [
  { value: 1, label: 'Enero' }, { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' }, { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' }, { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' }, { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' }, { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' }, { value: 12, label: 'Diciembre' },
]

const initialForm = {
  authorName: '',
  title: '',
  body: '',
  ratings: { overall: 0, snowQuality: 0 },
  visitedMonth: '',
}

export function ReviewForm({ mountainId }) {
  const { addReview } = useReviewContext()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const setField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  const setRating = (key, value) => {
    setForm(prev => ({ ...prev, ratings: { ...prev.ratings, [key]: value } }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { valid, errors: validationErrors } = validateReview(form)
    if (!valid) {
      setErrors(validationErrors)
      return
    }
    try {
      await addReview(mountainId, {
        authorName: form.authorName,
        title: form.title,
        body: form.body,
        ratings: form.ratings,
        visitedMonth: form.visitedMonth ? parseInt(form.visitedMonth) : null,
      })
      setSubmitted(true)
      setForm(initialForm)
      setErrors({})
      setTimeout(() => {
        setSubmitted(false)
        setIsOpen(false)
      }, 3000)
    } catch {
      setErrors({ submit: 'Error al guardar la reseña. Intentá de nuevo.' })
    }
  }

  const inputStyle = (hasError) => ({
    width: '100%',
    background: 'var(--color-surface)',
    border: `1px solid ${hasError ? 'var(--color-error)' : 'var(--color-border)'}`,
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-3) var(--space-4)',
    color: 'var(--color-accent-snow)',
    fontSize: 'var(--font-size-sm)',
    outline: 'none',
    transition: 'border-color var(--transition-fast)',
    boxSizing: 'border-box',
  })

  const labelStyle = {
    display: 'block',
    fontSize: 'var(--font-size-sm)',
    fontWeight: '600',
    color: 'var(--color-accent-snow)',
    marginBottom: 'var(--space-2)',
  }

  const errorStyle = {
    fontSize: 'var(--font-size-xs)',
    color: 'var(--color-error)',
    marginTop: 'var(--space-1)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  }

  if (submitted) {
    return (
      <div style={{
        background: 'rgba(76, 175, 130, 0.1)',
        border: '1px solid rgba(76, 175, 130, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-8)',
        textAlign: 'center',
        marginBottom: 'var(--space-6)',
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>✅</div>
        <h4 style={{
          fontSize: 'var(--font-size-xl)',
          fontWeight: '700',
          color: 'var(--color-success)',
          marginBottom: 'var(--space-2)',
        }}>
          ¡Reseña publicada!
        </h4>
        <p style={{ color: 'var(--color-accent-snow-dim)', fontSize: 'var(--font-size-sm)' }}>
          Gracias por compartir tu experiencia con la comunidad SnowPeak.
        </p>
      </div>
    )
  }

  if (!isOpen) {
    return (
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, var(--color-accent-primary) 0%, #3a7fd4 100%)',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4) var(--space-6)',
            color: '#fff',
            fontSize: 'var(--font-size-base)',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-2)',
            boxShadow: '0 4px 20px rgba(74, 158, 255, 0.3)',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(74, 158, 255, 0.5)'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(74, 158, 255, 0.3)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          ✍️ Añade tu reseña
        </button>
      </div>
    )
  }

  return (
    <div style={{
      background: 'var(--color-bg-elevated)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-6)',
      marginBottom: 'var(--space-6)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 'var(--space-6)',
      }}>
        <h3 style={{
          fontSize: 'var(--font-size-xl)',
          fontWeight: '700',
          color: 'var(--color-accent-snow)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
        }}>
          ✍️ Añade tu reseña
        </h3>
        <button
          onClick={() => { setIsOpen(false); setErrors({}); setForm(initialForm) }}
          style={{
            background: 'transparent',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-1) var(--space-3)',
            color: 'var(--color-accent-snow-dim)',
            cursor: 'pointer',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          ✕ Cerrar
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        {/* Name */}
        <div>
          <label style={labelStyle}>Nombre *</label>
          <input
            type="text"
            placeholder="Tu nombre"
            value={form.authorName}
            onChange={e => setField('authorName', e.target.value)}
            style={inputStyle(!!errors.authorName)}
            onFocus={e => e.target.style.borderColor = 'var(--color-border-focus)'}
            onBlur={e => e.target.style.borderColor = errors.authorName ? 'var(--color-error)' : 'var(--color-border)'}
          />
          {errors.authorName && <div style={errorStyle}>⚠ {errors.authorName}</div>}
        </div>

        {/* Title */}
        <div>
          <label style={labelStyle}>Título de la reseña *</label>
          <input
            type="text"
            placeholder="Ej: Una experiencia increíble"
            value={form.title}
            onChange={e => setField('title', e.target.value)}
            style={inputStyle(!!errors.title)}
            onFocus={e => e.target.style.borderColor = 'var(--color-border-focus)'}
            onBlur={e => e.target.style.borderColor = errors.title ? 'var(--color-error)' : 'var(--color-border)'}
          />
          {errors.title && <div style={errorStyle}>⚠ {errors.title}</div>}
        </div>

        {/* Body */}
        <div>
          <label style={labelStyle}>Tu experiencia *</label>
          <textarea
            placeholder="Cuéntanos cómo fue tu visita, la calidad de la nieve, las pistas, el ambiente..."
            value={form.body}
            onChange={e => setField('body', e.target.value)}
            rows={5}
            style={{
              ...inputStyle(!!errors.body),
              resize: 'vertical',
              lineHeight: '1.6',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--color-border-focus)'}
            onBlur={e => e.target.style.borderColor = errors.body ? 'var(--color-error)' : 'var(--color-border)'}
          />
          {errors.body && <div style={errorStyle}>⚠ {errors.body}</div>}
        </div>

        {/* Ratings row */}
        <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
          {/* Overall rating */}
          <div>
            <label style={labelStyle}>Valoración general *</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <StarRating
                value={form.ratings.overall}
                onChange={v => setRating('overall', v)}
                size="lg"
              />
              {form.ratings.overall > 0 && (
                <span style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-accent-snow-dim)',
                }}>
                  {['', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'][form.ratings.overall]}
                </span>
              )}
            </div>
            {errors.overall && <div style={errorStyle}>⚠ {errors.overall}</div>}
          </div>

          {/* Snow quality */}
          <div>
            <label style={labelStyle}>Calidad de nieve *</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <StarRating
                value={form.ratings.snowQuality}
                onChange={v => setRating('snowQuality', v)}
                size="lg"
              />
              {form.ratings.snowQuality > 0 && (
                <span style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-snow-powder)',
                }}>
                  {'❄'.repeat(form.ratings.snowQuality)}
                </span>
              )}
            </div>
            {errors.snowQuality && <div style={errorStyle}>⚠ {errors.snowQuality}</div>}
          </div>
        </div>

        {/* Visited month (optional) */}
        <div>
          <label style={labelStyle}>Mes de visita <span style={{ color: 'var(--color-accent-snow-dim)', fontWeight: 400 }}>(opcional)</span></label>
          <select
            value={form.visitedMonth}
            onChange={e => setField('visitedMonth', e.target.value)}
            style={{
              ...inputStyle(false),
              cursor: 'pointer',
            }}
          >
            <option value="">Selecciona un mes</option>
            {MONTHS.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          style={{
            background: 'linear-gradient(135deg, var(--color-accent-primary) 0%, #3a7fd4 100%)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-4) var(--space-6)',
            color: '#fff',
            fontSize: 'var(--font-size-base)',
            fontWeight: '700',
            cursor: 'pointer',
            width: '100%',
            boxShadow: '0 4px 16px rgba(74, 158, 255, 0.25)',
            transition: 'all var(--transition-fast)',
            letterSpacing: '0.02em',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(74, 158, 255, 0.4)'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(74, 158, 255, 0.25)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          📢 Publicar Reseña
        </button>
      </form>
    </div>
  )
}
