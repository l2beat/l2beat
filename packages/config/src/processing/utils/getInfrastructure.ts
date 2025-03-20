import type { Badge } from '../../types'

export function getInfrastructure(badges: Badge[] | undefined) {
  const badge = badges?.find((b) => b.type === 'Infra')
  if (!badge) {
    return undefined
  }
  return badge.filterName
}
