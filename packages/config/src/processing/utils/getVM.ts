import type { Badge } from '../../types'

export function getVM(badges: Badge[] | undefined) {
  const badge = badges?.find((b) => b.type === 'VM')
  if (!badge) {
    return undefined
  }
  return badge.filterName
}
