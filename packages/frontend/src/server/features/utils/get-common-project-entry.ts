import type { ProjectId } from '@l2beat/shared-pure'
import type { BadgeWithParams } from '~/components/projects/project-badge'
import type { UnderReviewStatus } from '~/utils/project/under-review'
import type { ProjectCountdownsWithContext } from '../scaling/utils/get-countdowns'

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
      }
    | undefined
  description?: string
  badges?: BadgeWithParams[]
}
