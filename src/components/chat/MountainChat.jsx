import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useChat } from '../../hooks/useChat.js'

function timeAgo(isoString) {
  const diff = Date.now() - new Date(isoString).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'ahora'
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  return `${Math.floor(hrs / 24)}d`
}

function Avatar({ user, profile, size = 32 }) {
  const avatar = user?.user_metadata?.avatar_url
  const name = profile?.username || user?.user_metadata?.full_name || user?.email || '?'

  if (avatar) {
    return <img src={avatar} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: 'var(--color-accent-primary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.4 + 'px', fontWeight: '700', color: '#fff',
    }}>
      {name[0].toUpperCase()}
    </div>
  )
}

export function MountainChat({ mountainId, mountainName }) {
  const { user, loginWithGoogle } = useAuth()
  const { messages, profiles, loading, sendMessage } = useChat(mountainId)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!text.trim() || sending) return
    setSending(true)
    try {
      await sendMessage(text, user.id)
      setText('')
    } catch {
      // silenciar error
    } finally {
      setSending(false)
    }
  }

  return (
    <div style={{
      background: 'var(--color-bg-elevated)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: 'var(--space-4) var(--space-5)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
      }}>
        <span style={{ fontSize: '1.2rem' }}>💬</span>
        <div>
          <div style={{ fontSize: 'var(--font-size-md)', fontWeight: '700', color: 'var(--color-accent-snow)' }}>
            Chat de {mountainName}
          </div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-accent-snow-dim)' }}>
            {messages.length} mensajes · En tiempo real
          </div>
        </div>
        <span style={{
          marginLeft: 'auto',
          width: 8, height: 8,
          borderRadius: '50%',
          background: 'var(--color-success)',
          boxShadow: '0 0 6px var(--color-success)',
        }} />
      </div>

      {/* Mensajes */}
      <div style={{
        height: '380px',
        overflowY: 'auto',
        padding: 'var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--color-accent-snow-dim)', padding: 'var(--space-8)', fontSize: 'var(--font-size-sm)' }}>
            Cargando mensajes...
          </div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--color-accent-snow-dim)', padding: 'var(--space-8)' }}>
            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>💬</div>
            <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: '600', color: 'var(--color-accent-snow)', marginBottom: 'var(--space-2)' }}>
              Nadie habló todavía
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)' }}>
              Sé el primero en preguntar por las condiciones
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.user_id === user?.id
            const profile = profiles[msg.user_id]
            const displayName = profile?.username || 'Usuario'

            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: 'var(--space-3)',
                  flexDirection: isMe ? 'row-reverse' : 'row',
                  alignItems: 'flex-end',
                }}
              >
                {!isMe && (
                  <Avatar user={null} profile={profile} size={28} />
                )}
                <div style={{ maxWidth: '75%', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                  {!isMe && (
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-accent-snow-dim)', paddingLeft: 'var(--space-2)' }}>
                      {displayName}
                    </span>
                  )}
                  <div style={{
                    background: isMe ? 'var(--color-accent-primary)' : 'var(--color-surface)',
                    border: `1px solid ${isMe ? 'transparent' : 'var(--color-border)'}`,
                    borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    padding: 'var(--space-3) var(--space-4)',
                    fontSize: 'var(--font-size-sm)',
                    color: isMe ? '#fff' : 'var(--color-accent-snow)',
                    lineHeight: 1.5,
                    wordBreak: 'break-word',
                  }}>
                    {msg.text}
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--color-accent-snow-dim)', paddingLeft: 'var(--space-2)', paddingRight: 'var(--space-2)' }}>
                    {timeAgo(msg.created_at)}
                  </span>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ borderTop: '1px solid var(--color-border)', padding: 'var(--space-4)' }}>
        {user ? (
          <form onSubmit={handleSend} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
            <Avatar user={user} profile={profiles[user.id]} size={32} />
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder={`Preguntá sobre ${mountainName}...`}
              maxLength={500}
              style={{
                flex: 1,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-full)',
                padding: 'var(--space-3) var(--space-4)',
                color: 'var(--color-accent-snow)',
                fontSize: 'var(--font-size-sm)',
                outline: 'none',
                fontFamily: 'inherit',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--color-border-focus)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
            />
            <button
              type="submit"
              disabled={!text.trim() || sending}
              style={{
                background: text.trim() ? 'var(--color-accent-primary)' : 'var(--color-surface)',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                width: 40, height: 40,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: text.trim() ? 'pointer' : 'not-allowed',
                fontSize: '1.1rem',
                transition: 'all var(--transition-fast)',
                flexShrink: 0,
              }}
            >
              {sending ? '...' : '➤'}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: 'var(--space-2)' }}>
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-accent-snow-dim)' }}>
              Para chatear,{' '}
            </span>
            <button
              onClick={loginWithGoogle}
              style={{
                background: 'none', border: 'none',
                color: 'var(--color-accent-primary)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: '600', cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              iniciá sesión con Google
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
