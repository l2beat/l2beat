import type { ProjectId } from '@l2beat/shared-pure'
import type { BadgeWithParams } from '~/components/projects/ProjectBadge'
import type { UnderReviewStatus } from '~/utils/project/underReview'
import type { ProjectCountdownsWithContext } from '../scaling/utils/getCountdowns'

export interface CommonProjectEntry {
  id: ProjectId
  icon: string
  name: string
  nameSecondLine?: string
  shortName?: string
  slug: string
  statuses:
    | {
        yellowWarning?: string
        redWarning?: string
        verificationWarning?: boolean
        underReview?: UnderReviewStatus
        syncWarning?: string
        countdowns?: ProjectCountdownsWithContext
        emergencyWarning?: string
      }
    | undefined
  description?: string
  badges?: BadgeWithParams[]
}
