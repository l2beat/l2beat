import { cn } from '~/utils/cn'
import {
  getRowClassNamesWithoutOpacity,
  type RowBackgroundColor,
} from './rowType'

export type BasicTableGroupParams = {
  headerTitle: unknown
  isFirstInGroup: boolean
  isLastInGroup: boolean
}

export function getTableOuterWrapperClassName() {
  return 'table-scroll-root max-md:-mr-4'
}

export function getTableScrollWrapperClassName(tableWrapperClassName?: string) {
  return cn(
    'table-scroller relative w-full overflow-x-auto pb-3 max-md:pr-4',
    tableWrapperClassName,
  )
}

/**
 * Starts the table `STICKY_OVERLAP_PX` left of the scroller, where pinned
 * cells stick, so they do not shift that pixel on the first touch of scroll.
 */
export function getTableElementClassName(className?: string) {
  return cn('-ml-px w-[calc(100%+1px)] border-collapse text-left', className)
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

/**
 * The compact variant has the home page's row height and column headers: 40px
 * rows, and quiet 13px headers in sentence case. The last header keeps the
 * cells' right inset, so it ends over its figures. Its cells keep to one line
 * (see the cells' `compact` props).
 */
const COMPACT_HEADER_CELL =
  'h-8 font-normal text-label-value-13 text-secondary normal-case last:pr-3'
const COMPACT_BODY_CELL = 'md:h-10'

export function getBasicTableHeaderCellClassName(params: {
  groupParams: BasicTableGroupParams | undefined
  isPinned: boolean
  headClassName: string | undefined
  compact?: boolean
}) {
  const { groupParams, isPinned, headClassName, compact } = params
  return cn(
    groupParams && [
      groupParams.isFirstInGroup && 'pl-6',
      groupParams.isLastInGroup && 'pr-6',
      !groupParams.headerTitle && groupParams.isFirstInGroup && 'rounded-tl-lg',
      !groupParams.headerTitle && groupParams.isLastInGroup && 'rounded-tr-lg',
    ],
    isPinned && getRowClassNamesWithoutOpacity(null),
    compact && COMPACT_HEADER_CELL,
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
  compact?: boolean
}) {
  const {
    groupParams,
    isSortable,
    align,
    isPinned,
    rowBackgroundColor,
    isHighlighted,
    cellClassName,
    compact,
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
    compact && COMPACT_BODY_CELL,
    cellClassName,
  )
}

export function getBasicTableColumnFillerClassName() {
  return 'h-full w-4 min-w-4'
}
