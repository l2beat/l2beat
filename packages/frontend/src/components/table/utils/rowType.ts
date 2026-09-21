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

/*
  NOTICE: It is important that this functions return the same colors
*/
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

/*
  Pinned cells must hide what scrolls beneath them, so they repeat the row tint
  as an opaque mix over the card colour instead of a fixed hex that drifts
  whenever the surface token changes.
*/
export function getRowClassNamesWithoutOpacity(
  rowBackgroundColor: RowBackgroundColor | null,
) {
  switch (rowBackgroundColor) {
    case 'blue':
      return 'bg-[color-mix(in_srgb,var(--color-blue-500)_35%,var(--surface-primary))] dark:bg-[color-mix(in_srgb,var(--color-blue-700)_25%,var(--surface-primary))]'
    case 'red':
      return 'bg-[color-mix(in_srgb,var(--color-red-100)_70%,var(--surface-primary))] dark:bg-[color-mix(in_srgb,var(--color-red-900)_70%,var(--surface-primary))]'
    case 'yellow':
      return 'bg-[color-mix(in_srgb,var(--color-yellow-200)_10%,var(--surface-primary))]'
    default:
      return 'bg-surface-primary'
  }
}
