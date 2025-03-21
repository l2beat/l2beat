import type { Badge } from '../../types'

export function getVM(badges: Badge[] | undefined) {
  const vmBadges = badges?.filter((b) => b.type === 'VM')
  if (!vmBadges || vmBadges.length === 0) {
    return []
  }
  return vmBadges.map((b) => b.action.scalingFilter[1])
}
