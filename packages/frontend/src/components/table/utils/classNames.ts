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

/**
 * Pinned cells need an opaque background to hide the content scrolling under
 * them. The table is border-collapse, so half of each row separator lies inside
 * the cell's border box; WebKit paints a sticky cell's background over it and
 * the separator looks thinner on high-DPR screens. Clipping the background to
 * the padding box leaves the separator uncovered.
 */
export function getPinnedCellBackgroundClassName(
  rowBackgroundColor: RowBackgroundColor,
) {
  return cn(
    getRowClassNamesWithoutOpacity(rowBackgroundColor ?? null),
    'bg-clip-padding',
  )
}

export function getBasicTableGroupedHeaderCellClassName(params: {
  isPlaceholder: boolean
  hasHeader: boolean
  isPinned: boolean
}) {
  return cn(
    'font-medium text-primary tracking-[-0.13px]',
    !params.isPlaceholder && params.hasHeader && 'rounded-t-lg px-6 pt-4',
    params.isPinned && getPinnedCellBackgroundClassName(undefined),
  )
}

/**
 * The compact variant trims the row and header heights. Everything else — type
 * scale, insets, the divider — is shared with the default table, so a compact
 * table still reads as the same component.
 */
const COMPACT_HEADER_CELL = 'h-8'
const COMPACT_BODY_CELL = 'md:h-12'

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
    isPinned && getPinnedCellBackgroundClassName(undefined),
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
    isPinned && getPinnedCellBackgroundClassName(rowBackgroundColor),
    isPinned && isHighlighted && 'animate-row-highlight-no-opacity',
    compact && COMPACT_BODY_CELL,
    cellClassName,
  )
}

export function getBasicTableColumnFillerClassName() {
  return 'h-full w-4 min-w-4'
}
