import { type Table as TanstackTable, flexRender } from '@tanstack/react-table'
import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from './table'
import { SortingArrows } from './sorting/sorting-arrows'

interface Props<T extends { href?: string }> {
  table: TanstackTable<T>
}

export function BasicTable<T extends { href?: string }>({ table }: Props<T>) {
  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableHeaderRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                colSpan={header.colSpan}
                className={header.column.columnDef.meta?.headClassName}
                tooltip={header.column.columnDef.meta?.tooltip}
              >
                {header.isPlaceholder ? null : header.column.getCanSort() ? (
                  <SortingArrows
                    direction={header.column.getIsSorted()}
                    nextDirection={header.column.getNextSortingOrder()}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </SortingArrows>
                ) : (
                  flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )
                )}
              </TableHead>
            ))}
          </TableHeaderRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => {
              const { meta } = cell.column.columnDef
              return (
                <TableCell
                  key={cell.id}
                  href={getHref(row.original.href, meta?.hash)}
                  className={meta?.cellClassName}
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

function getHref(href: string | undefined, hash: string | undefined) {
  if (!href) {
    return undefined
  }

  if (!hash) {
    return href
  }

  return `${href}#${hash}`
}
