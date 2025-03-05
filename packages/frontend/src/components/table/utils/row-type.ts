import { ProjectId } from '@l2beat/shared-pure'
import type { CommonProjectEntry } from '~/server/features/utils/get-common-project-entry'
import type { BasicTableProps } from '../basic-table'

export type RowType = ReturnType<typeof getRowType>
export function getRowType(
  entry: CommonProjectEntry,
  rowColoringMode: BasicTableProps<CommonProjectEntry>['rowColoringMode'],
) {
  if (entry.id === ProjectId.ETHEREUM) {
    return 'ethereum'
  }
  if (rowColoringMode === 'ethereum-only') {
    return undefined
  }

  if (!!entry.statuses?.verificationWarning || !!entry.statuses?.redWarning) {
    return 'unverified'
  }
  if (!!entry.statuses?.underReview) {
    return 'under-review'
  }
}

/*
  NOTICE: It is important that this functions return the same colors
*/
export function getRowClassNames(rowType: RowType) {
  switch (rowType) {
    case 'ethereum':
      return 'bg-blue-500/35 dark:bg-blue-700/25'
    case 'unverified':
      return 'bg-red-100/70 dark:bg-red-900/70'
    case 'under-review':
      return 'bg-yellow-200/10'
    default:
      return undefined
  }
}

export function getRowClassNamesWithoutOpacity(rowType: RowType | null) {
  switch (rowType) {
    case 'ethereum':
      return 'bg-blue-400 dark:bg-blue-900 group-data-[highlighted]/row:animate-row-highlight-no-opacity'
    case 'unverified':
      return 'bg-[#FEE4E4] dark:bg-[#371315] group-data-[highlighted]/row:animate-row-highlight-no-opacity'
    case 'under-review':
      return 'bg-[#faf5e6] dark:bg-[#2F2A1D] group-data-[highlighted]/row:animate-row-highlight-no-opacity'
    default:
      return 'bg-surface-primary group-data-[highlighted]/row:animate-row-highlight-no-opacity'
  }
}
