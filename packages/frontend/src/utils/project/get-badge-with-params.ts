import type { Badge, Project } from '@l2beat/config'
import type { BadgeWithParams } from '~/components/projects/project-badge'
import { getBadgeLink } from '~/server/features/utils/get-badge-link'
import { getImageParams } from './get-image-params'

const badgesParams: Record<string, BadgeWithParams> = {}

export function getBadgeWithParams(
  badge: Badge,
  project: Project,
): BadgeWithParams | undefined {
  if (badgesParams[badge.id]) return badgesParams[badge.id]

  const imageParams = getImageParams(`/images/badges/${badge.id}.png`)
  if (!imageParams) return undefined

  const result = {
    ...badge,
    ...imageParams,
    href: getBadgeLink(badge, project),
  }
  badgesParams[badge.id] = result

  return result
}
