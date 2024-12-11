import { type ProjectId } from '@l2beat/shared-pure'

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
        underReviewInfo?: string
        syncStatusInfo?: string
      }
    | undefined
}
