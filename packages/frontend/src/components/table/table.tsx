import * as React from 'react'
import { cn } from '~/utils/cn'
import { LinkWithOnHoverPrefetch } from '../link/link-with-on-hover-prefetch'
import { TableTooltip } from './table-tooltip'

const Table = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableElement>) => {
  return (
    <div className="max-md:-mr-4">
      <div className={cn('relative w-full overflow-auto pb-3 max-md:pr-4')}>
        <table
          className={cn('w-full border-collapse text-left', className)}
          cellSpacing={0}
          cellPadding={0}
          {...props}
        />
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
      'group/header whitespace-pre py-2 align-bottom text-xs font-medium uppercase text-zinc-500 dark:text-n-zinc-300',
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
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) => (
  <TableHeaderRow
    className={cn(
      'group/row border-b border-b-divider hover:shadow-sm',
      className,
    )}
    {...props}
  />
)
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
      'h-10 py-2 text-left align-bottom text-[13px] font-medium uppercase',
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
  href,
  align,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement> & {
  href?: string
  align?: 'right' | 'center'
}) => (
  <td
    className={cn(
      'group h-9 whitespace-pre p-0 align-middle text-xs md:h-14 md:text-sm',
      !href && [
        'pr-3 first:pl-2 last:pr-2 md:pr-4',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className,
      ],
    )}
    {...props}
  >
    {href ? (
      <LinkWithOnHoverPrefetch
        href={href}
        className={cn(
          'flex size-full items-center pr-3 group-first:pl-2 group-last:pr-2 md:pr-4',
          align === 'center' && 'justify-center',
          align === 'right' && 'justify-end',
          className,
        )}
      >
        {children}
      </LinkWithOnHoverPrefetch>
    ) : (
      children
    )}
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
