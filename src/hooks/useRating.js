import { useState } from 'react'

export function useRating(initialValue = 0) {
  const [value, setValue] = useState(initialValue)
  const [hovered, setHovered] = useState(0)
  return {
    value,
    hovered,
    displayed: hovered || value,
    setValue,
    setHovered,
  }
}
