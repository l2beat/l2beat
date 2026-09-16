import type { Badge, Project } from '@l2beat/config'
import type { BadgeWithParams } from '~/components/projects/ProjectBadge'
import { getL2Tab } from '~/server/features/layer2s/getCommonL2Entry'
import { getBadgeLink } from './getBadgeLink'
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
    href: getBadgeLink(badge, {
      name: project.name,
      slug: project.slug,
      tab: getL2Tab(project),
    }),
  }
}
