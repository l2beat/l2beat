import type { Badge } from '../../types'

export function getInfrastructure(badges: Badge[] | undefined) {
  const infraBadges = badges?.filter((b) => b.type === 'Infra')
  if (!infraBadges || infraBadges.length === 0) {
    return undefined
  }
  if (infraBadges.length > 1) {
    throw new Error('Multiple infrastructure badges found')
  }
  return infraBadges[0].filterValue
}
