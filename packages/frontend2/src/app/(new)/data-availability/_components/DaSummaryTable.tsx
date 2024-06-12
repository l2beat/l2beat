'use client'

import {
  type SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'
import { SortingArrows } from '~/app/_components/table/sorting-arrows'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableHeaderRow,
  TableRow,
} from '~/app/_components/table/table'
import { formatNumber } from '~/utils/format-number'

type DataAvailabilityProvider = {
  daLayer: string
  daBridge: { name: string; network: string } | null
  risks: unknown
  layerType: string
  tvs: number
  economicSecurity: number
  usedBy: string[]
}

const mockData: DataAvailabilityProvider[] = [
  {
    daLayer: 'Celestia',
    daBridge: { name: 'Bridge1', network: 'Base' },
    risks: {},
    layerType: 'Public blockchain',
    tvs: 1_234_000_000,
    economicSecurity: 1_971_000_000,
    usedBy: ['Project1', 'Project2'],
  },
  {
    daLayer: 'Celestia',
    daBridge: { name: 'BlobstreamX', network: 'Arbitrum' },
    risks: {},
    layerType: 'Public blockchain',
    tvs: 1_000_000_000,
    economicSecurity: 15_223_000_000,
    usedBy: ['Project1', 'Project2'],
  },
  {
    daLayer: 'Celestia',
    daBridge: null,
    risks: {},
    layerType: 'Public blockchain',
    tvs: 1_000_000_000,
    economicSecurity: 1_000_200_000_000,
    usedBy: ['Project1', 'Project2'],
  },
]

const columnHelper = createColumnHelper<DataAvailabilityProvider>()

const columns = [
  columnHelper.display({
    header: '#',
    cell: (ctx) => ctx.row.index + 1,
  }),
  columnHelper.accessor('daLayer', {
    header: 'DA Layer',
  }),
  columnHelper.accessor('daBridge', {
    header: 'DA Bridge',
    cell: (ctx) =>
      ctx.getValue()
        ? `${ctx.getValue()?.name} on ${ctx.getValue()?.network}`
        : 'No bridge',
  }),
  columnHelper.accessor('risks', {
    cell: () => 'TBD',
  }),
  columnHelper.accessor('layerType', {
    header: 'Layer type',
  }),
  columnHelper.accessor('tvs', {
    header: 'Total value secured',
    cell: (ctx) => `$${formatNumber(ctx.getValue(), 2)}`,
  }),
  columnHelper.accessor('economicSecurity', {
    header: 'Economic security',
    cell: (ctx) => `$${formatNumber(ctx.getValue(), 2)}`,
  }),
  columnHelper.accessor('usedBy', {
    header: 'Used by',
  }),
]

export function DaSummaryTable() {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'daLayer',
      desc: true,
    },
  ])

  const table = useReactTable({
    data: mockData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    getFacetedUniqueValues: getFacetedUniqueValues(),
    enableSortingRemoval: false,
    sortDescFirst: true,
    state: {
      sorting,
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
              >
                {header.isPlaceholder ? null : header.column.getCanSort() ? (
                  <SortingArrows
                    sortDirection={header.column.getIsSorted()}
                    nextSortDirection={header.column.getNextSortingOrder()}
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
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id} className="h-9 md:h-14">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
