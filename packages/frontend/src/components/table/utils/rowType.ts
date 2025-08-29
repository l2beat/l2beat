import type { UnderReviewStatus } from '~/utils/project/underReview'

export type RowBackgroundColor = 'blue' | 'red' | 'yellow' | undefined
export function getRowBackgroundColor(statuses: {
  redWarning?: string
  verificationWarning?: boolean
  underReview?: UnderReviewStatus
  ongoingAnomaly?: boolean
}): RowBackgroundColor | undefined {
  if (
    !!statuses?.verificationWarning ||
    !!statuses?.redWarning ||
    !!statuses?.ongoingAnomaly
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

export function getRowClassNamesWithoutOpacity(
  rowBackgroundColor: RowBackgroundColor | null,
) {
  switch (rowBackgroundColor) {
    case 'blue':
      return 'bg-blue-400 dark:bg-blue-900'
    case 'red':
      return 'bg-[#FEE4E4] dark:bg-[#371315]'
    case 'yellow':
      return 'bg-[#faf5e6] dark:bg-[#2F2A1D]'
    default:
      return 'bg-surface-primary'
  }
}
