import { type BasicTableEntry, type BasicTableProps } from '../basic-table'

export type RowType = ReturnType<typeof getRowType>
export function getRowType(
  entry: BasicTableEntry,
  rowColoringMode: BasicTableProps<BasicTableEntry>['rowColoringMode'],
) {
  if (entry.slug === 'ethereum') {
    return 'ethereum'
  }
  if (rowColoringMode === 'ethereum-only') {
    return undefined
  }

  if (entry.isVerified === false || entry.redWarning) {
    return 'unverified'
  }
  if (entry.showProjectUnderReview) {
    return 'under-review'
  }
  if (entry.hasImplementationChanged) {
    return 'implementation-changed'
  }
}

/*
  NOTICE: It is important that this functions return the same colors
*/
export function getRowTypeClassNames(rowType: RowType) {
  switch (rowType) {
    case 'ethereum':
      return 'bg-blue-400 hover:bg-blue-400 dark:bg-blue-900 dark:hover:bg-blue-900'
    case 'unverified':
      return 'bg-red-100/70 dark:bg-red-900/70 hover:bg-red-100/90 dark:hover:bg-red-900/90'
    case 'under-review':
    case 'implementation-changed':
      return 'bg-yellow-200/10 hover:!bg-yellow-200/20'
    default:
      return 'dark:hover:bg-white/[0.1] hover:bg-black/[0.05] hover:shadow-sm'
  }
}
export function getRowTypeClassNamesWithoutOpacity(rowType: RowType | null) {
  switch (rowType) {
    case 'ethereum':
      return 'bg-blue-400 group-hover/row:bg-blue-400 dark:bg-blue-900 dark:group-hover/row:bg-blue-900'
    case 'unverified':
      return 'bg-[#FEE4E4] dark:bg-[#391617] group-hover/row:bg-[#FDDDDD] dark:group-hover/row:bg-[#401213]'
    case 'under-review':
    case 'implementation-changed':
      return 'bg-[#faf5e6] dark:bg-[#363122] group-hover/row:!bg-[#FBEFC9] dark:group-hover/row:!bg-[#4C411F]'
    default:
      return 'bg-surface-primary group-hover/row:shadow-sm group-hover/row:bg-[#EEEEEE] dark:group-hover/row:bg-[#35363A]'
  }
}
