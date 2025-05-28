import type { Badge, Project } from '@l2beat/config'
import { getBadgeLink } from 'rewrite/src/server/features/utils/get-badge-link'
import type { BadgeWithParams } from '~/components/projects/project-badge'
import { getImageParams } from './get-image-params'

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
  project: Project<'scalingInfo'>,
): BadgeWithParams | undefined {
  const badgeWithParams = getBadgeWithParams(badge)
  if (!badgeWithParams) return undefined

  return {
    ...badgeWithParams,
    href: getBadgeLink(badge, project),
  }
}
