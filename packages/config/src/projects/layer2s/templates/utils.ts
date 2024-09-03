import { unionBy } from 'lodash'
import { BadgeId, badges } from '../../badges'

export function mergeBadges(
  inherentBadges: BadgeId[],
  definedBadges: BadgeId[],
): BadgeId[] {
  const all = definedBadges.concat(inherentBadges)
  const allowDuplicates = all.filter(
    (b) => badges[b].type === 'Other' || badges[b].type === 'VM',
  ) // do not dedup badges of type 'Other' and 'VM' (multiVM)
  const rest = all.filter(
    (b) => badges[b].type !== 'Other' && badges[b].type !== 'VM',
  )
  return unionBy(rest, (b) => badges[b].type).concat(allowDuplicates)
}
