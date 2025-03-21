import type { Badge } from '../../types'

export function getRaas(badges: Badge[] | undefined) {
  const raasBadges = badges?.filter((b) => b.type === 'RaaS')
  if (!raasBadges || raasBadges.length === 0) {
    return undefined
  }
  if (raasBadges.length > 1) {
    throw new Error('Multiple RaaS badges found')
  }
  return raasBadges[0].filterValue
}
