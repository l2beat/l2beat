import { cn } from '~/utils/cn'
import {
  getRowClassNamesWithoutOpacity,
  type RowBackgroundColor,
} from './utils/rowType'

export const basicTableDataRoles = {
  bleedWrapper: 'table-bleed-wrapper',
  scrollWrapper: 'table-scroll-wrapper',
  table: 'table-element',
  header: 'basic-table-header',
  headerGroupedRow: 'basic-table-header-grouped-row',
  headerMainRow: 'basic-table-header-main-row',
  headerDividerRow: 'basic-table-header-divider-row',
  groupedHeaderCell: 'basic-table-header-grouped-cell',
  headerCell: 'basic-table-header-cell',
  headerDividerCell: 'basic-table-header-divider-cell',
  columnFiller: 'basic-table-column-filler',
} as const

export type BasicTableGroupParams = {
  headerTitle: unknown
  isFirstInGroup: boolean
  isLastInGroup: boolean
}

export function getTableBleedWrapperClassName() {
  return 'max-md:-mr-4'
}

export function getTableScrollWrapperClassName(tableWrapperClassName?: string) {
  return cn(
    'relative w-full overflow-x-auto pb-3 max-md:pr-4',
    tableWrapperClassName,
  )
}

export function getTableElementClassName(className?: string) {
  return cn('w-full border-collapse text-left', className)
}

export function getBasicTableGroupedHeaderCellClassName(params: {
  isPlaceholder: boolean
  hasHeader: boolean
  isPinned: boolean
}) {
  return cn(
    'font-medium text-primary tracking-[-0.13px]',
    !params.isPlaceholder && params.hasHeader && 'rounded-t-lg px-6 pt-4',
    params.isPinned && getRowClassNamesWithoutOpacity(null),
  )
}

export function getBasicTableHeaderCellClassName(params: {
  groupParams: BasicTableGroupParams | undefined
  isPinned: boolean
  headClassName: string | undefined
}) {
  const { groupParams, isPinned, headClassName } = params
  return cn(
    groupParams && [
      groupParams.isFirstInGroup && 'pl-6',
      groupParams.isLastInGroup && 'pr-6',
      !groupParams.headerTitle && groupParams.isFirstInGroup && 'rounded-tl-lg',
      !groupParams.headerTitle && groupParams.isLastInGroup && 'rounded-tr-lg',
    ],
    isPinned && getRowClassNamesWithoutOpacity(null),
    headClassName,
  )
}

export function getBasicTableBodyCellClassName(params: {
  groupParams: BasicTableGroupParams | undefined
  isSortable: boolean
  align: 'right' | 'center' | undefined
  isPinned: boolean
  rowBackgroundColor: RowBackgroundColor
  isHighlighted: boolean
  cellClassName: string | undefined
}) {
  const {
    groupParams,
    isSortable,
    align,
    isPinned,
    rowBackgroundColor,
    isHighlighted,
    cellClassName,
  } = params
  return cn(
    groupParams?.isFirstInGroup && 'pl-6!',
    groupParams?.isLastInGroup && 'pr-6!',
    isSortable && align === undefined
      ? groupParams?.isFirstInGroup
        ? 'pl-10'
        : 'pl-4'
      : undefined,
    isPinned && getRowClassNamesWithoutOpacity(rowBackgroundColor),
    isPinned && isHighlighted && 'animate-row-highlight-no-opacity',
    cellClassName,
  )
}

export function getBasicTableColumnFillerClassName() {
  return 'h-full w-4 min-w-4'
}
