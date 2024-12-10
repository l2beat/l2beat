import type { ProjectId } from '@l2beat/shared-pure'

export interface CommonProjectEntry {
  id: ProjectId
  basicInfo: {
    name: string
    shortName?: string
    nameLine2?: string
    slug: string
    href?: string
  }
  statuses: {
    yellowWarning?: string
    redWarning?: string
    verificationWarning?: string
    underReviewInfo?: string
    syncStatusInfo?: string
  }
}
