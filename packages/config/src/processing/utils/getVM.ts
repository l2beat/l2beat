import type { Badge } from '../../types'

export function getVM(badges: Badge[] | undefined) {
  const vmBadges = badges?.filter((b) => b.type === 'VM')
  if (!vmBadges || vmBadges.length === 0) {
    return undefined
  }
  return vmBadges.map((b) => b.filterValue)
}
