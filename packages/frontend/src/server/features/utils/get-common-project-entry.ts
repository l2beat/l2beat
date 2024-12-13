import { type ProjectId } from '@l2beat/shared-pure'
import { type UnderReviewStatus } from '~/utils/project/under-review'

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
        syncStatusInfo?: string
      }
    | undefined
}
