import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'

export function useChat(mountainId) {
  const [messages, setMessages] = useState([])
  const [profiles, setProfiles] = useState({})
  const [loading, setLoading] = useState(true)
  const channelRef = useRef(null)

  const fetchProfile = useCallback(async (userId) => {
    if (profiles[userId]) return
    const { data } = await supabase
      .from('profiles')
      .select('id, username')
      .eq('id', userId)
      .single()
    if (data) setProfiles(prev => ({ ...prev, [userId]: data }))
  }, [profiles])

  useEffect(() => {
    if (!mountainId) return

    // Cargar mensajes existentes
    supabase
      .from('messages')
      .select('*')
      .eq('mountain_id', mountainId)
      .order('created_at', { ascending: true })
      .limit(100)
      .then(({ data }) => {
        setMessages(data || [])
        setLoading(false)
        // Cargar perfiles de los usuarios
        const ids = [...new Set((data || []).map(m => m.user_id))]
        ids.forEach(id => {
          supabase.from('profiles').select('id, username').eq('id', id).single()
            .then(({ data: p }) => {
              if (p) setProfiles(prev => ({ ...prev, [p.id]: p }))
            })
        })
      })

    // Suscripción realtime
    channelRef.current = supabase
      .channel(`chat-${mountainId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `mountain_id=eq.${mountainId}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new])
        fetchProfile(payload.new.user_id)
      })
      .subscribe()

    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current)
    }
  }, [mountainId])

  const sendMessage = useCallback(async (text, userId) => {
    if (!text.trim() || !userId) return
    const { error } = await supabase
      .from('messages')
      .insert({ mountain_id: mountainId, user_id: userId, text: text.trim() })
    if (error) throw new Error('No se pudo enviar el mensaje')
  }, [mountainId])

  return { messages, profiles, loading, sendMessage }
}
