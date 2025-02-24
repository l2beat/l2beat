import type { Badge } from '../../../types'

export function getRaas(badges: Badge[] | undefined) {
  const badge = badges?.find((b) => b.type === 'RaaS')
  if (!badge) {
    return undefined
  }
  return badge.name
}
