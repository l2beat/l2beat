import { unionBy } from 'lodash'
import { BadgeId, badges } from '../../badges'

export function mergeBadges(
  inherentBadges: BadgeId[],
  definedBadges: BadgeId[],
): BadgeId[] {
  const all = definedBadges.concat(inherentBadges)
  const other = all.filter((b) => badges[b].type === 'Other')
  const rest = all.filter((b) => badges[b].type !== 'Other')
  return unionBy(rest, (b) => badges[b].type).concat(other)
}
