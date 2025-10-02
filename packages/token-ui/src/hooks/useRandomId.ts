import { useCallback, useState } from 'react'

function generateId(length = 12): string {
  // Generates a random string, removes "0.", and pads until desired length
  return Array.from({ length: Math.ceil(length / 11) }) // each chunk ~11 chars
    .map(() => Math.random().toString(36).slice(2))
    .join('')
    .slice(0, length)
}
export function useRandomId(initialLength = 12) {
  const [id, setId] = useState(() => generateId(initialLength))

  const refresh = useCallback(() => {
    setId(generateId(initialLength))
  }, [initialLength])

  return { id, refresh }
}
