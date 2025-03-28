import type { Badge } from '../../types'

export function getRaas(badges: Badge[] | undefined) {
  const raasBadge = badges?.find((b) => b.type === 'RaaS')
  if (raasBadge?.action?.type !== 'scalingFilter') return undefined
  return raasBadge?.action?.value
}
