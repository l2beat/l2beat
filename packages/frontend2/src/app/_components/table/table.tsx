import Link from 'next/link'
import * as React from 'react'
import { cn } from '~/utils/cn'
import { TableTooltip } from './table-tooltip'

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto pb-3">
    <table
      ref={ref}
      className={cn('w-full border-collapse text-left text-base', className)}
      cellPadding={0}
      cellSpacing={0}
      {...props}
    />
  </div>
))
Table.displayName = 'Table'

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      'group/header whitespace-pre py-2 align-bottom text-xs font-medium uppercase text-gray-500 dark:text-gray-50 [&_tr]:border-b',
      className,
    )}
    {...props}
  />
))
TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
))
TableBody.displayName = 'TableBody'

const TableHeaderRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'border-b border-b-gray-200 dark:border-b-zinc-700',
      className,
    )}
    {...props}
  />
))
TableHeaderRow.displayName = 'TableHeaderRow'

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <TableHeaderRow
    ref={ref}
    className={cn('group/row hover:shadow-sm', className)}
    {...props}
  />
))
TableRow.displayName = 'TableRow'

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement> & {
    tooltip?: React.ReactNode
    align?: 'right' | 'center'
  }
>(({ className, children, tooltip, align, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-10 py-2 pr-3 text-left align-bottom font-medium uppercase first:pl-2 last:pr-2',
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
))
TableHead.displayName = 'TableHead'

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> & {
    href?: string
    align?: 'right' | 'center'
  }
>(({ className, children, href, align, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      'group h-9 whitespace-pre align-middle md:h-14',
      !href && [
        'pr-3 first:pl-2 last:pr-2',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className,
      ],
    )}
    {...props}
  >
    {href ? (
      <Link
        href={href}
        className={cn(
          'flex size-full items-center pr-3 group-first:pl-2 group-last:pr-2 md:pr-4',
          align === 'center' && 'justify-center',
          align === 'right' && 'justify-end',
          className,
        )}
      >
        {children}
      </Link>
    ) : (
      children
    )}
  </td>
))
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
