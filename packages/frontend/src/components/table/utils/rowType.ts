import { ProjectId } from '@l2beat/shared-pure'
import { UNVERIFIED_DA_CLASSNAME } from '~/pages/data-availability/summary/components/table/DaSummaryPublicTable'
import type { CommonProjectEntry } from '~/server/features/utils/getCommonProjectEntry'
import type { BasicTableProps } from '../BasicTable'

export type RowType = ReturnType<typeof getRowType>
export function getRowType(
  entry: CommonProjectEntry,
  rowColoringMode: BasicTableProps<CommonProjectEntry>['rowColoringMode'],
) {
  if (entry.id === ProjectId.ETHEREUM) {
    return 'blue'
  }
  if (rowColoringMode === 'ignore-colors') {
    return undefined
  }

  if (
    !!entry.statuses?.verificationWarning ||
    !!entry.statuses?.redWarning ||
    !!entry.statuses?.ongoingAnomaly
  ) {
    return 'red'
  }
  if (entry.statuses?.underReview) {
    return 'yellow'
  }
}

/*
  NOTICE: It is important that this functions return the same colors
*/
export function getRowClassNames(rowType: RowType) {
  switch (rowType) {
    case 'blue':
      return 'bg-blue-500/35 dark:bg-blue-700/25'
    case 'red':
      return UNVERIFIED_DA_CLASSNAME
    case 'yellow':
      return 'bg-yellow-200/10'
    default:
      return undefined
  }
}

export function getRowClassNamesWithoutOpacity(rowType: RowType | null) {
  switch (rowType) {
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
