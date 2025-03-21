import type { Badge } from '@l2beat/config'
import { getImageParams } from './get-image-params'
import type { BadgeWithParams } from '~/components/projects/project-badge'

export function getBadgeWithParams(badge: Badge): BadgeWithParams | undefined {
  const imageParams = getImageParams(`/images/badges/${badge.id}.png`)
  if (!imageParams) return undefined
  return { ...badge, ...imageParams }
}
