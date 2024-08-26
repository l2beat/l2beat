import { type Table as TanstackTable, flexRender } from '@tanstack/react-table'
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
  className?: string
}

export function TokenTable<T>({ table }: Props<T>) {
  if (table.getRowCount() === 0) {
    return <TableEmptyState />
  }

  const headers = table.getHeaderGroups()[0]!

  return (
    <Table>
      <TableHeader>
        <TableHeaderRow
          key={headers.id}
          className="border-b-black/10 md:border-b-0 md:bg-black/10 dark:border-b-white/25 dark:md:border-b-0 dark:md:bg-white/10"
        >
          {headers.headers.map((header) => (
            <TableHead
              key={header.id}
              colSpan={header.colSpan}
              className={cn(
                'whitespace-pre align-middle text-sm font-medium uppercase text-gray-500 first:rounded-l first:pl-2 last:rounded-r last:pr-2 first:md:pl-6 last:md:pr-6 dark:text-gray-50',
                header.column.columnDef.meta?.headClassName,
              )}
              align={header.column.columnDef.meta?.align}
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
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
            className="border-b border-b-black/10 hover:bg-black/5 hover:shadow-sm md:border-b-0 dark:border-b-zinc-700 dark:hover:bg-white/5"
          >
            {row.getVisibleCells().map((cell) => {
              return (
                <TableCell
                  key={cell.id}
                  align={cell.column.columnDef.meta?.align}
                  className={cn(
                    'h-9 py-2 first:rounded-l first:pl-2 last:rounded-r last:pr-2 md:h-10 first:md:pl-6 last:md:pr-6',
                    cell.column.columnDef.meta?.cellClassName,
                  )}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              )
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
