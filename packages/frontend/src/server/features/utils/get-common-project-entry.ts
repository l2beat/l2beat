import type { ScalingProjectBadge } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import type { UnderReviewStatus } from '~/utils/project/under-review'
import type { ProjectCountdownsWithContext } from '../scaling/utils/get-countdowns'

export interface CommonProjectEntry {
  id: ProjectId
  name: string
  nameSecondLine?: string
  shortName?: string
  slug: string
  href: string | undefined
  statuses:
    | {
        yellowWarning?: string
        redWarning?: string
        verificationWarning?: boolean
        underReview?: UnderReviewStatus
        syncWarning?: string
        countdowns?: ProjectCountdownsWithContext
      }
    | undefined
  description?: string
  badges?: ScalingProjectBadge[]
}
