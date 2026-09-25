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

export function getTableOuterWrapperClassName(stickyHeader?: boolean) {
  // The timeline sits outside the horizontal scroller so it tracks the page.
  return cn('max-md:-mr-4', stickyHeader && 'sticky-table-header-timeline')
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
    getStickyHeaderCellBackground({ isGrouped: !params.isPlaceholder }),
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
  headClassName: string | undefined
  compact?: boolean
}) {
  const { groupParams, isPinned, headClassName, compact } = params
  return cn(
    getStickyHeaderCellBackground({ isGrouped: !!groupParams }),
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

export function getBasicTableColumnFillerClassName(isHeader: boolean) {
  return cn(
    'h-full w-4 min-w-4',
    isHeader && getStickyHeaderCellBackground({ isGrouped: false }),
  )
}

/*
  The sticky header slides over body rows, so its cells must be opaque. They
  repeat what the `ColGroup` paints beneath them: the group tint or the card.
*/
function getStickyHeaderCellBackground(params: { isGrouped: boolean }) {
  return params.isGrouped ? 'bg-header-secondary' : 'bg-surface-primary'
}
