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

/*
 * Hidden columns stay in the row, so `first:` and `last:` alone would pad a
 * hidden cell. Each edge padding is paired with its `data-*-shown:` twin, which
 * matches the shown edge cell (see getShownEdgeAttributes). Tailwind only
 * generates classes it finds written out, hence the literal maps.
 */
const FIRST_SHOWN_CELL_PADDING = {
  'pl-2': 'first:pl-2 data-first-shown:pl-2',
  'pl-3': 'first:pl-3 data-first-shown:pl-3',
} as const

const LAST_SHOWN_CELL_PADDING = {
  'pr-2': 'last:pr-2 data-last-shown:pr-2',
  'pr-3': 'last:pr-3 data-last-shown:pr-3',
} as const

export function getFirstShownCellPadding(
  padding: keyof typeof FIRST_SHOWN_CELL_PADDING,
) {
  return FIRST_SHOWN_CELL_PADDING[padding]
}

export function getLastShownCellPadding(
  padding: keyof typeof LAST_SHOWN_CELL_PADDING,
) {
  return LAST_SHOWN_CELL_PADDING[padding]
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
