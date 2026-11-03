import type { ProjectRedWarning } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
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
        redWarning?: ProjectRedWarning
        verificationWarnings?: {
          contracts: string | undefined
          programHashes: string | undefined
          programHashesDescription: string | undefined
        }
        underReview?: UnderReviewStatus
        syncWarning?: string
        emergencyWarning?: string
        ongoingAnomaly?: boolean
      }
    | undefined
  description?: string
  /**
   * Set on L2 table rows, which leave out the description and badges: the
   * name tooltip loads them for this project from `projects.nameTooltip` as
   * it is about to open. Unset when the project has neither.
   */
  lazyTooltipProjectId?: ProjectId
}

export interface ProjectVerificationWarnings {
  contracts: string | undefined
  programHashes: string | undefined
  programHashesDescription: string | undefined
}
