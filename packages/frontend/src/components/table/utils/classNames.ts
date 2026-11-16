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
 * The compact variant trims the row and header heights. Everything else — type
 * scale, insets, the divider — is shared with the default table, so a compact
 * table still reads as the same component.
 */
const COMPACT_HEADER_CELL = 'h-8'
const COMPACT_BODY_CELL = 'md:h-12'

export function getBasicTableHeaderCellClassName(params: {
  groupParams: BasicTableGroupParams | undefined
  isPinned: boolean
  /** Without a sort icon to push it in, a first label starts where the values do */
  isSortable?: boolean
  align?: 'right' | 'center'
  headClassName: string | undefined
  compact?: boolean
}) {
  const { groupParams, isPinned, headClassName, compact, isSortable, align } =
    params
  return cn(
    isSortable === false && align === undefined && 'first:pl-3',
    groupParams && [
      groupParams.isFirstInGroup && 'pl-6',
      // `md:` too, or TableHead's own `md:pr-4` wins from md up and the
      // header ends 8px right of its group's values (body cells are `pr-6!`)
      groupParams.isLastInGroup && 'pr-6 md:pr-6',
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
    // A sortable, left-aligned cell starts under its header's label, past the
    // sort icon; first in a group, past the group's 24px inset too.
    groupParams?.isFirstInGroup &&
      (isSortable && align === undefined ? 'pl-10!' : 'pl-6!'),
    groupParams?.isLastInGroup && 'pr-6!',
    isSortable && align === undefined && !groupParams?.isFirstInGroup && 'pl-4',
    isPinned && getRowClassNamesWithoutOpacity(rowBackgroundColor),
    isPinned && isHighlighted && 'animate-row-highlight-no-opacity',
    compact && COMPACT_BODY_CELL,
    cellClassName,
  )
}

export function getBasicTableColumnFillerClassName() {
  return 'h-full w-4 min-w-4'
}
