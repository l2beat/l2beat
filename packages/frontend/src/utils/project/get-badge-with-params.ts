import type { Badge } from '@l2beat/config'
import type { BadgeWithParams } from '~/components/projects/project-badge'
import { getImageParams } from './get-image-params'

const badgesParams: Record<string, BadgeWithParams> = {}

export function getBadgeWithParams(badge: Badge): BadgeWithParams | undefined {
  if (badgesParams[badge.id]) return badgesParams[badge.id]

  const imageParams = getImageParams(`/images/badges/${badge.id}.png`)
  if (!imageParams) return undefined

  const result = { ...badge, ...imageParams }
  badgesParams[badge.id] = result

  return result
}
