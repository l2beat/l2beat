import type { Badge } from '../../types'

export function getInfrastructure(badges: Badge[] | undefined) {
  const infraBadge = badges?.find((b) => b.type === 'Infra')
  return infraBadge?.filterValue
}
