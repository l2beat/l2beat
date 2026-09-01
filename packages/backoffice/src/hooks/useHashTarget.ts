import { useLocation } from 'react-router-dom'

export function useHashTarget(): string | undefined {
  const { hash } = useLocation()
  if (!hash || hash === '#') {
    return undefined
  }
  const raw = hash.slice(1)
  try {
    return decodeURIComponent(raw)
  } catch {
    return raw
  }
}
