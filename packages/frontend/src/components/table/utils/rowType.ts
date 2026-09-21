import type { ProjectRedWarning } from '@l2beat/config'
import type { ProjectVerificationWarnings } from '~/server/features/utils/getCommonProjectEntry'
import type { UnderReviewStatus } from '~/utils/project/underReview'

export type RowBackgroundColor = 'blue' | 'red' | 'yellow' | undefined
export function getRowBackgroundColor(statuses: {
  redWarning?: ProjectRedWarning
  verificationWarnings?: ProjectVerificationWarnings
  underReview?: UnderReviewStatus
  ongoingAnomaly?: boolean
}): RowBackgroundColor | undefined {
  if (
    statuses.verificationWarnings?.contracts ||
    statuses.verificationWarnings?.programHashes ||
    !!statuses.redWarning ||
    !!statuses.ongoingAnomaly
  ) {
    return 'red'
  }
  if (statuses?.underReview) {
    return 'yellow'
  }
}

export function getRowClassNames(rowBackgroundColor: RowBackgroundColor) {
  switch (rowBackgroundColor) {
    case 'blue':
      return 'bg-row-info'
    case 'red':
      return 'bg-row-negative'
    case 'yellow':
      return 'bg-row-warning'
    default:
      return undefined
  }
}

/** For pinned cells, which must hide the columns scrolling beneath them. */
export function getRowClassNamesWithoutOpacity(
  rowBackgroundColor: RowBackgroundColor | null,
) {
  switch (rowBackgroundColor) {
    case 'blue':
      return 'bg-row-info-no-opacity'
    case 'red':
      return 'bg-row-negative-no-opacity'
    case 'yellow':
      return 'bg-row-warning-no-opacity'
    default:
      return 'bg-surface-primary'
  }
}
