import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'

export function useProfile(userId) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) { setLoading(false); return }

    supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
      .then(({ data, error }) => {
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error)
        }
        setProfile(data ?? { id: userId })
        setLoading(false)
      })
      .catch(() => {
        setProfile({ id: userId })
        setLoading(false)
      })
  }, [userId])

  const updateProfile = useCallback(async (fields) => {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: userId, ...fields, updated_at: new Date().toISOString() })
      .select()
      .single()

    if (error) throw new Error('No se pudo guardar el perfil')
    setProfile(data)
    return data
  }, [userId])

  return { profile, loading, updateProfile }
}
