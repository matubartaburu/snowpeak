import { useState, useEffect } from 'react'

function parseHash(hash) {
  const path = hash.replace('#', '') || '/'
  const parts = path.split('/').filter(Boolean)
  if (parts.length === 0) return { route: 'home', params: {} }
  if (parts[0] === 'mountain' && parts[1]) return { route: 'mountain', params: { id: decodeURIComponent(parts[1]) } }
  return { route: 'home', params: {} }
}

export function useHashRouter() {
  const [location, setLocation] = useState(() => parseHash(window.location.hash))
  useEffect(() => {
    const handler = () => setLocation(parseHash(window.location.hash))
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])
  const navigate = (path) => { window.location.hash = path }
  return { ...location, navigate }
}
