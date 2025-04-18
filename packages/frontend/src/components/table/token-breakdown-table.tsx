import type { Table as TanstackTable } from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'
import type { Row } from '@tanstack/react-table'
import { cn } from '~/utils/cn'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableHeaderRow,
  TableRow,
} from './table'
import { TableEmptyState } from './table-empty-state'

interface Props<T> {
  table: TanstackTable<T>
  renderSubComponent: (props: { row: Row<T> }) => React.ReactElement
  className?: string
}

export function TokenTable<T>({ table, renderSubComponent }: Props<T>) {
  if (table.getRowCount() === 0) {
    return <TableEmptyState />
  }

  const headers = table.getHeaderGroups()[0]!

  return (
    <Table>
      <TableHeader>
        <TableHeaderRow
          key={headers.id}
          className="!border-0 md:bg-surface-secondary"
        >
          {headers.headers.map((header) => (
            <TableHead
              key={header.id}
              colSpan={header.colSpan}
              className={cn(
                'whitespace-pre align-middle text-sm font-medium uppercase text-gray-500 first:rounded-l first:pl-2 last:rounded-r last:pr-2 dark:text-gray-50 first:md:pl-6 last:md:pr-6',
                header.column.columnDef.meta?.headClassName,
              )}
              align={header.column.columnDef.meta?.align}
              tooltip={header.column.columnDef.meta?.tooltip}
            >
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
            </TableHead>
          ))}
        </TableHeaderRow>
      </TableHeader>
      {table.getRowModel().rows.map((row) => (
        <TableBody key={`row-${row.id}`} className="group">
          <TableRow
            slug={undefined}
            key={row.id}
            className="border-b border-b-black/10 group-hover:bg-black/5 dark:border-b-zinc-700 dark:group-hover:bg-white/5 md:border-b-0"
          >
            {row.getVisibleCells().map((cell) => {
              return (
                <TableCell
                  key={cell.id}
                  align={cell.column.columnDef.meta?.align}
                  className={cn(
                    'h-9 py-2 pr-2  first:pl-2 last:pr-2 md:h-10 first:md:pl-6 last:md:pr-6',
                    cell.column.columnDef.meta?.cellClassName,
                  )}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              )
            })}
          </TableRow>
          {row.getIsExpanded() && (
            <TableRow
              slug={undefined}
              key={`${row.id}-expanded`}
              className="group-hover:bg-black/5 dark:border-b-zinc-700 dark:group-hover:bg-white/5 md:border-b-0"
            >
              <TableCell colSpan={row.getVisibleCells().length}>
                {renderSubComponent({ row })}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      ))}
    </Table>
  )
}
