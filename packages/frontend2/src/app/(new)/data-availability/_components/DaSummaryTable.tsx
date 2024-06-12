'use client'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
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
import { TableFacetedFilter } from '~/app/_components/table/table-faceted-filter'
import { TableToolbar } from '~/app/_components/table/table-toolbar'
import { formatNumber } from '~/utils/format-number'

type DataAvailabilityProvider = {
  index: number
  daLayer: string
  daBridge: { name: string; network: string } | null
  risks: unknown
  layerType: string
  tvs: number
  economicSecurity: number
  usedBy: string[]
}

const mockData: DataAvailabilityProvider[] = withIndex([
  {
    daLayer: 'Celestia',
    daBridge: { name: 'Bridge1', network: 'Base' },
    risks: {},
    layerType: 'Public blockchain',
    tvs: 1_234_000_000,
    economicSecurity: 1_971_000_000,
    usedBy: ['Base', 'OP Mainnet'],
  },
  {
    daLayer: 'Anvil',
    daBridge: { name: 'BlobstreamX', network: 'Arbitrum' },
    risks: {},
    layerType: 'Private blockchain',
    tvs: 1_000,
    economicSecurity: 15_223,
    usedBy: ['Myria', 'ApeX'],
  },
  {
    daLayer: 'DA Solution',
    daBridge: null,
    risks: {},
    layerType: 'No clue',
    tvs: 1_000_000,
    economicSecurity: 1_000_200,
    usedBy: ['No clue', 'Random'],
  },
])

const columnHelper = createColumnHelper<DataAvailabilityProvider>()

const columns = [
  columnHelper.accessor('index', {
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
    cell: (ctx) => ctx.getValue().join(', '),
  }),
]

export function DaSummaryTable() {
  const table = useReactTable({
    data: mockData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    enableSortingRemoval: false,
    sortDescFirst: true,
    initialState: {
      sorting: [{ id: 'index', desc: false }],
    },
  })

  return (
    <>
      <TableToolbar>
        <TableFacetedFilter
          title="DA Layer"
          column={table.getColumn('daLayer')}
        />
        <TableFacetedFilter
          title="Layer type"
          column={table.getColumn('layerType')}
        />
      </TableToolbar>
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
    </>
  )
}

function withIndex<T>(array: T[]) {
  return array.map((item, index) => ({ ...item, index }))
}
