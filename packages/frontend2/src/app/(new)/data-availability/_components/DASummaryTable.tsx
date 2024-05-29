'use client'

import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table'
import { formatNumber } from '~/utils/formatNumber'

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
    cell: (ctx) => ctx.getValue(),
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

export function DASummaryTable() {
  const table = useReactTable({
    data: mockData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <table className="w-full text-left">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className="whitespace-pre py-2 align-bottom text-sm font-medium uppercase text-gray-500 dark:text-gray-50 w-0 pr-l pr-3 last:pr-0 md:pr-4"
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr
            key={row.id}
            className="group/table-row cursor-pointer border-b border-b-gray-200 dark:border-b-zinc-700 hover:bg-black/[0.05] hover:shadow-sm dark:hover:bg-white/[0.1]"
          >
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="h-9 md:h-14">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        {table.getFooterGroups().map((footerGroup) => (
          <tr key={footerGroup.id}>
            {footerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.footer,
                      header.getContext(),
                    )}
              </th>
            ))}
          </tr>
        ))}
      </tfoot>
    </table>
  )
}
