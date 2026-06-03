import * as React from 'react'
import {
  HighlightedTableRowProvider,
  useHighlightedTableRowContext,
} from '~/components/table/HighlightedTableRowContext'
import { ChevronIcon } from '~/icons/Chevron'
import { cn } from '~/utils/cn'
import { TableTooltip } from './TableTooltip'
import {
  getTableElementClassName,
  getTableOuterWrapperClassName,
  getTableScrollWrapperClassName,
} from './utils/classNames'

const Table = ({
  className,
  tableOuterWrapperClassName,
  tableWrapperClassName,
  withScrollHint,
  ...props
}: React.HTMLAttributes<HTMLTableElement> & {
  tableOuterWrapperClassName?: string
  tableWrapperClassName?: string
  withScrollHint?: boolean
}) => {
  return (
    <div className={getTableOuterWrapperClassName(tableOuterWrapperClassName)}>
      <TableScrollWrapper
        className={getTableScrollWrapperClassName(tableWrapperClassName)}
        withScrollHint={withScrollHint}
      >
        <HighlightedTableRowProvider>
          <table
            className={getTableElementClassName(className)}
            cellSpacing={0}
            cellPadding={0}
            {...props}
          />
        </HighlightedTableRowProvider>
      </TableScrollWrapper>
    </div>
  )
}
Table.displayName = 'Table'

type VisibleScrollHint = 'left' | 'right' | 'both'

const SCROLL_HINT_THRESHOLD = 4

function TableScrollWrapper({
  children,
  className,
  withScrollHint,
}: {
  children: React.ReactNode
  className?: string
  withScrollHint?: boolean
}) {
  const [node, setNode] = React.useState<HTMLDivElement | null>(null)
  const [visibleHint, setVisibleHint] = React.useState<VisibleScrollHint>()

  React.useEffect(() => {
    if (!node || !withScrollHint) return

    const update = () => {
      const isScrolledToStart = node.scrollLeft < SCROLL_HINT_THRESHOLD
      const isScrolledToEnd =
        node.scrollLeft >
        node.scrollWidth - node.clientWidth - SCROLL_HINT_THRESHOLD

      const nextVisibleHint =
        isScrolledToStart && isScrolledToEnd
          ? undefined
          : isScrolledToStart
            ? 'right'
            : isScrolledToEnd
              ? 'left'
              : 'both'

      setVisibleHint(nextVisibleHint)
    }

    update()
    node.addEventListener('scroll', update)

    const resizeObserver = new ResizeObserver(update)
    resizeObserver.observe(node)
    if (node.firstElementChild instanceof HTMLElement) {
      resizeObserver.observe(node.firstElementChild)
    }

    return () => {
      node.removeEventListener('scroll', update)
      resizeObserver.disconnect()
    }
  }, [node, withScrollHint])

  if (!withScrollHint) {
    return <div className={className}>{children}</div>
  }

  const scroll = (direction: 'left' | 'right') => {
    if (!node) return
    node.scrollBy({
      left: node.clientWidth * 0.8 * (direction === 'left' ? -1 : 1),
      behavior: 'smooth',
    })
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Scroll table left"
        title="Scroll left"
        onClick={() => scroll('left')}
        className={cn(
          'pointer-events-none absolute inset-y-0 left-0 z-20 flex w-8 items-center justify-center bg-linear-to-r from-surface-primary to-transparent opacity-0 transition-opacity duration-200',
          (visibleHint === 'left' || visibleHint === 'both') &&
            'pointer-events-auto opacity-100',
        )}
      >
        <ChevronIcon className="rotate-90 scale-75 fill-primary" />
      </button>
      <div className={className} ref={setNode}>
        {children}
      </div>
      <button
        type="button"
        aria-label="Scroll table right"
        title="Scroll right"
        onClick={() => scroll('right')}
        className={cn(
          'pointer-events-none absolute inset-y-0 right-0 z-20 flex w-8 items-center justify-center bg-linear-to-l from-surface-primary to-transparent opacity-0 transition-opacity duration-200',
          (visibleHint === 'right' || visibleHint === 'both') &&
            'pointer-events-auto opacity-100',
        )}
      >
        <ChevronIcon className="-rotate-90 scale-75 fill-primary" />
      </button>
    </div>
  )
}

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
  const { highlightedId } = useHighlightedTableRowContext()
  const isSelected = highlightedId && highlightedId === highlightId
  return (
    <tr
      className={cn(
        'group/row border-b border-b-divider transition-colors',
        isSelected && 'animate-row-highlight',
        className,
      )}
      ref={(node) => {
        if (node && isSelected) {
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
