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
      return 'bg-blue-500/35 dark:bg-blue-700/25'
    case 'red':
      return 'bg-red-100/70 dark:bg-red-900/70'
    case 'yellow':
      return 'bg-yellow-200/10'
    default:
      return undefined
  }
}

/**
 * Pinned cells must hide the columns scrolling beneath them, so the row's
 * transparent tint is layered, as a flat gradient, over the opaque card colour.
 * Keep the tints in sync with getRowClassNames.
 */
export function getRowClassNamesWithoutOpacity(
  rowBackgroundColor: RowBackgroundColor | null,
) {
  switch (rowBackgroundColor) {
    case 'blue':
      return 'bg-linear-to-r bg-surface-primary from-blue-500/35 to-blue-500/35 dark:from-blue-700/25 dark:to-blue-700/25'
    case 'red':
      return 'bg-linear-to-r bg-surface-primary from-red-100/70 to-red-100/70 dark:from-red-900/70 dark:to-red-900/70'
    case 'yellow':
      return 'bg-linear-to-r bg-surface-primary from-yellow-200/10 to-yellow-200/10'
    default:
      return 'bg-surface-primary'
  }
}
