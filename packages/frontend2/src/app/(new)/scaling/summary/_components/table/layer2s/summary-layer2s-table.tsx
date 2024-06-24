'use client'
import React from 'react'
import { type ScalingSummaryLayer2sEntry as ScalingSummaryLayer2sEntry } from '../../../_utils/scaling-summary-entry'
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

interface Props {
  items: ScalingSummaryLayer2sEntry[]
}

export function SummaryLayer2sTable({ items }: Props) {
  const table = useTable({
    data: items,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
