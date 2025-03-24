import type { Badge } from '../../types'

export function getInfrastructure(badges: Badge[] | undefined) {
  const infraBadge = badges?.find((b) => b.type === 'Infra')
  if (infraBadge?.action?.type !== 'scalingFilter') return undefined
  return infraBadge?.action?.value
}
