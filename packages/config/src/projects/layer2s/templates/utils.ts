import { unionBy } from 'lodash'
import { BadgeId, badges } from '../../badges'

export function mergeBadges(
  inherentBadges: BadgeId[],
  definedBadges: BadgeId[],
): BadgeId[] {
  return unionBy(inherentBadges.concat(definedBadges), (b) => badges[b].type)
}
