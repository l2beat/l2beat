import type { BadgeDictionary } from '~/components/projects/BadgeDictionaryContext'
import { ps } from '~/server/projects'
import { getBadgeWithParams } from '~/utils/project/getBadgeWithParams'

/**
 * Returns the badges referenced by `badgeIds` anywhere in the page data, so
 * each page ships only the badges its tables can show.
 */
export async function getReferencedBadges(
  pageData: unknown,
): Promise<BadgeDictionary> {
  const allBadges = await getAllScalingBadges()
  const dictionary: BadgeDictionary = {}
  for (const id of collectBadgeIds(pageData)) {
    const badge = allBadges.get(id)
    if (badge) dictionary[id] = badge
  }
  return dictionary
}

let allScalingBadges: Promise<Map<string, BadgeDictionary[string]>> | undefined

// Project configs don't change while the server runs.
function getAllScalingBadges() {
  allScalingBadges ??= ps
    .getProjects({ select: ['display'], where: ['scalingInfo'] })
    .then((projects) => {
      const badges = new Map<string, BadgeDictionary[string]>()
      for (const badge of projects.flatMap((p) => p.display.badges)) {
        if (badges.has(badge.id)) continue
        const badgeWithParams = getBadgeWithParams(badge)
        if (badgeWithParams) badges.set(badge.id, badgeWithParams)
      }
      return badges
    })
  return allScalingBadges
}

function collectBadgeIds(value: unknown, ids = new Set<string>()) {
  if (Array.isArray(value)) {
    for (const item of value) collectBadgeIds(item, ids)
  } else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      if (key === 'badgeIds' && Array.isArray(item)) {
        for (const id of item) ids.add(id)
      } else {
        collectBadgeIds(item, ids)
      }
    }
  }
  return ids
}
