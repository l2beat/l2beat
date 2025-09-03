import type { ProjectId } from '@l2beat/shared-pure'
import type { BadgeWithParams } from '~/components/projects/ProjectBadge'
import type { RowBackgroundColor } from '~/components/table/utils/rowType'
import type { UnderReviewStatus } from '~/utils/project/underReview'

export interface CommonProjectEntry {
  id: ProjectId
  icon: string
  name: string
  nameSecondLine?: string
  shortName?: string
  slug: string
  backgroundColor: RowBackgroundColor
  statuses:
    | {
        yellowWarning?: string
        redWarning?: string
        verificationWarning?: boolean
        underReview?: UnderReviewStatus
        syncWarning?: string
        emergencyWarning?: string
        ongoingAnomaly?: boolean
      }
    | undefined
  description?: string
  badges?: BadgeWithParams[]
}
