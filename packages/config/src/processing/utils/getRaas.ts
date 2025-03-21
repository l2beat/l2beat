import type { Badge } from '../../types'

export function getRaas(badges: Badge[] | undefined) {
  const raasBadge = badges?.find((b) => b.type === 'RaaS')
  return raasBadge?.filterValue
}
