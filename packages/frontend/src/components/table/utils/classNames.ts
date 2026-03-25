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

export function getBasicTableGroupedHeaderCellClassName(params: {
  isPlaceholder: boolean
  hasHeader: boolean
}) {
  return cn(
    'bg-header-secondary font-medium text-primary tracking-[-0.13px]',
    !params.isPlaceholder && params.hasHeader && 'rounded-t-lg px-6 pt-4',
  )
}

export function getBasicTableHeaderCellClassName(params: {
  groupParams: BasicTableGroupParams | undefined
  headClassName: string | undefined
}) {
  const { groupParams, headClassName } = params
  return cn(
    'bg-surface-primary',
    groupParams && [
      groupParams.isFirstInGroup && 'pl-6',
      groupParams.isLastInGroup && 'pr-6',
      !groupParams.headerTitle && groupParams.isFirstInGroup && 'rounded-tl-lg',
      !groupParams.headerTitle && groupParams.isLastInGroup && 'rounded-tr-lg',
    ],
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
