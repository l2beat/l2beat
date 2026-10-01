import type * as React from 'react'
import { useRef } from 'react'
import {
  HighlightedTableRowProvider,
  useHighlightedTableRowContext,
} from '~/components/table/HighlightedTableRowContext'
import { cn } from '~/utils/cn'
import { StickyTableHeader } from './StickyTableHeader'
import { TableTooltip } from './TableTooltip'
import {
  stickyTableHeaderClassNames,
  useStickyTableHeader,
} from './useStickyTableHeader'
import {
  getTableElementClassName,
  getTableOuterWrapperClassName,
  getTableScrollWrapperClassName,
} from './utils/classNames'

const Table = ({
  className,
  tableWrapperClassName,
  stickyHeader,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableElement> & {
  tableWrapperClassName?: string
  /**
   * A copy of the table's column groups and `thead`, shown in place of the real
   * header so it stays in view while the page scrolls. See
   * `useStickyTableHeader`.
   */
  stickyHeader?: React.ReactNode
}) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const isSticky = stickyHeader !== undefined
  useStickyTableHeader(rootRef, isSticky)

  return (
    <div
      ref={rootRef}
      className={cn(
        getTableOuterWrapperClassName(),
        isSticky && stickyTableHeaderClassNames.root,
      )}
    >
      {isSticky && (
        <StickyTableHeader
          tableProps={{
            ...props,
            className: getTableElementClassName(cn(className, 'table-fixed')),
          }}
        >
          {stickyHeader}
        </StickyTableHeader>
      )}
      <div
        className={cn(
          getTableScrollWrapperClassName(tableWrapperClassName),
          isSticky && stickyTableHeaderClassNames.scroller,
        )}
      >
        <HighlightedTableRowProvider>
          <table
            className={getTableElementClassName(className)}
            cellSpacing={0}
            cellPadding={0}
            {...props}
          >
            {children}
          </table>
        </HighlightedTableRowProvider>
      </div>
    </div>
  )
}
Table.displayName = 'Table'

const TableHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead
    className={cn(
      'group/header whitespace-pre py-2 align-bottom font-medium text-xs text-zinc-500 uppercase dark:text-n-zinc-300',
      className,
    )}
    {...props}
  />
)
TableHeader.displayName = 'TableHeader'

const TableBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />
)
TableBody.displayName = 'TableBody'

const TableHeaderRow = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={className} {...props} />
)
TableHeaderRow.displayName = 'TableHeaderRow'

const TableRow = ({
  className,
  highlightId,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement> & {
  highlightId: string | undefined
}) => {
  const { highlightedIds } = useHighlightedTableRowContext()
  const isSelected =
    highlightId !== undefined && highlightedIds.includes(highlightId)
  // With multiple highlighted rows, scroll only to the first one so the
  // rows don't fight over the viewport.
  const isScrollTarget = isSelected && highlightId === highlightedIds[0]
  return (
    <tr
      className={cn(
        'group/row border-b border-b-divider transition-colors',
        isSelected && 'animate-row-highlight',
        className,
      )}
      ref={(node) => {
        if (node && isScrollTarget) {
          node.scrollIntoView({ block: 'center' })
        }
      }}
      {...props}
    />
  )
}
TableRow.displayName = 'TableRow'

const TableHead = ({
  className,
  children,
  tooltip,
  align,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement> & {
  tooltip?: React.ReactNode
  align?: 'right' | 'center'
}) => (
  <th
    className={cn(
      'h-10 py-2 text-left align-bottom font-medium text-[13px] uppercase',
      'pr-3 first:pl-2 last:pr-2 md:pr-4',
      className,
    )}
    {...props}
  >
    <div
      className={cn(
        'flex items-end gap-1.5 leading-none',
        align === 'center' && 'justify-center',
        align === 'right' && 'justify-end',
      )}
    >
      {children}
      {tooltip ? <TableTooltip>{tooltip}</TableTooltip> : null}
    </div>
  </th>
)
TableHead.displayName = 'TableHead'

const TableCell = ({
  className,
  children,
  align,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement> & {
  align?: 'right' | 'center'
}) => (
  <td
    className={cn(
      'group h-10 whitespace-pre p-0 align-middle text-xs transition-colors md:h-14 md:text-sm',
      'pr-3 first:pl-3 last:pr-3 md:pr-4',
      align === 'center' && 'text-center',
      align === 'right' && 'text-right',
      className,
    )}
    {...props}
  >
    {children}
  </td>
)
TableCell.displayName = 'TableCell'

export {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableHeaderRow,
  TableRow,
}
