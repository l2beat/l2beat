import type { Badge, Project } from '@l2beat/config'
import type { BadgeLookup, BadgeRef } from '~/components/projects/BadgeLookup'
import type { BadgeWithParams } from '~/components/projects/ProjectBadge'
import {
  getBadgeLink,
  getSharedBadgeLink,
} from '~/server/features/utils/getBadgeLink'
import { getImageParams } from './getImageParams'

const badgesParams: Record<
  string,
  {
    src: string
    width: number
    height: number
  }
> = {}

export function getBadgeWithParams(badge: Badge): BadgeWithParams | undefined {
  const cached = badgesParams[badge.id]
  if (cached) {
    return {
      ...cached,
      ...badge,
    }
  }

  const imageParams = getImageParams(`/images/badges/${badge.id}.png`)
  if (!imageParams) return undefined

  const result = {
    ...badge,
    ...imageParams,
  }
  badgesParams[badge.id] = imageParams

  return result
}

export function getBadgeWithParamsAndLink(
  badge: Badge,
  project: Project<'scalingInfo' | 'statuses'>,
): BadgeWithParams | undefined {
  const badgeWithParams = getBadgeWithParams(badge)
  if (!badgeWithParams) return undefined

  return {
    ...badgeWithParams,
    href: getBadgeLink(badge, project),
  }
}

// Badge ids are unique across the config, so one registry serves every page.
// `getBadgeLookup` reads back what `getBadgeRef` put here.
const sharedBadges = new Map<string, BadgeWithParams>()

export function getBadgeRef(
  badge: Badge,
  project: Project<'scalingInfo' | 'statuses'>,
): BadgeRef | undefined {
  const shared = getSharedBadge(badge)
  if (!shared) return undefined

  const href = getBadgeLink(badge, project)
  return href === shared.href ? { id: badge.id } : { id: badge.id, href }
}

type EntriesWithBadges = readonly { badges?: BadgeRef[] }[]

/** Accepts entry lists as they come: plain or grouped by tab. */
export function getBadgeLookup(
  ...groups: (EntriesWithBadges | Record<string, EntriesWithBadges>)[]
): BadgeLookup {
  const lookup: BadgeLookup = {}
  const lists = groups.flatMap((group) =>
    Array.isArray(group) ? [group] : Object.values(group),
  )
  for (const entry of lists.flat()) {
    for (const ref of entry.badges ?? []) {
      const badge = sharedBadges.get(ref.id)
      if (!badge) {
        throw new Error('Badge ref without a shared badge', {
          cause: { id: ref.id },
        })
      }
      lookup[ref.id] = badge
    }
  }
  return lookup
}

function getSharedBadge(badge: Badge): BadgeWithParams | undefined {
  const cached = sharedBadges.get(badge.id)
  if (cached) return cached

  const badgeWithParams = getBadgeWithParams(badge)
  if (!badgeWithParams) return undefined

  const shared = { ...badgeWithParams, href: getSharedBadgeLink(badge) }
  sharedBadges.set(badge.id, shared)
  return shared
}
