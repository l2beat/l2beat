'use client'
import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableHeaderRow,
  TableRow,
} from '~/app/_components/table/table'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'
import { useTable } from '~/hooks/use-table'
import { columns } from './columns'
import { type ScalingSummaryLayer2sEntry } from '~/server/features/scaling/get-scaling-summary-entries'

interface Props {
  items: ScalingSummaryLayer2sEntry[]
}

export function SummaryLayer2sTable({ items }: Props) {
  const table = useTable({
    data: items,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [
        {
          id: 'total',
          desc: true,
        },
      ],
    },
  })

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableHeaderRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                colSpan={header.colSpan}
                onClick={header.column.getToggleSortingHandler()}
                sorting={
                  header.column.getCanSort()
                    ? {
                        direction: header.column.getIsSorted(),
                        nextDirection: header.column.getNextSortingOrder(),
                      }
                    : undefined
                }
                className={header.column.columnDef.meta?.headClassName}
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
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell
                key={cell.id}
                href={`/scaling/projects/${row.original.slug}`}
                className={cell.column.columnDef.meta?.cellClassName}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
