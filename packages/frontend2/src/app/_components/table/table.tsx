import { type SortDirection } from '@tanstack/react-table'
import Link from 'next/link'
import * as React from 'react'
import { cn } from '~/utils/cn'
import { SortingArrows } from './sorting-arrows'

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto pb-3">
    <table
      ref={ref}
      className={cn('w-full text-base text-left border-collapse', className)}
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
      'group/header [&_tr]:border-b whitespace-pre py-2 align-bottom text-xs leading-5 font-medium uppercase text-gray-500 dark:text-gray-50',
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
      'border-b transition-colors border-b-gray-200 dark:border-b-zinc-700',
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
    className={cn(
      'hover:bg-black/[0.05] hover:shadow-sm dark:hover:bg-white/[0.1]',
      className,
    )}
    {...props}
  />
))
TableRow.displayName = 'TableRow'

interface HeaderSorting {
  direction: SortDirection | false
  nextDirection: SortDirection | false
}

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement> & { sorting?: HeaderSorting }
>(({ className, children, sorting, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-10 py-2 first:pl-2 pr-3 last:pr-2 text-left align-bottom uppercase font-medium text-muted-foreground',
      className,
    )}
    {...props}
  >
    {children !== null ? (
      sorting ? (
        <SortingArrows {...sorting}>{children}</SortingArrows>
      ) : (
        children
      )
    ) : null}
  </th>
))
TableHead.displayName = 'TableHead'

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> & { href?: string }
>(({ className, children, href, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      'h-9 md:h-14 align-middle whitespace-pre',
      !href && 'first:pl-2 pr-3 last:pr-2',
      className,
    )}
    {...props}
  >
    {href ? (
      <Link
        href={href}
        className="flex size-full items-center first:pl-2 pr-3 last:pr-2"
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
  TableHeader,
  TableHeaderRow,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
}
